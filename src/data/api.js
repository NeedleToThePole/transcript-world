const API_BASE = '/api';

export const api = {
    // Programs
    async getPrograms() {
        const response = await fetch(`${API_BASE}/programs`);
        if (!response.ok) throw new Error('Failed to fetch programs');
        return response.json();
    },

    // Students
    async getStudents() {
        const response = await fetch(`${API_BASE}/students`);
        if (!response.ok) throw new Error('Failed to fetch students');
        return response.json();
    },

    // Transcripts
    async getTranscripts(filters = {}) {
        let url = `${API_BASE}/transcripts?_expand=student`;

        // Apply filters matching json-server query params
        if (filters.status && filters.status !== 'all') {
            url += `&status=${filters.status}`;
        }

        // Note: json-server text search is usually 'q=term', but broad. 
        // We can also filter client-size if complex joined filtering is needed.
        if (filters.q) {
            url += `&q=${filters.q}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch transcripts');
        return response.json();
    },

    async getTranscript(id) {
        const response = await fetch(`${API_BASE}/transcripts/${id}?_expand=student`);
        if (!response.ok) throw new Error('Failed to fetch transcript');
        return response.json();
    },

    async createTranscript(data) {
        const response = await fetch(`${API_BASE}/transcripts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
        });
        if (!response.ok) throw new Error('Failed to create transcript');
        return response.json();
    },

    async updateTranscript(id, data) {
        const response = await fetch(`${API_BASE}/transcripts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                updatedAt: new Date().toISOString()
            })
        });
        if (!response.ok) throw new Error('Failed to update transcript');
        return response.json();
    },

    // Requests
    async getRequests() {
        const response = await fetch(`${API_BASE}/requests`);
        if (!response.ok) throw new Error('Failed to fetch requests');
        return response.json();
    },

    async createRequest(data) {
        const response = await fetch(`${API_BASE}/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                status: 'pending',
                createdAt: new Date().toISOString()
            })
        });
        if (!response.ok) throw new Error('Failed to create request');
        return response.json();
    }
};
