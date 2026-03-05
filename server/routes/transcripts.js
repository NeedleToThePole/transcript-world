import { Router } from 'express';
import Transcript from '../models/Transcript.js';

const router = Router();

// GET /api/transcripts — filtered by studentId
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.studentId) filter.studentId = req.query.studentId;

        const transcripts = await Transcript.find(filter).lean();
        res.json(transcripts.map(t => ({ ...t, id: t._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/transcripts/:id
router.get('/:id', async (req, res) => {
    try {
        const transcript = await Transcript.findById(req.params.id).lean();
        if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
        res.json({ ...transcript, id: transcript._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/transcripts — create new transcript
router.post('/', async (req, res) => {
    try {
        const transcript = await Transcript.create(req.body);
        res.status(201).json({ ...transcript.toObject(), id: transcript._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT /api/transcripts/:id — full update
router.put('/:id', async (req, res) => {
    try {
        const { _id, id, ...updateData } = req.body; // strip id fields
        const transcript = await Transcript.findByIdAndUpdate(req.params.id, updateData, { new: true }).lean();
        if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
        res.json({ ...transcript, id: transcript._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
