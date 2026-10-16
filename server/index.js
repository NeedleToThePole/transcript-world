import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db.js';

// Route imports
import authRouter from './routes/auth.js';
import studentsRouter from './routes/students.js';
import requestsRouter from './routes/requests.js';
import transcriptsRouter from './routes/transcripts.js';
import teacherCodesRouter from './routes/teacherCodes.js';
import archivedStudentsRouter from './routes/archivedStudents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers Middleware
app.disable('x-powered-by');
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : null;
app.use(
    cors(
        allowedOrigins
            ? { origin: allowedOrigins, credentials: true }
            : undefined
    )
);
app.use(express.json({ limit: '500kb' }));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/transcripts', transcriptsRouter);
app.use('/api/teacherCodes', teacherCodesRouter);
app.use('/api/archivedStudents', archivedStudentsRouter);

// --- Legacy routes (without /api prefix) for backward compatibility ---
app.use('/auth', authRouter);
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
