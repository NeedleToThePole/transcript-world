import { Router } from 'express';
import crypto from 'crypto';
import TeacherCode from '../models/TeacherCode.js';
import { signToken } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';

const router = Router();

const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many login attempts. Please wait 15 minutes before trying again.',
});

function safeCompare(a, b) {
    const strA = String(a || '');
    const strB = String(b || '');
    const bufA = Buffer.from(strA);
    const bufB = Buffer.from(strB);
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/auth/admin
router.post('/admin', loginLimiter, (req, res) => {
    const submittedPassword = typeof req.body?.password === 'string' ? req.body.password : '';
    const expectedPassword = process.env.ADMIN_PASSWORD || '0000';

    if (!safeCompare(submittedPassword, expectedPassword)) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
    }

    const token = signToken({ role: 'admin' });
    return res.json({ token, role: 'admin' });
});

// POST /api/auth/teacher
router.post('/teacher', loginLimiter, async (req, res) => {
    try {
        const program = typeof req.body?.program === 'string' ? req.body.program.trim() : '';
        const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';

        if (!program || !code) {
            return res.status(400).json({ error: 'Program and access code are required.' });
        }

        const record = await TeacherCode.findOne({ program }).lean();
        if (!record || !safeCompare(code, record.code)) {
            return res.status(401).json({ error: 'Invalid access code. Please try again.' });
        }

        const token = signToken({ role: 'teacher', program: record.program });
        return res.json({ token, role: 'teacher', program: record.program });
    } catch {
        return res.status(500).json({ error: 'Authentication failed.' });
    }
});

export default router;
