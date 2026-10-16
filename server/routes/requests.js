import { Router } from 'express';
import Request from '../models/Request.js';
import Student from '../models/Student.js';
import Transcript from '../models/Transcript.js';
import { requireAuth, verifyToken } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

const createRequestLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: 'Too many transcript requests submitted. Please wait 15 minutes before trying again.',
});

function escapeRegex(str) {
    return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function lookupStudentServerSide({ studentId, program, email, firstName, lastName }) {
    if (!program || !program.trim()) {
        return { status: 'verification_needed', student: null, transcript: null };
    }

    const programFilter = new RegExp('^' + escapeRegex(program.trim()) + '$', 'i');
    let matchedStudents = [];

    // 1. Try matching by studentId (trimmed, case-insensitive)
    if (studentId && studentId.trim()) {
        const sIdRegex = new RegExp('^' + escapeRegex(studentId.trim()) + '$', 'i');
        matchedStudents = await Student.find({
            studentId: sIdRegex,
            program: programFilter,
            archived: false,
        }).lean();
    }

    // 2. Fallback: try matching by email
    if (matchedStudents.length === 0 && email && email.trim()) {
        const emailRegex = new RegExp('^' + escapeRegex(email.trim()) + '$', 'i');
        matchedStudents = await Student.find({
            email: emailRegex,
            program: programFilter,
            archived: false,
        }).lean();
    }

    // 3. Fallback: try matching by First & Last Name
    if (matchedStudents.length === 0 && firstName && lastName && firstName.trim() && lastName.trim()) {
        const fRegex = new RegExp('^' + escapeRegex(firstName.trim()) + '$', 'i');
        const lRegex = new RegExp('^' + escapeRegex(lastName.trim()) + '$', 'i');
        matchedStudents = await Student.find({
            firstName: fRegex,
            lastName: lRegex,
            program: programFilter,
            archived: false,
        }).lean();
    }

    if (matchedStudents.length === 0) {
        return { status: 'verification_needed', student: null, transcript: null };
    }

    const student = matchedStudents[0];
    const transcript = await Transcript.findOne({ studentId: String(student._id) }).lean();

    if (transcript && transcript.status === 'complete') {
        return { status: 'ready', student, transcript };
    } else if (transcript) {
        return { status: 'in_progress', student, transcript };
    } else {
        return { status: 'awaiting_grades', student, transcript: null };
    }
}

// GET /api/requests — requires authentication; teachers only see their own program
router.get('/', requireAuth, async (req, res) => {
    try {
        const filter = {};
        if (typeof req.query.id === 'string' && req.query.id.trim()) {
            filter._id = req.query.id.trim();
        }
        if (typeof req.query.status === 'string' && req.query.status.trim()) {
            filter.status = req.query.status.trim();
        }
        if (req.user.role === 'teacher') {
            filter.program = req.user.program;
        }

        const requests = await Request.find(filter).sort({ createdAt: -1 }).lean();
        res.json(requests.map(r => ({ ...r, id: r._id })));
    } catch {
        res.status(500).json({ error: 'Failed to load transcript requests.' });
    }
});

// GET /api/requests/:id — requires authentication
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const request = await Request.findById(String(req.params.id)).lean();
        if (!request) return res.status(404).json({ error: 'Request not found' });

        if (req.user.role === 'teacher' && request.program !== req.user.program) {
            return res.status(403).json({ error: 'Access denied for this program.' });
        }

        res.json({ ...request, id: request._id });
    } catch {
        res.status(500).json({ error: 'Failed to load transcript request.' });
    }
});

