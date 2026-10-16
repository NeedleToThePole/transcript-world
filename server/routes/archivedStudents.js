import { Router } from 'express';
import ArchivedStudent from '../models/ArchivedStudent.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/archivedStudents — requires authentication
router.get('/', requireAuth, async (req, res) => {
    try {
        const filter = req.user.role === 'teacher' ? { program: req.user.program } : {};
        const students = await ArchivedStudent.find(filter).lean();
        res.json(students.map(s => ({ ...s, id: s._id })));
    } catch {
        res.status(500).json({ error: 'Failed to load archived students.' });
    }
});

// POST /api/archivedStudents — archive a student (requires authentication)
router.post('/', requireAuth, async (req, res) => {
    try {
        const b = req.body || {};
        const cleanStr = (val) => (typeof val === 'string' ? val.trim() : '');
        const program = req.user.role === 'teacher' ? req.user.program : cleanStr(b.program);

        const student = await ArchivedStudent.create({
            studentId: cleanStr(b.studentId),
            firstName: cleanStr(b.firstName),
            lastName: cleanStr(b.lastName),
            email: cleanStr(b.email),
            phone: cleanStr(b.phone),
            program,
            archivedDate: new Date().toISOString().split('T')[0],
        });
        res.status(201).json({ ...student.toObject(), id: student._id });
    } catch {
        res.status(400).json({ error: 'Failed to archive student.' });
    }
});

export default router;
