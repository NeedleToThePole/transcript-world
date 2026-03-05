import mongoose from 'mongoose';

const teacherCodeSchema = new mongoose.Schema({
    program: { type: String, default: '' },
    code: { type: String, default: '' },
    teacherEmail: { type: String, default: '' },
    teacherName: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('TeacherCode', teacherCodeSchema);
