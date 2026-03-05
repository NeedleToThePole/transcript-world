import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            // Proxy API calls to Express server during development
            '/students': 'http://localhost:3000',
            '/requests': 'http://localhost:3000',
            '/transcripts': 'http://localhost:3000',
            '/teacherCodes': 'http://localhost:3000',
            '/archivedStudents': 'http://localhost:3000',
            '/api': 'http://localhost:3000',
        },
    },
});
