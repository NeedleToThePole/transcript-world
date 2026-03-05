/**
 * Seed script — imports data from db.json into MongoDB Atlas.
 * Run once: node server/seed.js
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from './db.js';
import Student from './models/Student.js';
import Request from './models/Request.js';
import Transcript from './models/Transcript.js';
import TeacherCode from './models/TeacherCode.js';
import ArchivedStudent from './models/ArchivedStudent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    await connectDB();

    // Read existing db.json
    const dbPath = path.join(__dirname, '..', 'db.json');
    if (!fs.existsSync(dbPath)) {
        console.error('❌ db.json not found at:', dbPath);
        process.exit(1);
    }

    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    await Student.deleteMany({});
    await Request.deleteMany({});
    await Transcript.deleteMany({});
    await TeacherCode.deleteMany({});
    await ArchivedStudent.deleteMany({});
    console.log('   Cleared existing data');

    // Seed students
    if (db.students?.length) {
        // Strip json-server IDs, let MongoDB generate _id
        const students = db.students.map(({ id, ...rest }) => rest);
        await Student.insertMany(students);
        console.log(`   ✅ Imported ${students.length} students`);
    }

    // Seed requests
    if (db.requests?.length) {
        const requests = db.requests.map(({ id, ...rest }) => rest);
        await Request.insertMany(requests);
        console.log(`   ✅ Imported ${requests.length} requests`);
    }

    // Seed transcripts
    if (db.transcripts?.length) {
        const transcripts = db.transcripts.map(({ id, ...rest }) => rest);
        await Transcript.insertMany(transcripts);
        console.log(`   ✅ Imported ${transcripts.length} transcripts`);
    }

    // Seed teacher codes
    if (db.teacherCodes?.length) {
        const codes = db.teacherCodes.map(({ id, ...rest }) => rest);
        await TeacherCode.insertMany(codes);
        console.log(`   ✅ Imported ${codes.length} teacher codes`);
    }

    // Seed archived students
    if (db.archivedStudents?.length) {
        const archived = db.archivedStudents.map(({ id, ...rest }) => rest);
        await ArchivedStudent.insertMany(archived);
        console.log(`   ✅ Imported ${archived.length} archived students`);
    }

    console.log('\n🎉 Seed complete!');
    await mongoose.connection.close();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
