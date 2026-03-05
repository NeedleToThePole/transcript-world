import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema({
    studentId: { type: String, required: true, index: true },
    program: { type: String, required: true },
    header: { type: mongoose.Schema.Types.Mixed, default: {} },
    colHours: { type: [[String]], default: [] },
    status: { type: String, default: 'in_progress' },  // 'in_progress' | 'complete'
    lastModified: { type: String, default: () => new Date().toISOString() },
    createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

export default mongoose.model('Transcript', transcriptSchema);
