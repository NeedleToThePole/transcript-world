const API_URL = import.meta.env.VITE_API_URL || '';

export async function getRequests() {
    const res = await fetch(`${API_URL}/requests`);
    return res.json();
}

export async function getStudents() {
    const res = await fetch(`${API_URL}/students`);
    return res.json();
}

export async function getStudentById(id) {
    const res = await fetch(`${API_URL}/students?id=${id}`);
    const data = await res.json();
    return data[0];
}

export async function getRequestById(id) {
    const res = await fetch(`${API_URL}/requests?id=${id}`);
    const data = await res.json();
    return data[0];
}

export async function createRequest(requestData) {
    const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: 'Pending',
            requestDate: new Date().toISOString().split('T')[0],
            ...requestData,
            id: requestData.id || `R${Date.now()}`
        }),
    });
    return res.json();
}

export async function updateRequestStatus(id, status) {
    const res = await fetch(`${API_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    return res.json();
}

export async function updateRequest(id, fields) {
    const res = await fetch(`${API_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
    });
    return res.json();
}

export async function getTeacherCodes() {
    const res = await fetch(`${API_URL}/teacherCodes`);
    const data = await res.json();
    return data.sort((a, b) => a.program.localeCompare(b.program));
}

export async function getStudentsByProgram(program) {
    const res = await fetch(`${API_URL}/students?program=${encodeURIComponent(program)}&archived=false`);
    return res.json();
}

export async function addStudent(student) {
    const res = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...student,
            id: `S${Date.now()}`,
            archived: false,
        }),
    });
    return res.json();
}

export async function archiveStudent(id) {
    // Get the student first
    const res = await fetch(`${API_URL}/students/${id}`);
    const student = await res.json();

    // Add to archivedStudents
    await fetch(`${API_URL}/archivedStudents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...student,
            archivedDate: new Date().toISOString().split('T')[0],
        }),
    });

    // Mark as archived in students (soft-delete)
    await fetch(`${API_URL}/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
    });

    return student;
}

// ─── Transcript Functions ───

export async function getStudentByInternalId(id) {
    const res = await fetch(`${API_URL}/students/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function getTranscriptByStudentId(studentId) {
    const res = await fetch(`${API_URL}/transcripts?studentId=${encodeURIComponent(studentId)}`);
    const data = await res.json();
    return data[0] || null;
}

export async function getTranscriptById(id) {
    const res = await fetch(`${API_URL}/transcripts/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function saveTranscript(transcript) {
    // Check if transcript already exists for this student
    const existing = await getTranscriptByStudentId(transcript.studentId);
    if (existing) {
        const res = await fetch(`${API_URL}/transcripts/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...existing, ...transcript }),
        });
        return res.json();
    } else {
        const res = await fetch(`${API_URL}/transcripts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...transcript,
                id: `T${Date.now()}`,
                createdDate: new Date().toISOString().split('T')[0],
            }),
        });
        return res.json();
    }
}

export async function lookupStudentForRequest(studentIdOrData, programArg, emailArg, firstNameArg, lastNameArg) {
    let studentId = '';
    let program = '';
    let email = '';
    let firstName = '';
    let lastName = '';

    if (typeof studentIdOrData === 'object' && studentIdOrData !== null) {
        studentId = studentIdOrData.studentId || '';
        program = studentIdOrData.program || '';
        email = studentIdOrData.email || '';
        firstName = studentIdOrData.firstName || '';
        lastName = studentIdOrData.lastName || '';
    } else {
        studentId = studentIdOrData || '';
        program = programArg || '';
        email = emailArg || '';
        firstName = firstNameArg || '';
        lastName = lastNameArg || '';
    }

    const params = new URLSearchParams({
        studentId: (studentId || '').trim(),
        program: (program || '').trim(),
        email: (email || '').trim(),
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
        archived: 'false',
    });

    const res = await fetch(`${API_URL}/students?${params.toString()}`);
    const students = await res.json();
    if (!Array.isArray(students) || students.length === 0) {
        return { status: 'verification_needed', student: null, transcript: null };
    }

    const student = students[0];
    const transcript = await getTranscriptByStudentId(student.id);

    if (transcript && transcript.status === 'complete') {
        return { status: 'ready', student, transcript };
    } else if (transcript) {
        return { status: 'in_progress', student, transcript };
    } else {
        return { status: 'awaiting_grades', student, transcript: null };
    }
}
