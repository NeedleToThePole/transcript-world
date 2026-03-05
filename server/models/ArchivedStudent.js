import mongoose from 'mongoose';

const archivedStudentSchema = new mongoose.Schema({
    studentId: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    program: { type: String, default: '' },
    archived: { type: Boolean, default: true },
    archivedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
}, { timestamps: true });

export default mongoose.model('ArchivedStudent', archivedStudentSchema);
