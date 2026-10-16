import { Router } from 'express';
import TeacherCode from '../models/TeacherCode.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

// GET /api/teacherCodes — returns program list (never exposes secret `code`)
router.get('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
        const user = token ? verifyToken(token) : null;
        const isAdmin = user?.role === 'admin';

        // Never select the secret `code` field
        const codes = await TeacherCode.find({}, '-code').lean();
        res.json(
            codes.map(c =>
                isAdmin
                    ? { id: c._id, program: c.program, teacherName: c.teacherName, teacherEmail: c.teacherEmail }
                    : { id: c._id, program: c.program }
            )
        );
    } catch {
        res.status(500).json({ error: 'Failed to load programs.' });
    }
});

export default router;
