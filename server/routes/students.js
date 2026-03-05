import { Router } from 'express';
import Student from '../models/Student.js';

const router = Router();

// GET /api/students — all students OR filtered by query params
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.program) filter.program = req.query.program;
        if (req.query.archived !== undefined) filter.archived = req.query.archived === 'true';
        if (req.query.studentId) filter.studentId = req.query.studentId;
        if (req.query.id) filter._id = req.query.id;

        const students = await Student.find(filter).lean();
        // Map _id to id for frontend compatibility
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
