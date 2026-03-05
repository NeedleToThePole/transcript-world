import { Router } from 'express';
import ArchivedStudent from '../models/ArchivedStudent.js';

const router = Router();

// GET /api/archivedStudents
router.get('/', async (req, res) => {
    try {
        const students = await ArchivedStudent.find().lean();
        res.json(students.map(s => ({ ...s, id: s._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/archivedStudents — archive a student
router.post('/', async (req, res) => {
    try {
        const student = await ArchivedStudent.create(req.body);
        res.status(201).json({ ...student.toObject(), id: student._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
