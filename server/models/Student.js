import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    studentId: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    program: { type: String, default: '' },
    archived: { type: Boolean, default: false },
}, { timestamps: true });

studentSchema.index({ program: 1, archived: 1 });
studentSchema.index({ studentId: 1, program: 1 });

export default mongoose.model('Student', studentSchema);
