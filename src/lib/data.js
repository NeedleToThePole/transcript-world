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
            ...requestData,
            status: 'Pending',
            requestDate: new Date().toISOString().split('T')[0],
            id: `R${Date.now()}`
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

export async function getTeacherCodes() {
    const res = await fetch(`${API_URL}/teacherCodes`);
    return res.json();
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

export async function lookupStudentForRequest(studentId, program) {
    // Find student by studentId number + program
    const res = await fetch(`${API_URL}/students?studentId=${encodeURIComponent(studentId)}&program=${encodeURIComponent(program)}&archived=false`);
    const students = await res.json();
    if (students.length === 0) return { status: 'not_enrolled', student: null, transcript: null };

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
