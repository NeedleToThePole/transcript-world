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
    title: 'Barbering Transcript Card',
    layout: 'stacked',
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Earlyn Edwards- Cosmetology Instructor Chairperson'
    ],
    defaults: {
        program: 'Barbering',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '500',
        totalAccumulated: '',
        ceus: '',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Infection Control', hoursReq: 50 },
                { name: 'Implements, Tools, Equipment\'s', hoursReq: 5 },
                { name: 'Anatomy & Physiology', hoursReq: 20 },
                { name: 'Basics of Chemistry', hoursReq: 5 },
                { name: 'Basics of Electricity', hoursReq: 5 },
                { name: 'Skin Structure, Disorders & Diseases', hoursReq: 15 },
                { name: 'Properties and Disorders of the Hair and Scalp', hoursReq: 25 },
                { name: 'Treatment of the Hair and Scalp', hoursReq: 22 },
                { name: 'Men\'s Facial Massage and Treatment', hoursReq: 10 },
                { name: 'Shaving and Facial-Hair Design', hoursReq: 50 },
                { name: 'Men\'s Haircutting and Styling', hoursReq: 40 },
                { name: 'Men\'s Hair Replacement', hoursReq: 20 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Women\'s Haircutting and Styling', hoursReq: 25 },
                { name: 'Chemical Texture Services', hoursReq: 35 },
                { name: 'Hair Coloring & Lightening', hoursReq: 35 },
                { name: 'History of Barbering', hoursReq: 1 },
                { name: 'Life Skills', hoursReq: 1 },
                { name: 'Professional Image', hoursReq: 1 },
                { name: 'Preparing for Licensure & Employment', hoursReq: 5 },
                { name: 'Working Behind the Chair', hoursReq: 5 },
                { name: 'The Business of Barbering', hoursReq: 5 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
                { name: 'Externship:', hoursReq: 100 },
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
    title: 'Cosmetology Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Earlyn Edwards- Cosmetology Instructor Chairperson'
    ],
    defaults: {
        program: 'Cosmetology Fundamentals',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '1500',
        totalAccumulated: '',
        ceus: '',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Infection Control', hoursReq: 50 },
                { name: 'General Anatomy & Physiology', hoursReq: 44 },
                { name: 'Skin Structure and Growth', hoursReq: 34 },
                { name: 'Skin Disorders and Diseases', hoursReq: 34 },
                { name: 'Nail Structure', hoursReq: 26 },
                { name: 'Nail Disorders and Diseases', hoursReq: 30 },
                { name: 'Hair and Scalp Properties', hoursReq: 50 },
                { name: 'Hair and Scalp Diseases', hoursReq: 60 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Principles of Hair Design', hoursReq: 25 },
                { name: 'Hair Services Preparation', hoursReq: 45 },
                { name: 'Haircutting', hoursReq: 100 },
                { name: 'Hairstyling', hoursReq: 95 },
                { name: 'Braiding and Braid Extensions', hoursReq: 15 },
                { name: 'Wigs and Hair Additions', hoursReq: 30 },
                { name: 'Chemical Texture Services', hoursReq: 115 },
                { name: 'Hair Coloring', hoursReq: 125 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER III',
            topics: [
                { name: 'Hair Removal', hoursReq: 75 },
                { name: 'Facials', hoursReq: 67 },
                { name: 'Makeup', hoursReq: 50 },
                { name: 'Manicuring', hoursReq: 85 },
                { name: 'Pedicuring', hoursReq: 60 },
                { name: 'Nail Extensions and Resin Systems', hoursReq: 40 },
                { name: 'Liquid and Powder Nail Enhancements', hoursReq: 40 },
                { name: 'Light-Cured Gels', hoursReq: 40 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER IV',
            topics: [
                { name: 'History and Career Opportunities', hoursReq: 1 },
                { name: 'Chemistry and Chemical Safety', hoursReq: 5 },
                { name: 'Electricity and Electrical Safety', hoursReq: 5 },
                { name: 'Life Skills', hoursReq: 1 },
                { name: 'Professional Image', hoursReq: 1 },
                { name: 'Communicating for Success', hoursReq: 1 },
                { name: 'The Healthy Professional', hoursReq: 1 },
                { name: 'Career Planning', hoursReq: 10 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
                { name: 'Externship:', hoursReq: 100 },
            ],
        },
    ],
};

// ──────────────── Hair Braiding ────────────────

const HAIR_BRAIDING = {
    title: 'Hair Braiding Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Earlyn Edwards- Cosmetology Instructor Chairperson'
    ],
    defaults: {
        program: 'Hair Braiding',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '300',
        totalAccumulated: '',
        ceus: '',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Infection Control', hoursReq: 25 },
                { name: 'Professional Consultation', hoursReq: 1 },
                { name: 'Hair Types, Structure, and Textural Difference', hoursReq: 26 },
                { name: 'Hair and Scalp Diseases and Disorders', hoursReq: 26 },
                { name: 'Anatomy, Physiology, and Nutrition', hoursReq: 10 },
                { name: 'Textured Hair Manageable', hoursReq: 20 },
                { name: 'Shampoo, Conditioners, Treatment, and Rinses', hoursReq: 20 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Natural Hair and Braid Sculpting Techniques', hoursReq: 25 },
                { name: 'Haircutting and Styling', hoursReq: 15 },
                { name: 'Working Behind the Chair', hoursReq: 5 },
                { name: 'History and Career Opportunities', hoursReq: 1 },
                { name: 'Principles of Personal and Professional Success', hoursReq: 1 },
                { name: 'Preparing for Licensure', hoursReq: 5 },
                { name: 'Evaluation & Lab Practical', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
                { name: 'Externship:', hoursReq: 100 },
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
};// ──────────────── Esthetics ────────────────
const ESTHETICS = {
    title: 'Esthetics Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Earlyn Edwards- Cosmetology Instructor Chairperson'
    ],
    defaults: {
        program: 'Esthetics',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '600',
        totalAccumulated: '',
        ceus: '',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Infection Control', hoursReq: 50 },
                { name: 'Anatomy & Physiology', hoursReq: 30 },
                { name: 'Physiology and Histology of the Skin', hoursReq: 30 },
                { name: 'Disorders and Diseases of the Skin', hoursReq: 25 },
                { name: 'Skin Analysis', hoursReq: 25 },
                { name: 'Skin Care Products: Chemistry, Ingredients, and Selection', hoursReq: 25 },
                { name: 'The Treatment Room', hoursReq: 25 },
                { name: 'Facial Treatments', hoursReq: 25 },
                { name: 'Facial Massage', hoursReq: 40 },
                { name: 'Facial Devices and Technology', hoursReq: 35 },
                { name: 'Hair Removal', hoursReq: 50 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Makeup Essentials', hoursReq: 45 },
                { name: 'Advanced Topics and Treatments', hoursReq: 50 },
                { name: 'Chemistry and Chemical Safety', hoursReq: 5 },
                { name: 'Electricity and Electrical Safety', hoursReq: 5 },
                { name: 'Life Skills', hoursReq: 1 },
                { name: 'Professional Image', hoursReq: 1 },
                { name: 'Communicating for Success', hoursReq: 1 },
                { name: 'The Healthy Professional', hoursReq: 1 },
                { name: 'Career Planning', hoursReq: 10 },
                { name: 'History & Career Opportunities', hoursReq: 1 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
                { name: 'Externship:', hoursReq: 100 },
            ],
        },
    ]
};

// ──────────────── Medical Massage ────────────────
const MEDICAL_MASSAGE = {
    title: 'Medical Massage Therapy Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Earlyn Edwards- Cosmetology Instructor Chairperson'
    ],
    defaults: {
        program: 'Medical Massage Therapy',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '600',
        totalAccumulated: '',
        ceus: '',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Anatomy', hoursReq: 50 },
                { name: 'Physiology', hoursReq: 25 },
                { name: 'Massage Theory Technique', hoursReq: 165 },
                { name: 'Swedish Massage', hoursReq: 65 },
                { name: 'Health & Hygiene', hoursReq: 20 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Hydrotherapy', hoursReq: 20 },
                { name: 'Kinesiology', hoursReq: 50 },
                { name: 'Pathology', hoursReq: 40 },
                { name: 'Business Practices and Professional Ethics', hoursReq: 45 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
                { name: 'Externship:', hoursReq: 100 },
            ],
        },
    ]
};

// ──────────────── Nail Technology ────────────────
const NAIL_TECHNOLOGY = {
    title: 'Nail Technology Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Earlyn Edwards- Cosmetology Instructor Chairperson'
    ],
    defaults: {
        program: 'Nail Technology',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '500',
        totalAccumulated: '',
        ceus: '',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Infection Control', hoursReq: 50 },
                { name: 'Anatomy & Physiology', hoursReq: 14 },
                { name: 'Skin Structure, Disorders, & Diseases', hoursReq: 14 },
                { name: 'Nail Structure, Disorders, & Diseases', hoursReq: 19 },
                { name: 'Nail Product Chemistry', hoursReq: 15 },
                { name: 'Manicuring', hoursReq: 50 },
                { name: 'Pedicuring', hoursReq: 35 },
                { name: 'Electrical Filing', hoursReq: 15 },
                { name: 'Nail Tips & Forms', hoursReq: 28 },
                { name: 'Nail Resin System', hoursReq: 20 },
                { name: 'Monomer Liquid and Polymer Powder Nail Enhancements', hoursReq: 50 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Gel Nail Enhancements', hoursReq: 25 },
                { name: 'Nail Art', hoursReq: 20 },
                { name: 'Chemistry & Chemical Safety', hoursReq: 5 },
                { name: 'Electricity & Electrical Safety', hoursReq: 5 },
                { name: 'History & Career Opportunities', hoursReq: 1 },
                { name: 'Life Skills', hoursReq: 1 },
                { name: 'Professional Image', hoursReq: 1 },
                { name: 'Communicating for Success', hoursReq: 1 },
                { name: 'The Healthy Professional', hoursReq: 1 },
                { name: 'Career Planning', hoursReq: 10 },
                { name: 'Evaluation', hoursReq: 5 },
                { name: 'Lab Practical', hoursReq: 5 },
                { name: 'Externship:', hoursReq: 100 },
            ],
        },
    ]
};

// ──────────────── Electrical ────────────────
const ELECTRICAL = {
    title: 'Electrical Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Authorized Personnel, Title'
    ],
    defaults: {
        program: 'Electrical',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '672.5',
        totalAccumulated: '',
        ceus: '67.2',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Core', hoursReq: 77.5 },
                { name: 'Occupational Overview: The Electrical Industry', hoursReq: 2.5 },
                { name: 'Safety for Electricians', hoursReq: 10 },
                { name: 'Introduction to Electrical Circuits', hoursReq: 7.5 },
                { name: 'Electrical Theory', hoursReq: 7.5 },
                { name: 'Introduction to the National Electrical Code', hoursReq: 7.5 },
                { name: 'Outlet, Device, Pull, and Junction Boxes', hoursReq: 10 },
                { name: 'Hand Bending', hoursReq: 10 },
                { name: 'Wireways, Raceways, and Fittings', hoursReq: 20 },
                { name: 'Conductors and Cables', hoursReq: 10 },
                { name: 'Basic Electrical Construction Documents', hoursReq: 7.5 },
                { name: 'Residential Wiring', hoursReq: 15 },
                { name: 'Electrical Test Equipment', hoursReq: 5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Alternating Current', hoursReq: 17.4 },
                { name: 'Motors: Theory and Application', hoursReq: 20 },
                { name: 'Electric Lighting', hoursReq: 15 },
                { name: 'Conduit Bending', hoursReq: 15 },
                { name: 'Pull and Junction Boxes', hoursReq: 15.5 },
                { name: 'Conductor Installations', hoursReq: 10 },
                { name: 'Cable Tray', hoursReq: 7.5 },
                { name: 'Conductor Terminations and Splices', hoursReq: 7.5 },
                { name: 'Grounding and Bonding', hoursReq: 15 },
                { name: 'Circuit Breakers and Fuses', hoursReq: 12.5 },
                { name: 'Control Systems and Fundamental Concepts', hoursReq: 12.5 },
            ],
        },
        {
            heading: 'SEMESTER III',
            topics: [
                { name: 'Load Calculations – Branch and Feeder Circuits', hoursReq: 17.5 },
                { name: 'Conductor Selection and Calculations', hoursReq: 15 },
                { name: 'Practical Applications of Lighting', hoursReq: 12.5 },
                { name: 'Hazardous Locations', hoursReq: 15 },
                { name: 'Overcurrent Protection', hoursReq: 25 },
                { name: 'Distribution Equipment', hoursReq: 12.5 },
                { name: 'Transformers', hoursReq: 12.5 },
                { name: 'Commercial Electrical Services', hoursReq: 10 },
                { name: 'Motor Calculations', hoursReq: 12.5 },
                { name: 'Voice, Data, and Video', hoursReq: 10 },
                { name: 'Motor Controls', hoursReq: 12.5 },
            ],
        },
        {
            heading: 'SEMESTER IV',
            topics: [
                { name: 'Load Calculations – Feeders and Services', hoursReq: 20 },
                { name: 'Health Care Facilities', hoursReq: 10 },
                { name: 'Standby and Emergency Systems', hoursReq: 10 },
                { name: 'Basic Electronic Theory', hoursReq: 10 },
                { name: 'Fire Alarm Systems', hoursReq: 15 },
                { name: 'Specialty Transformers', hoursReq: 10 },
                { name: 'Advanced Controls', hoursReq: 20 },
                { name: 'HVAC Controls', hoursReq: 15 },
                { name: 'Heat Tracing and Freeze Protection', hoursReq: 10 },
                { name: 'Motor Operation and Maintenance', hoursReq: 10 },
                { name: 'Medium-Voltage Termination/Splices', hoursReq: 10 },
                { name: 'Special Locations', hoursReq: 20 },
                { name: 'Introduction to Leadership', hoursReq: 22.5 },
            ],
        },
    ]
};

