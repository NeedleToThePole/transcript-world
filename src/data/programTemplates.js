/**
 * Program-specific transcript templates.
 *
 * Each template defines:
 *   - title        : the heading printed on the transcript
 *   - layout       : '3col' (Allied Health style) | '2col' (Barbering style)
 *   - defaults     : default header values for that program
 *   - columns      : array of { heading, topics: [{ name, hoursReq }] }
 */

// ───────────────────────── Allied Health ─────────────────────────

const ALLIED_HEALTH = {
    title: 'ALLIED HEALTH & SCIENCES - Transcript',
    layout: '3col',
    defaults: {
        program: 'Clinical Medical Assisting',
        totalClassHours: '640',
        totalExternshipHours: '160',
        totalProgramHours: '800',
        totalAccumulated: '800',
        ceus: '80',
    },
    columns: [
        {
            heading: null, // no sub-heading for the 3-col layout
            topics: [
                { name: 'Medical Assisting Profession', hoursReq: 7.5 },
                { name: 'History & Practice', hoursReq: 7.5 },
                { name: 'Medical Term I', hoursReq: 1.5 },
                { name: 'Medical Law & Ethics', hoursReq: 7.5 },
                { name: 'Comm: Verbal & Nonverbal', hoursReq: 7.5 },
                { name: 'The Office Environment', hoursReq: 7.5 },
                { name: 'Medical Records/ Documentation', hoursReq: 20 },
                { name: 'Telephone Techniques', hoursReq: 7.5 },
                { name: 'Infection Control', hoursReq: 7.5 },
                { name: 'Vital Signs / Lab Practical', hoursReq: 30 },
                { name: 'Assisting with PE / Lab Practical', hoursReq: 15 },
                { name: 'Lab Practical', hoursReq: 20 },
                { name: '1st Sem. /Eval/Mid-Term Exam', hoursReq: 7.5 },
                { name: 'Medical Term II', hoursReq: 17.5 },
                { name: 'Body Structure & Function', hoursReq: 10 },
                { name: 'Assisting with Eye & Ear Care', hoursReq: 15 },
                { name: 'Assisting with Pediatrics', hoursReq: 15 },
                { name: 'Lab Practical', hoursReq: 15 },
                { name: 'Evaluation', hoursReq: 7.5 },
            ],
        },
        {
            heading: null,
            topics: [
                { name: 'Assisting with Repro/Urinary/OB/GYN', hoursReq: 20 },
                { name: 'Lab Practical', hoursReq: 10 },
                { name: 'Principles of EKG / Lab Practical', hoursReq: 32.5 },
                { name: 'Pulmonary Function', hoursReq: 10 },
                { name: '2nd Semester Eval/Final Exam', hoursReq: 7.5 },
                { name: 'Externship Prep Package', hoursReq: 2.5 },
                { name: 'Math for Pharmacology', hoursReq: 10 },
                { name: 'Pharmacology', hoursReq: 12.5 },
                { name: 'Administering Meds/Lab Practical', hoursReq: 30 },
                { name: 'Appointment Scheduling', hoursReq: 12.5 },
                { name: 'Medical Insurance', hoursReq: 12.5 },
                { name: 'Externship & Career Opportunities', hoursReq: 10 },
                { name: 'Assisting in Minor Surgery', hoursReq: 27.5 },
                { name: 'Evaluation (Minor Surgery)', hoursReq: 7.5 },
                { name: 'Medical Emergencies /Lab', hoursReq: 27.5 },
                { name: 'Evaluation Emergencies/Exam', hoursReq: 7.5 },
                { name: 'Assist with Medical Specialties', hoursReq: 10 },
                { name: 'Assist with Life Span/Geriatrics', hoursReq: 7.5 },
            ],
        },
        {
            heading: null,
            topics: [
                { name: 'Medical Office Management', hoursReq: 10 },
                { name: 'Basic Diagnosis Coding', hoursReq: 7.5 },
                { name: 'Patient Billing & Collection', hoursReq: 10 },
                { name: 'Professionalism', hoursReq: 7.5 },
                { name: 'The Clinical Laboratory', hoursReq: 10 },
                { name: 'Microbiology', hoursReq: 7.5 },
                { name: 'Urinalysis /Lab Practical', hoursReq: 10 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Phlebotomy & Blood Collection', hoursReq: 30 },
                { name: 'Hematology', hoursReq: 15 },
                { name: 'Clinical Practice & Evaluation', hoursReq: 15 },
                { name: 'Patient Education', hoursReq: 5 },
                { name: 'Senior Clinical Evaluation', hoursReq: 7.5 },
                { name: 'End of Sem Eval/Final Exam', hoursReq: 7.5 },
                { name: 'Externship Hours', hoursReq: 160 },
                { name: 'Total Program Hours', hoursReq: 800 },
            ],
        },
    ],
};

// ───────────────────────── Barbering ─────────────────────────

const BARBERING = {
    title: 'Barbering Foundation and Fundamental Transcript Hour Form',
    layout: '2col',
    defaults: {
        program: 'Barbering',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '500',
        totalAccumulated: '500',
        ceus: '50',
    },
    columns: [
        {
            heading: null,
            topics: [
                { name: 'History of Barbering', hoursReq: 5 },
                { name: 'Life Skills', hoursReq: 5 },
                { name: 'Professional Image', hoursReq: 5 },
                { name: 'Infection Control', hoursReq: 85 },
                { name: 'Implements, Tools, Equipment\'s', hoursReq: 25 },
                { name: 'Anatomy & Physiology', hoursReq: 15 },
                { name: 'Basics of Chemistry', hoursReq: 30 },
                { name: 'Basics of Electricity', hoursReq: 10 },
                { name: 'Skin Structure, Disorders & Diseases', hoursReq: 20 },
                { name: 'Properties and Disorders of the Hair and Scalp', hoursReq: 40 },
                { name: 'Treatment of the Hair and Scalp', hoursReq: 40 },
                { name: 'Men\'s Facial Massage and Treatment', hoursReq: 30 },
                { name: 'Shaving and Facial Hair Design', hoursReq: 40 },
                { name: 'Men\'s Haircutting and Styling', hoursReq: 150 },
                { name: 'Men\'s Hair Replacement', hoursReq: 25 },
            ],
        },
        {
            heading: null,
            topics: [
                { name: 'Women\'s Haircutting and Styling', hoursReq: 140 },
                { name: 'Chemical Texture Services', hoursReq: 30 },
                { name: 'Hair Coloring & Lightening', hoursReq: 20 },
                { name: 'Preparing for Licensure & Employment', hoursReq: 10 },
                { name: 'Working Behind the Chair', hoursReq: 10 },
                { name: 'The Business of Barbering', hoursReq: 20 },
            ],
        },
    ],
};

// ───────── Medical Administrative Assistant / Billing & Coding ─────────

const MED_ADMIN_ASSISTANT = {
    title: 'ALLIED HEALTH & SCIENCES - Transcript',
    layout: '2col-allied',
    defaults: {
        program: 'Medical Administrative Assistant/\nBilling & Coding Specialist',
        totalClassHours: '288',
        totalExternshipHours: '100',
        totalProgramHours: '388',
        totalAccumulated: '388',
        ceus: '38',
    },
    columns: [
        {
            heading: null,
            topics: [
                { name: 'The Profession & the Science', hoursReq: 6 },
                { name: 'History & Practice', hoursReq: 6 },
                { name: 'Medical Law & Ethics', hoursReq: 9 },
                { name: 'Patient Reception', hoursReq: 6 },
                { name: 'Medical Terminology I', hoursReq: 15 },
                { name: 'Anatomy & Physiology I', hoursReq: 18 },
                { name: 'Communication: Verbal & Nonverbal', hoursReq: 12 },
                { name: 'Office Environment', hoursReq: 6 },
                { name: 'Telephone Techniques', hoursReq: 9 },
                { name: 'Written Communication / Transcription', hoursReq: 18 },
                { name: 'Appointment Scheduling', hoursReq: 18 },
                { name: 'Managing Medical Records / Paper / HER', hoursReq: 15 },
                { name: 'Professionalism', hoursReq: 6 },
            ],
        },
        {
            heading: null,
            topics: [
                { name: 'Health Insurance Programs / Medical Insurance', hoursReq: 15 },
                { name: 'CMS-1500 Form Practice', hoursReq: 6 },
                { name: 'Medical Terminology II', hoursReq: 12 },
                { name: 'Anatomy & Physiology II', hoursReq: 15 },
                { name: 'Patient Education', hoursReq: 6 },
                { name: 'Introduction to ICD-10-CM Diagnosis Coding', hoursReq: 18 },
                { name: 'CPT Procedure Coding', hoursReq: 15 },
                { name: 'ICD & CPT Practices', hoursReq: 9 },
                { name: 'Externship & Career Opportunities/Career Development', hoursReq: 6 },
                { name: 'Fees, Billing & Collection', hoursReq: 15 },
                { name: 'Banking & Practice Finances', hoursReq: 15 },
                { name: 'Medical Office Management', hoursReq: 9 },
                { name: 'Final Exam', hoursReq: 3 },
                { name: 'Externship Hours', hoursReq: 100 },
                { name: 'Total Program Hours', hoursReq: 388 },
            ],
        },
    ],
};

// ──────────────── Cosmetology Foundation ────────────────

const COSMETOLOGY_FOUNDATION = {
    title: 'Cosmetology Foundation Transcript Form',
    layout: '1col',
    defaults: {
        program: 'Cosmetology Foundation',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '1500',
        totalAccumulated: '1500',
        ceus: '150',
    },
    columns: [
        {
            heading: null,
            topics: [
                { name: 'Life Skills', hoursReq: 5 },
                { name: 'Professional Image', hoursReq: 5 },
                { name: 'Communicating For Success', hoursReq: 5 },
                { name: 'The Healthy Professional', hoursReq: 30 },
                { name: 'Infection Control', hoursReq: 50 },
                { name: 'Chemistry and Chemical Safety', hoursReq: 20 },
                { name: 'Electricity and Electrical Safety', hoursReq: 20 },
                { name: 'Career Planning', hoursReq: 40 },
            ],
        },
    ],
};

// ──────────────── Cosmetology Fundamentals ────────────────

const COSMETOLOGY_FUNDAMENTALS = {
    title: 'Cosmetology Fundamentals Transcript Form',
    layout: '2col',
    defaults: {
        program: 'Cosmetology Fundamentals',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '1500',
        totalAccumulated: '1500',
        ceus: '150',
    },
    columns: [
        {
            heading: null,
            topics: [
                { name: 'History and Career Opportunities', hoursReq: 5 },
                { name: 'General Anatomy and Physiology', hoursReq: 40 },
                { name: 'Skin Structure and Growth', hoursReq: 30 },
                { name: 'Skin Disorders and Diseases', hoursReq: 30 },
                { name: 'Nail Structure and Growth', hoursReq: 25 },
                { name: 'Nail Disorders and Diseases', hoursReq: 30 },
                { name: 'Hair and Scalp Properties', hoursReq: 50 },
                { name: 'Hair and Scalp Disorders and Diseases', hoursReq: 50 },
                { name: 'Principles of Hair Design', hoursReq: 25 },
                { name: 'Hair Service Preparation', hoursReq: 35 },
                { name: 'Haircutting', hoursReq: 100 },
                { name: 'Hairstyling', hoursReq: 80 },
                { name: 'Braiding and Braid Extensions', hoursReq: 15 },
                { name: 'Wigs and Hair Additions', hoursReq: 20 },
                { name: 'Chemical Texture Services', hoursReq: 125 },
            ],
        },
        {
            heading: null,
            topics: [
                { name: 'Haircoloring', hoursReq: 125 },
                { name: 'Hair Removal', hoursReq: 75 },
                { name: 'Facials', hoursReq: 60 },
                { name: 'Makeup', hoursReq: 50 },
                { name: 'Manicuring', hoursReq: 75 },
                { name: 'Pedicuring', hoursReq: 60 },
                { name: 'Nail Extensions and Resin Systems', hoursReq: 40 },
                { name: 'Liquid and Powder Nail Enhancements', hoursReq: 40 },
                { name: 'Light-Cured Gels', hoursReq: 40 },
                { name: 'Internship Hours', hoursReq: 100 },
            ],
        },
    ],
};

// ──────────────── Hair Braiding ────────────────

const HAIR_BRAIDING = {
    title: 'Hair Braiding Transcript Hour Form',
    layout: '2col',
    defaults: {
        program: 'Hair Braiding',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '300',
        totalAccumulated: '300',
        ceus: '30',
    },
    columns: [
        {
            heading: null,
            topics: [
                { name: 'History and Career Opportunities', hoursReq: 5 },
                { name: 'Infection Control', hoursReq: 20 },
                { name: 'Principles of Personal and Professional Success', hoursReq: 15 },
                { name: 'Professional Consultation', hoursReq: 15 },
                { name: 'Hair Types, Structure and Textural Differences', hoursReq: 20 },
                { name: 'Hair and Scalp Diseases and Disorders', hoursReq: 20 },
                { name: 'Anatomy, Physiology and Nutrition', hoursReq: 5 },
                { name: 'Textured Hair is Manageable', hoursReq: 15 },
                { name: 'Shampoo, Conditioners, Treatment and Rinses', hoursReq: 15 },
                { name: 'Natural Hair and Braid Sculpting Techniques', hoursReq: 25 },
                { name: 'Haircutting and Styling', hoursReq: 15 },
                { name: 'Working Behind the Chair', hoursReq: 20 },
            ],
        },
        {
            heading: null,
            topics: [
                { name: 'Preparing for Licensure', hoursReq: 10 },
                { name: 'Internship Hours', hoursReq: 100 },
            ],
        },
    ],
};

// ──────── CNA & PCT/A (Combined Nursing Assistant + Patient Care Tech) ────────

const CNA_PCT = {
    title: 'Nursing Assistant & Patient Care Technician / Assistant – Transcript Hour Form',
    layout: '2col-allied',
    defaults: {
        program: 'CNA & PCT/A',
        totalClassHours: '300',
        totalExternshipHours: '105',
        totalProgramHours: '405',
        totalAccumulated: '405',
        ceus: '40.5',
    },
    columns: [
        {
            heading: 'Nursing Assistant – 1st Semester',
            topics: [
                { name: 'Health Care Career', hoursReq: 5 },
                { name: 'Communication & Customer Care', hoursReq: 7.5 },
                { name: 'Maintaining Quality of Life', hoursReq: 5 },
                { name: 'Resident Rights', hoursReq: 7.5 },
                { name: 'Preventing Infection While Providing Personal Care & Lab', hoursReq: 22.5 },
                { name: 'Safety & Emergency Care', hoursReq: 7.5 },
                { name: 'Documentation & Core Nursing Skills & Lab', hoursReq: 20 },
                { name: 'Positioning, Moving & Restoration Care & Lab', hoursReq: 17.5 },
                { name: 'Nutrition', hoursReq: 7.5 },
                { name: 'Elimination', hoursReq: 7.5 },
                { name: 'Aging & Chronic Disease Management', hoursReq: 17.5 },
                { name: 'Advance & Specialty Care Environments', hoursReq: 7.5 },
                { name: 'Comfort Care & End of Life', hoursReq: 7.5 },
                { name: 'Ethics, Law & Regulatory Guidelines', hoursReq: 10 },
                { name: 'Evaluation / Final Exam', hoursReq: 0 },
                { name: 'Externship Hours & Site', hoursReq: 40 },
            ],
        },
        {
            heading: 'Patient Care Technician / Assistant – 2nd Semester',
            topics: [
                { name: 'The Role of the Patient Care Technician', hoursReq: 2.5 },
                { name: 'Communicating with the Healthcare Team', hoursReq: 5 },
                { name: 'Understanding the Patient as a Person', hoursReq: 2.5 },
                { name: "Patient's Rights, Ethics & Law", hoursReq: 2.5 },
                { name: 'Basic Emergency Care', hoursReq: 5 },
                { name: 'Obtaining and Monitoring an EKG / Lab / Evaluation', hoursReq: 45 },
                { name: 'Assisting with Admission & Discharge', hoursReq: 2.5 },
                { name: 'Assisting with Medication Administration', hoursReq: 5 },
                { name: 'Assisting with Nutrition & Fluids', hoursReq: 5 },
                { name: 'Blood Collection & Processing / Lab', hoursReq: 35 },
                { name: 'Specimen Collecting & Testing / Lab / Evaluation', hoursReq: 20 },
                { name: 'Caring for Surgical Patient', hoursReq: 5 },
                { name: 'Care of Wounds & Pressure Ulcers', hoursReq: 5 },
                { name: 'Caring for Women & Children', hoursReq: 5 },
                { name: 'Caring for Older Adults', hoursReq: 5 },
                { name: 'Evaluation / Final Exam', hoursReq: 0 },
                { name: 'Externship Hours', hoursReq: 65 },
            ],
        },
    ],
};

// ──────── Nursing Assistant (Standalone CNA) ────────

const NURSING_ASSISTANT = {
    title: 'Certified Nursing Assistant - Transcript',
    layout: '2col-allied',
    defaults: {
        program: 'Nursing Assistant',
        totalClassHours: '150',
        totalExternshipHours: '40',
        totalProgramHours: '190',
        totalAccumulated: '',
        ceus: '19',
    },
    columns: [
        {
            heading: '1st Term of 1st Semester',
            topics: [
                { name: 'Health Care Career', hoursReq: 5 },
                { name: 'Communication & Customer Service', hoursReq: 7.5 },
                { name: 'Maintaining Quality of Life', hoursReq: 5 },
                { name: 'Resident Rights', hoursReq: 7.5 },
                { name: 'Preventing Infections While Providing Personal Care & Lab', hoursReq: 22.5 },
                { name: 'Safety & Emergency Care', hoursReq: 7.5 },
                { name: 'Documentation & Core Nursing Skills & Lab', hoursReq: 20 },
            ],
        },
        {
            heading: '2nd Term of 1st Semester',
            topics: [
                { name: 'Positioning, Moving & Restoration Care & Lab', hoursReq: 17.5 },
                { name: 'Nutrition', hoursReq: 7.5 },
                { name: 'Elimination', hoursReq: 7.5 },
                { name: 'Aging & Chronic Disease Management', hoursReq: 17.5 },
                { name: 'Advanced & Specialty Care Environments', hoursReq: 7.5 },
                { name: 'Comfort Care & End of Life', hoursReq: 7.5 },
                { name: 'Ethics, Law & Regulatory Guidelines', hoursReq: 10 },
                { name: 'Evaluation / Final Exam', hoursReq: 0 },
                { name: 'Externship Hours', hoursReq: 40 },
            ],
        },
    ],
};

// ──────── Patient Care Technician / Assistant (Standalone PCT) ────────

const PATIENT_CARE_TECH = {
    title: 'Certified Patient Care Technician / Assistant - Transcript',
    layout: '2col-allied',
    defaults: {
        program: 'Patient Care Technician / Assistant',
        totalClassHours: '150',
        totalExternshipHours: '65',
        totalProgramHours: '215',
        totalAccumulated: '',
        ceus: '21',
    },
    columns: [
        {
            heading: '3rd Term of 2nd Semester',
            topics: [
                { name: 'The Role of the Patient Care Technician', hoursReq: 2.5 },
                { name: 'Communicating with the Healthcare Team', hoursReq: 5 },
                { name: 'Understanding the Patient as a Person', hoursReq: 2.5 },
                { name: 'Patient Rights, Ethics, & Laws', hoursReq: 2.5 },
                { name: 'Basic Emergency Care', hoursReq: 5 },
                { name: 'Obtaining & Monitoring an EKG / Lab / Evaluation', hoursReq: 45 },
                { name: 'Assisting with Admission & Discharge', hoursReq: 2.5 },
                { name: 'Assisting with Medication Administration', hoursReq: 5 },
                { name: 'Assisting with Nutrition & Fluids', hoursReq: 5 },
            ],
        },
        {
            heading: '4th Term of 2nd Semester',
            topics: [
                { name: 'Blood Collection & Processing / Lab', hoursReq: 35 },
                { name: 'Specimen Collecting & Testing / Lab / Evaluation', hoursReq: 20 },
                { name: 'Caring for the Surgical Patient', hoursReq: 5 },
                { name: 'Care of Wounds and Pressure Ulcers', hoursReq: 5 },
                { name: 'Caring for Women & Children', hoursReq: 5 },
                { name: 'Caring for the Older Adult', hoursReq: 5 },
                { name: 'Evaluation / Final Exam', hoursReq: 0 },
                { name: 'Externship Hours', hoursReq: 65 },
            ],
        },
    ],
};

// ───────────────────────── Registry ─────────────────────────

/** Look up the template by program name (case-insensitive substring match). */
export function getTemplateForProgram(programName) {
    if (!programName) return ALLIED_HEALTH;
    const p = programName.toLowerCase();
    if (p.includes('barber')) return BARBERING;
    if (p.includes('admin assist') || p.includes('billing')) return MED_ADMIN_ASSISTANT;
    if (p.includes('hair braid')) return HAIR_BRAIDING;
    if (p.includes('cosmetology') && p.includes('foundation')) return COSMETOLOGY_FOUNDATION;
    if (p.includes('cosmetology')) return COSMETOLOGY_FUNDAMENTALS;
    if (p.includes('cna') && p.includes('pct')) return CNA_PCT;
    if (p.includes('nursing assistant') || p.includes('cna')) return NURSING_ASSISTANT;
    if (p.includes('patient care') || p.includes('pct')) return PATIENT_CARE_TECH;
    // Default to Allied Health for any other program
    return ALLIED_HEALTH;
}

export {
    ALLIED_HEALTH,
    BARBERING,
    MED_ADMIN_ASSISTANT,
    COSMETOLOGY_FOUNDATION,
    COSMETOLOGY_FUNDAMENTALS,
    HAIR_BRAIDING,
    CNA_PCT,
    NURSING_ASSISTANT,
    PATIENT_CARE_TECH,
};
