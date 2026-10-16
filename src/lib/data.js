const API_URL = import.meta.env.VITE_API_URL || '';

const TOKEN_KEY = 'rowsc_auth_token';
const ROLE_KEY = 'rowsc_auth_role';
const PROGRAM_KEY = 'rowsc_auth_program';

export function getStoredAuth() {
    try {
        return {
            token: sessionStorage.getItem(TOKEN_KEY) || null,
            role: sessionStorage.getItem(ROLE_KEY) || null,
            program: sessionStorage.getItem(PROGRAM_KEY) || null,
        };
    } catch {
        return { token: null, role: null, program: null };
    }
}

export function clearAuth() {
    try {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(ROLE_KEY);
        sessionStorage.removeItem(PROGRAM_KEY);
    } catch {
        // Ignore storage errors
    }
}

function authFetch(url, options = {}) {
    const { token } = getStoredAuth();
    const headers = {
        ...(options.headers || {}),
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return fetch(url, {
        ...options,
        headers,
    });
}

export async function loginAdmin(password) {
    const res = await fetch(`${API_URL}/auth/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        return { ok: false, error: data.error || 'Incorrect password. Please try again.' };
    }
    try {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(ROLE_KEY, 'admin');
        sessionStorage.removeItem(PROGRAM_KEY);
    } catch {
        // Ignore storage errors
    }
    return { ok: true };
}

export async function loginTeacher(program, code) {
    const res = await fetch(`${API_URL}/auth/teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ program, code }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        return { ok: false, error: data.error || 'Invalid access code. Please try again.' };
    }
    try {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(ROLE_KEY, 'teacher');
        sessionStorage.setItem(PROGRAM_KEY, data.program);
    } catch {
        // Ignore storage errors
    }
    return { ok: true, program: data.program };
}

export async function getRequests() {
    const res = await authFetch(`${API_URL}/requests`);
    if (!res.ok) return [];
    return res.json();
}

export async function getStudents() {
    const res = await authFetch(`${API_URL}/students`);
    if (!res.ok) return [];
    return res.json();
}

export async function getStudentById(id) {
    const res = await authFetch(`${API_URL}/students?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0];
}

export async function getRequestById(id) {
    const res = await authFetch(`${API_URL}/requests?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0];
}

export async function createRequest(requestData) {
    const res = await authFetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            status: 'Pending',
            requestDate: new Date().toISOString().split('T')[0],
            ...requestData,
            id: requestData.id || `R${Date.now()}`
        }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request');
    }
    return data;
}

export async function updateRequestStatus(id, status) {
    const res = await authFetch(`${API_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    return res.json();
}

export async function updateRequest(id, fields) {
    const res = await authFetch(`${API_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
    });
    return res.json();
}

export async function getTeacherCodes() {
    const res = await authFetch(`${API_URL}/teacherCodes`);
    if (!res.ok) throw new Error('Failed to load programs');
    const data = await res.json();
    return data.sort((a, b) => a.program.localeCompare(b.program));
}

export async function getStudentsByProgram(program) {
    const res = await authFetch(`${API_URL}/students?program=${encodeURIComponent(program)}&archived=false`);
    if (!res.ok) return [];
    return res.json();
}

export async function addStudent(student) {
    const res = await authFetch(`${API_URL}/students`, {
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
    const res = await authFetch(`${API_URL}/students/${id}`);
    const student = await res.json();

    await authFetch(`${API_URL}/archivedStudents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...student,
            archivedDate: new Date().toISOString().split('T')[0],
        }),
    });

    await authFetch(`${API_URL}/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true }),
    });

    return student;
}

// ─── Transcript Functions ───

export async function getStudentByInternalId(id) {
    const res = await authFetch(`${API_URL}/students/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function getTranscriptByStudentId(studentId) {
    const res = await authFetch(`${API_URL}/transcripts?studentId=${encodeURIComponent(studentId)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data[0] || null;
}

export async function getTranscriptById(id) {
    const res = await authFetch(`${API_URL}/transcripts/${id}`);
    if (!res.ok) return null;
    return res.json();
}

export async function saveTranscript(transcript) {
    const existing = await getTranscriptByStudentId(transcript.studentId);
    if (existing) {
        const res = await authFetch(`${API_URL}/transcripts/${existing.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...existing, ...transcript }),
        });
        return res.json();
    } else {
        const res = await authFetch(`${API_URL}/transcripts`, {
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