// ──────────────── HVAC ────────────────
const HVAC = {
    title: 'Heating, Ventilation, Air Conditioning & Refrigeration (HVAC) Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Authorized Personnel, Title'
    ],
    defaults: {
        program: 'HVAC',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '707.5',
        totalAccumulated: '',
        ceus: '70.7',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Core', hoursReq: 77.5 },
                { name: 'Introduction to HVAC/R', hoursReq: 5 },
                { name: 'Trade Mathematics', hoursReq: 10 },
                { name: 'Basic Electricity', hoursReq: 15 },
                { name: 'Introduction to Heating', hoursReq: 15 },
                { name: 'Introduction to Cooling', hoursReq: 30 },
                { name: 'Air Distribution Systems', hoursReq: 15 },
                { name: 'Basic Copper and Plastic Piping Practices', hoursReq: 12.5 },
                { name: 'Soldering and Brazing', hoursReq: 10 },
                { name: 'Basic Carbon Steel Piping Practices', hoursReq: 10 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Customer Relations', hoursReq: 5 },
                { name: 'Basic Maintenance', hoursReq: 20 },
                { name: 'Fasteners and Hardware', hoursReq: 10 },
                { name: 'Alternating Current', hoursReq: 10 },
                { name: 'Compressors', hoursReq: 12.5 },
                { name: 'Metering Devices', hoursReq: 12.5 },
                { name: 'Refrigerants and Oils', hoursReq: 15 },
                { name: 'Leak Detection, Evaluation, Recovery, and Charging', hoursReq: 30 },
                { name: 'Heat Pumps', hoursReq: 20 },
                { name: 'Air Quality Equipment', hoursReq: 5 },
                { name: 'Chimneys, Vents, and Flues', hoursReq: 5 },
                { name: 'Sheet Metal Duct Systems', hoursReq: 10 },
                { name: 'Fiberglass and Fabric Duct Systems', hoursReq: 7.5 },
                { name: 'Commercial Airside Systems', hoursReq: 12.5 },
                { name: 'Introduction to Hydronic System', hoursReq: 15 },
            ],
        },
    ]
};