// POST /api/requests — create new request (public with server-side verification, or authenticated staff)
router.post('/', createRequestLimiter, async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
        const staffUser = token ? verifyToken(token) : null;

        const b = req.body || {};
        const cleanStr = (val) => (typeof val === 'string' ? val.trim() : '');

        const safeFields = {
            firstName: cleanStr(b.firstName),
            lastName: cleanStr(b.lastName),
            ssn: cleanStr(b.ssn).slice(0, 4),
            dob: cleanStr(b.dob),
            phone: cleanStr(b.phone),
            email: cleanStr(b.email),
            studentId: cleanStr(b.studentId),
            addressStreet: cleanStr(b.addressStreet),
            addressCity: cleanStr(b.addressCity),
            addressState: cleanStr(b.addressState),
            addressZip: cleanStr(b.addressZip),
            yearEnrolled: cleanStr(b.yearEnrolled),
            yearLastAttended: cleanStr(b.yearLastAttended),
            semester: cleanStr(b.semester),
            program: cleanStr(b.program),
            type: cleanStr(b.type) || 'Official',
            deliveryMethod: cleanStr(b.deliveryMethod) || 'Email',
            processingOption: cleanStr(b.processingOption) || 'Process Immediately',
            copies: Math.max(1, Math.min(20, parseInt(b.copies, 10) || 1)),
            forwardName: cleanStr(b.forwardName),
            forwardStreet: cleanStr(b.forwardStreet),
            forwardCity: cleanStr(b.forwardCity),
            forwardState: cleanStr(b.forwardState),
            forwardZip: cleanStr(b.forwardZip),
            forwardPhone: cleanStr(b.forwardPhone),
            requestDate: new Date().toISOString().split('T')[0],
        };

        let status, notInSystem = false, transcriptId = null, enrolledStudentId = null, userMessage = '';

        if (staffUser && (b.transcriptId || b.enrolledStudentId)) {
            // Staff-initiated request creation from TranscriptEditor
            if (staffUser.role === 'teacher' && safeFields.program !== staffUser.program) {
                return res.status(403).json({ error: 'Access denied for this program.' });
            }
            status = cleanStr(b.status) || 'Ready for Review';
            notInSystem = Boolean(b.notInSystem);
            transcriptId = cleanStr(b.transcriptId) || null;
            enrolledStudentId = cleanStr(b.enrolledStudentId) || null;
            userMessage = 'Request created by staff.';
        } else {
            // Public student submission — perform server-side enrollment verification
            const lookup = await lookupStudentServerSide(safeFields);
            if (lookup.status === 'ready') {
                status = 'Ready for Review';
                notInSystem = false;
                userMessage = 'Your transcript is complete and has been sent to the admin for review!';
            } else if (lookup.status === 'in_progress' || lookup.status === 'awaiting_grades') {
                status = 'Pending — Awaiting Grades';
                notInSystem = false;
                userMessage = 'Your request has been submitted. Your instructor has not yet completed your transcript.';
            } else {
                status = 'Not in System';
                notInSystem = true;
                userMessage = 'Your transcript request has been received! Because your records were not automatically found in the system roster, your request has been forwarded to the administration and your program instructor for verification.';
            }
            transcriptId = lookup.transcript ? String(lookup.transcript._id) : null;
            enrolledStudentId = lookup.student ? String(lookup.student._id) : null;
        }

        const request = await Request.create({
            ...safeFields,
            status,
            notInSystem,
            transcriptId,
            enrolledStudentId,
        });

        res.status(201).json({
            ...request.toObject(),
            id: request._id,
            userMessage,
        });
    } catch {
        res.status(400).json({ error: 'Failed to submit transcript request.' });
    }
});

// PATCH /api/requests/:id — requires authentication
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const existing = await Request.findById(String(req.params.id)).lean();
        if (!existing) return res.status(404).json({ error: 'Request not found' });

        if (req.user.role === 'teacher' && existing.program !== req.user.program) {
            return res.status(403).json({ error: 'Access denied for this program.' });
        }

        const allowedUpdates = {};
        if (typeof req.body.status === 'string') allowedUpdates.status = req.body.status.trim();
        if (typeof req.body.notInSystem === 'boolean') allowedUpdates.notInSystem = req.body.notInSystem;
        if (req.body.enrolledStudentId !== undefined) {
            allowedUpdates.enrolledStudentId = req.body.enrolledStudentId ? String(req.body.enrolledStudentId) : null;
        }
        if (req.body.transcriptId !== undefined) {
            allowedUpdates.transcriptId = req.body.transcriptId ? String(req.body.transcriptId) : null;
        }

        const request = await Request.findByIdAndUpdate(String(req.params.id), allowedUpdates, { new: true }).lean();
        res.json({ ...request, id: request._id });
    } catch {
        res.status(400).json({ error: 'Failed to update transcript request.' });
    }
});

export default router;
