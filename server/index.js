import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

// Route imports
import studentsRouter from './routes/students.js';
import requestsRouter from './routes/requests.js';
import transcriptsRouter from './routes/transcripts.js';
import teacherCodesRouter from './routes/teacherCodes.js';
import archivedStudentsRouter from './routes/archivedStudents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/students', studentsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/transcripts', transcriptsRouter);
app.use('/api/teacherCodes', teacherCodesRouter);
app.use('/api/archivedStudents', archivedStudentsRouter);

// --- Legacy routes (without /api prefix) for backward compatibility ---
// This lets the frontend work with BOTH the old json-server URLs and new /api/ URLs
app.use('/students', studentsRouter);
app.use('/requests', requestsRouter);
app.use('/transcripts', transcriptsRouter);
app.use('/teacherCodes', teacherCodesRouter);
app.use('/archivedStudents', archivedStudentsRouter);

// Serve React frontend in production
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// All non-API routes serve the React app (client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Connect to MongoDB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📦 Serving frontend from: ${distPath}`);
    });
});
