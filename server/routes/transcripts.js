import { Router } from 'express';
import Transcript from '../models/Transcript.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// GET /api/transcripts — requires authentication, filtered by studentId
router.get('/', requireAuth, async (req, res) => {
    try {
        const filter = {};
        if (typeof req.query.studentId === 'string' && req.query.studentId.trim()) {
            filter.studentId = req.query.studentId.trim();
        } else if (req.user.role === 'teacher') {
            filter.program = req.user.program;
        }

        const transcripts = await Transcript.find(filter).lean();
        res.json(transcripts.map(t => ({ ...t, id: t._id })));
    } catch {
        res.status(500).json({ error: 'Failed to load transcripts.' });
    }
});

// GET /api/transcripts/:id — requires authentication
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const transcript = await Transcript.findById(String(req.params.id)).lean();
        if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
        res.json({ ...transcript, id: transcript._id });
    } catch {
        res.status(500).json({ error: 'Failed to load transcript.' });
    }
});

// POST /api/transcripts — create new transcript (requires authentication)
router.post('/', requireAuth, async (req, res) => {
    try {
        const b = req.body || {};
        const transcript = await Transcript.create({
            studentId: String(b.studentId || '').trim(),
            program: String(b.program || req.user.program || '').trim(),
            header: b.header && typeof b.header === 'object' ? b.header : {},
            colHours: Array.isArray(b.colHours) ? b.colHours : [],
            colDates: Array.isArray(b.colDates) ? b.colDates : [],
            status: b.status === 'complete' ? 'complete' : 'in_progress',
            lastModified: new Date().toISOString(),
            createdDate: new Date().toISOString().split('T')[0],
        });
        res.status(201).json({ ...transcript.toObject(), id: transcript._id });
    } catch {
        res.status(400).json({ error: 'Failed to save transcript.' });
    }
});

// PUT /api/transcripts/:id — full update (requires authentication)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const b = req.body || {};
        const updateData = {
            header: b.header && typeof b.header === 'object' ? b.header : {},
            colHours: Array.isArray(b.colHours) ? b.colHours : [],
            colDates: Array.isArray(b.colDates) ? b.colDates : [],
            status: b.status === 'complete' ? 'complete' : 'in_progress',
            lastModified: new Date().toISOString(),
        };
        if (typeof b.program === 'string' && b.program.trim()) {
            updateData.program = b.program.trim();
        }
        if (typeof b.studentId === 'string' && b.studentId.trim()) {
            updateData.studentId = b.studentId.trim();
        }

        const transcript = await Transcript.findByIdAndUpdate(
            String(req.params.id),
            updateData,
            { new: true }
        ).lean();
        if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
        res.json({ ...transcript, id: transcript._id });
    } catch {
        res.status(400).json({ error: 'Failed to update transcript.' });
    }
});

export default router;
