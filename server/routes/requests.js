import { Router } from 'express';
import Request from '../models/Request.js';

const router = Router();

// GET /api/requests — all requests OR filtered
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.id) filter._id = req.query.id;
        if (req.query.status) filter.status = req.query.status;

        const requests = await Request.find(filter).sort({ createdAt: -1 }).lean();
        res.json(requests.map(r => ({ ...r, id: r._id })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/requests/:id
router.get('/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id).lean();
        if (!request) return res.status(404).json({ error: 'Request not found' });
        res.json({ ...request, id: request._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/requests — create new request
router.post('/', async (req, res) => {
    try {
        const request = await Request.create(req.body);
        res.status(201).json({ ...request.toObject(), id: request._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PATCH /api/requests/:id — update (e.g. status change)
router.patch('/:id', async (req, res) => {
    try {
        const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!request) return res.status(404).json({ error: 'Request not found' });
        res.json({ ...request, id: request._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