// ──────────────── Carpentry ────────────────
const CARPENTRY = {
    title: 'Carpentry Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Authorized Personnel, Title'
    ],
    defaults: {
        program: 'Carpentry',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '710',
        totalAccumulated: '',
        ceus: '71.0',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Core', hoursReq: 72.5 },
                { name: 'Orientation to the Trade', hoursReq: 2.5 },
                { name: 'Building Materials, Fasteners and Adhesives', hoursReq: 20 },
                { name: 'Hand and Power Tools', hoursReq: '' },
                { name: 'Introduction to Construction Drawings, Specifications, and Layout', hoursReq: 20 },
                { name: 'Floor Systems', hoursReq: 25 },
                { name: 'Wall Systems', hoursReq: 25 },
                { name: 'Ceiling Joist and Rood Framing', hoursReq: '' },
                { name: 'Introduction to Building Envelope', hoursReq: 12.5 },
                { name: 'Basic Stair Layout', hoursReq: 12.5 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Commercial Drawings', hoursReq: '' },
                { name: 'Cold-Formed Steel Framing', hoursReq: 15 },
                { name: 'Exterior Finish and Trim', hoursReq: 35 },
                { name: 'Thermal and Moisture Protection', hoursReq: 7.5 },
                { name: 'Roofing Applications', hoursReq: 35 },
                { name: 'Doors and Door Hardware', hoursReq: 25 },
                { name: 'Drywall Installation', hoursReq: 25 },
                { name: 'Drywall Finishing', hoursReq: '' },
                { name: 'Suspended and Acoustical Ceilings', hoursReq: 15 },
                { name: 'Window, Door, Floor, and Ceiling Trim', hoursReq: 12.5 },
                { name: 'Cabinet Installation', hoursReq: '' },
            ],
        },
        {
            heading: 'SEMESTER III',
            topics: [
                { name: 'Properties of Concrete', hoursReq: 10 },
                { name: 'Rigging Equipment', hoursReq: '' },
                { name: 'Rigging Practices', hoursReq: '' },
                { name: 'Trenching and Excavating', hoursReq: 15 },
                { name: 'Reinforcing Concrete', hoursReq: 17.5 },
                { name: 'Foundations and Slab-on-Grade', hoursReq: 10 },
                { name: 'Vertical Formwork', hoursReq: 22.5 },
                { name: 'Horizontal Formwork', hoursReq: 15 },
                { name: 'Handling and Placing Concrete', hoursReq: 20 },
                { name: 'Tilt-up Wall Systems', hoursReq: 17.5 },
            ],
        },
        {
            heading: 'SEMESTER IV',
            topics: [
                { name: 'Site Layout One: Differential Leveling', hoursReq: '' },
                { name: 'Site Layout Two: Angular and Distance Measurement', hoursReq: '' },
                { name: 'Advanced Roof Systems', hoursReq: '' },
                { name: 'Advanced Wall Systems', hoursReq: '' },
                { name: 'Advanced Stair Systems', hoursReq: '' },
                { name: 'Introduction to Construction Equipment', hoursReq: '' },
                { name: 'Introduction to Oxyfuel Cutting and Arc Welding', hoursReq: 17.5 },
                { name: 'Site Preparation', hoursReq: 7.5 },
                { name: 'Fundamentals of Crew Leadership', hoursReq: 22.5 },
            ],
        },
    ]
};

