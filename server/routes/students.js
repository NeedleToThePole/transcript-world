import { Router } from 'express';
import Student from '../models/Student.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function escapeRegex(str) {
    return String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/students — requires authentication; teachers are scoped to their own program
router.get('/', requireAuth, async (req, res) => {
    try {
        const id = typeof req.query.id === 'string' ? req.query.id.trim() : '';
        if (id) {
            const students = await Student.find({ _id: id }).lean();
            const filtered = req.user.role === 'teacher'
                ? students.filter(s => s.program === req.user.program)
                : students;
            return res.json(filtered.map(s => ({ ...s, id: s._id })));
        }

        const requestedProgram = req.user.role === 'teacher'
            ? req.user.program
            : (typeof req.query.program === 'string' ? req.query.program.trim() : '');

        const studentId = typeof req.query.studentId === 'string' ? req.query.studentId.trim() : '';
        const email = typeof req.query.email === 'string' ? req.query.email.trim() : '';
        const archived = req.query.archived;
        const isArchived = archived !== undefined ? archived === 'true' : false;

        const filter = {};
        if (requestedProgram) {
            filter.program = new RegExp('^' + escapeRegex(requestedProgram) + '$', 'i');
        }
        if (archived !== undefined) {
            filter.archived = isArchived;
        }
        if (studentId) {
            filter.studentId = new RegExp('^' + escapeRegex(studentId) + '$', 'i');
        }
        if (email) {
            filter.email = new RegExp('^' + escapeRegex(email) + '$', 'i');
        }

        const students = await Student.find(filter).lean();
        res.json(students.map(s => ({ ...s, id: s._id })));
    } catch {
        res.status(500).json({ error: 'Failed to load students.' });
    }
});

// GET /api/students/:id — single student by MongoDB _id
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const student = await Student.findById(String(req.params.id)).lean();
        if (!student) return res.status(404).json({ error: 'Student not found' });

        if (req.user.role === 'teacher' && student.program !== req.user.program) {
            return res.status(403).json({ error: 'Access denied for this program.' });
        }

        res.json({ ...student, id: student._id });
    } catch {
        res.status(500).json({ error: 'Failed to load student.' });
    }
});

// POST /api/students — add a new student
router.post('/', requireAuth, async (req, res) => {
    try {
        const b = req.body || {};
        const cleanStr = (val) => (typeof val === 'string' ? val.trim() : '');
        const program = req.user.role === 'teacher' ? req.user.program : cleanStr(b.program);

        const student = await Student.create({
            firstName: cleanStr(b.firstName),
            lastName: cleanStr(b.lastName),
            email: cleanStr(b.email),
            phone: cleanStr(b.phone),
            studentId: cleanStr(b.studentId),
            program,
            archived: false,
        });
        res.status(201).json({ ...student.toObject(), id: student._id });
    } catch {
        res.status(400).json({ error: 'Failed to add student.' });
    }
});

// PATCH /api/students/:id — partial update
router.patch('/:id', requireAuth, async (req, res) => {
    try {
        const existing = await Student.findById(String(req.params.id)).lean();
        if (!existing) return res.status(404).json({ error: 'Student not found' });

        if (req.user.role === 'teacher' && existing.program !== req.user.program) {
            return res.status(403).json({ error: 'Access denied for this program.' });
        }

        const b = req.body || {};
        const allowed = {};
        if (typeof b.firstName === 'string') allowed.firstName = b.firstName.trim();
        if (typeof b.lastName === 'string') allowed.lastName = b.lastName.trim();
        if (typeof b.email === 'string') allowed.email = b.email.trim();
        if (typeof b.phone === 'string') allowed.phone = b.phone.trim();
        if (typeof b.studentId === 'string') allowed.studentId = b.studentId.trim();
        if (typeof b.archived === 'boolean') allowed.archived = b.archived;
        if (req.user.role === 'admin' && typeof b.program === 'string') {
            allowed.program = b.program.trim();
        }

        const student = await Student.findByIdAndUpdate(String(req.params.id), allowed, { new: true }).lean();
        res.json({ ...student, id: student._id });
    } catch {
        res.status(400).json({ error: 'Failed to update student.' });
    }
});

export default router;
