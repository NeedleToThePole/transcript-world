import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
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
