import { Router } from 'express';
import TeacherCode from '../models/TeacherCode.js';

const router = Router();

// GET /api/teacherCodes — all teacher codes
router.get('/', async (req, res) => {
    try {
        const codes = await TeacherCode.find().lean();
        res.json(codes.map(c => ({ ...c, id: c._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