// ──────────────── Plumbing ────────────────
const PLUMBING = {
    title: 'Plumbing Transcript Card',
    layout: 'stacked',
    gridCols: 2,
    hideRightFooter: true,
    signatures: [
        'Instructor',
        'Authorized Personnel, Title'
    ],
    defaults: {
        program: 'Plumbing',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '702.5',
        totalAccumulated: '',
        ceus: '70.2',
    },
    columns: [
        {
            heading: 'SEMESTER I',
            topics: [
                { name: 'Core', hoursReq: 72.5 },
                { name: 'Introduction to the Plumbing Profession', hoursReq: 5 },
                { name: 'Plumbing Safety', hoursReq: 22.5 },
                { name: 'Tools of the Plumbing Trade', hoursReq: 10 },
                { name: 'Introduction to Plumbing Math', hoursReq: 12.5 },
                { name: 'Introduction to Plumbing Drawings', hoursReq: 17.5 },
                { name: 'Plastic Pipe and Fittings', hoursReq: 12.5 },
                { name: 'Copper Tube and Fittings', hoursReq: 12.5 },
                { name: 'Cast Iron Pipe and Fittings', hoursReq: 12.5 },
                { name: 'Steel Pipe and Fittings', hoursReq: 12.5 },
                { name: 'Introduction to Plumbing Fixtures', hoursReq: 7.5 },
                { name: 'Introduction to Drain, Waste, and Vent (DWV) Systems', hoursReq: 10 },
                { name: 'Introduction to Water Distribution Systems', hoursReq: 10 },
            ],
        },
        {
            heading: 'SEMESTER II',
            topics: [
                { name: 'Plumbing Math II', hoursReq: 15 },
                { name: 'Reading Commercial Drawings', hoursReq: 25 },
                { name: 'Structural Penetrations, Insulating, and Firestopping', hoursReq: 15 },
                { name: 'Installing Roof, Floor, and Area Drains', hoursReq: 5 },
                { name: 'Installing and Testing Water Supply Piping', hoursReq: 20 },
                { name: 'Types of Valves', hoursReq: 5 },
                { name: 'Installing Fixtures and Valves', hoursReq: 20 },
                { name: 'Installing Water Heaters', hoursReq: 10 },
                { name: 'Basic Electricity', hoursReq: 10 },
                { name: 'Fuel Gas and Fuel Oil Systems', hoursReq: 20 },
            ],
        },
        {
            heading: 'SEMESTER III',
            topics: [
                { name: 'Applied Math', hoursReq: 15 },
                { name: 'Service Plumbing', hoursReq: 25 },
                { name: 'Sizing and Protecting the Water Supply System', hoursReq: 30 },
                { name: 'Potable Water Supply', hoursReq: 15 },
                { name: 'Types of Venting', hoursReq: 20 },
                { name: 'Sizing DWV and Storm Sytsmes', hoursReq: 20 },
                { name: 'Sewage Pumps and Sump Pumps', hoursReq: 12.5 },
                { name: 'Corrosive-Resistant Waste Piping', hoursReq: 7.5 },
                { name: 'Compressed Air', hoursReq: 10 },
            ],
        },
        {
            heading: 'SEMESTER IV',
            topics: [
                { name: 'Business Principles for Plumbers', hoursReq: 15 },
                { name: 'Introduction to Leadership', hoursReq: 22.5 },
                { name: 'Water Pressure Booster and Recirculation Systems', hoursReq: 12.5 },
                { name: 'Indirect and Special Waste', hoursReq: 12.5 },
                { name: 'Hydronic and Solar Heating Systems', hoursReq: 17.5 },
                { name: 'Codes', hoursReq: 12.5 },
                { name: 'Private Water Supply Well Systems', hoursReq: 10 },
                { name: 'Swimming Pools and Hot Tubs', hoursReq: 7.5 },
                { name: 'Plumbing for Mobile Homes and Travel Trailers', hoursReq: 7.5 },
                { name: 'Introduction to Medical Gas and Vacuum Systems', hoursReq: 15 },
            ],
        },
    ]
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
    if (p.includes('esthetic') || p.includes('esthetics')) return ESTHETICS;
    if (p.includes('massage')) return MEDICAL_MASSAGE;
    if (p.includes('nail')) return NAIL_TECHNOLOGY;
    if (p.includes('electric') || p.includes('electrical')) return ELECTRICAL;
    if (p.includes('hvac') || p.includes('heating')) return HVAC;
    if (p.includes('plumb')) return PLUMBING;
    if (p.includes('carpent')) return CARPENTRY;
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
    ESTHETICS,
    MEDICAL_MASSAGE,
    NAIL_TECHNOLOGY,
    ELECTRICAL,
    HVAC,
    PLUMBING,
    CARPENTRY,
    HAIR_BRAIDING,
    CNA_PCT,
    NURSING_ASSISTANT,
    PATIENT_CARE_TECH,
};
