import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    ssn: { type: String, default: '' },
    dob: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    studentId: { type: String, default: '' },

    // Mailing Address
    addressStreet: { type: String, default: '' },
    addressCity: { type: String, default: '' },
    addressState: { type: String, default: '' },
    addressZip: { type: String, default: '' },

    // School History
    yearEnrolled: { type: String, default: '' },
    yearLastAttended: { type: String, default: '' },
    semester: { type: String, default: '' },
    program: { type: String, default: '' },

    // Request Options
    type: { type: String, default: 'Official' },
    deliveryMethod: { type: String, default: 'Email' },
    processingOption: { type: String, default: 'Process Immediately' },
    copies: { type: Number, default: 1 },

    // Forwarding Details
    forwardName: { type: String, default: '' },
    forwardStreet: { type: String, default: '' },
    forwardCity: { type: String, default: '' },
    forwardState: { type: String, default: '' },
    forwardZip: { type: String, default: '' },
    forwardPhone: { type: String, default: '' },

    status: { type: String, default: 'Pending' },
    requestDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    transcriptId: { type: String, default: null },
    enrolledStudentId: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Request', requestSchema);
