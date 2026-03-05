import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    studentId: { type: String, default: '' },
    email: { type: String, default: '' },
    program: { type: String, default: '' },
    type: { type: String, default: 'Official' },
    deliveryMethod: { type: String, default: 'Email' },
    status: { type: String, default: 'Pending' },
    requestDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    transcriptId: { type: String, default: null },
    enrolledStudentId: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
