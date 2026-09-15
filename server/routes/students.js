import { Router } from 'express';
import Student from '../models/Student.js';

const router = Router();

function escapeRegex(str) {
    return (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/students — all students OR filtered by query params with multi-factor fallback
router.get('/', async (req, res) => {
    try {
        const { program, studentId, email, firstName, lastName, archived, id } = req.query;

        // Specific lookup by MongoDB _id
        if (id) {
            const students = await Student.find({ _id: id }).lean();
            return res.json(students.map(s => ({ ...s, id: s._id })));
        }

        const isArchived = archived !== undefined ? archived === 'true' : false;
        const programFilter = program ? new RegExp('^' + escapeRegex(program.trim()) + '$', 'i') : null;

        // If performing a student verification lookup (has studentId, email, or name along with program)
        if (programFilter && (studentId || email || (firstName && lastName))) {
            let matchedStudents = [];

            // 1. Try matching by studentId (trimmed, case-insensitive)
            if (studentId && studentId.trim()) {
                const sIdRegex = new RegExp('^' + escapeRegex(studentId.trim()) + '$', 'i');
                matchedStudents = await Student.find({
                    studentId: sIdRegex,
                    program: programFilter,
                    archived: isArchived
                }).lean();
            }

            // 2. Fallback: try matching by email if no match by studentId
            if (matchedStudents.length === 0 && email && email.trim()) {
                const emailRegex = new RegExp('^' + escapeRegex(email.trim()) + '$', 'i');
                matchedStudents = await Student.find({
                    email: emailRegex,
                    program: programFilter,
                    archived: isArchived
                }).lean();
            }

            // 3. Fallback: try matching by First & Last Name if still no match
            if (matchedStudents.length === 0 && firstName && lastName && firstName.trim() && lastName.trim()) {
                const fRegex = new RegExp('^' + escapeRegex(firstName.trim()) + '$', 'i');
                const lRegex = new RegExp('^' + escapeRegex(lastName.trim()) + '$', 'i');
                matchedStudents = await Student.find({
                    firstName: fRegex,
                    lastName: lRegex,
                    program: programFilter,
                    archived: isArchived
                }).lean();
            }

            if (matchedStudents.length > 0) {
                return res.json(matchedStudents.map(s => ({ ...s, id: s._id })));
            }
        }

        // Standard filter for general queries (e.g., teacher rosters, student listings)
        const filter = {};
        if (programFilter) filter.program = programFilter;
        if (archived !== undefined) filter.archived = isArchived;
        if (studentId) filter.studentId = new RegExp('^' + escapeRegex(studentId.trim()) + '$', 'i');
        if (email) filter.email = new RegExp('^' + escapeRegex(email.trim()) + '$', 'i');

        const students = await Student.find(filter).lean();
        res.json(students.map(s => ({ ...s, id: s._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/students/:id — single student by MongoDB _id
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).lean();
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ ...student, id: student._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/students — add a new student
router.post('/', async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ ...student.toObject(), id: student._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/students/:id — partial update
router.patch('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ ...student, id: student._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
