import OfficialTranscriptPage from './pages/OfficialTranscriptPage';
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TeacherSidebar from './components/TeacherSidebar';
import Header from './components/Header';
import AdminLogin from './components/AdminLogin';
import TeacherLogin from './components/TeacherLogin';

import Dashboard from './pages/Dashboard';
import StudentRequest from './pages/StudentRequest';
import RequestQueue from './pages/RequestQueue';
import TranscriptEditor from './pages/TranscriptEditor';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherTranscripts from './pages/TeacherTranscripts';
import TeacherStudents from './pages/TeacherStudents';
import AdminToast from './components/AdminToast';
import AdminReminders from './pages/AdminReminders';

// Admin layout — only shown after password entry
function AdminLayout({ children, onLogout }) {
    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar onLogout={onLogout} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
            <AdminToast />
        </div>
    );
}

// Teacher layout — teal accent, teacher sidebar
function TeacherLayout({ children, onLogout }) {
    return (
        <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
            <TeacherSidebar onLogout={onLogout} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <main style={{ padding: '2rem', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
}

// Public layout — no sidebar, clean look for students
function PublicLayout({ children }) {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <header style={{
                padding: '1rem 2rem',
                backgroundColor: 'white',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)' }}>
                        🎓 ROWSC Transcript Portal
                    </h1>
                    <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Raphael O. Wheatley Skill Center</p>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <a href="#/teacher" style={{
                        fontSize: '0.85rem',
                        color: '#0d9488',
                        textDecoration: 'none',
                        fontWeight: '500',
                    }}>
                        Teacher Login →
                    </a>
                    <a href="#/admin" style={{
                        fontSize: '0.85rem',
                        color: '#64748b',
                        textDecoration: 'none',
                    }}>
                        Admin Login →
                    </a>
                </div>
            </header>
            <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
                {children}
            </main>
        </div>
    );
}

function AppRoutes() {
    const [adminAuth, setAdminAuth] = useState(false);
    const [teacherAuth, setTeacherAuth] = useState(null);   // null | program name string

    return (
        <Routes>
            {/* Default: Student Request Page */}
            <Route path="/" element={
                <PublicLayout>
                    <StudentRequest />
                </PublicLayout>
            } />

            {/* ── Teacher Section ── */}
            <Route path="/teacher" element={
                teacherAuth
                    ? <Navigate to="/teacher/dashboard" replace />
                    : <TeacherLogin onLogin={(program) => setTeacherAuth(program)} />
            } />

            <Route path="/teacher/*" element={
                teacherAuth ? (
                    <TeacherLayout onLogout={() => setTeacherAuth(null)}>
                        <Routes>
                            <Route path="dashboard" element={<TeacherDashboard teacherProgram={teacherAuth} />} />
                            <Route path="students" element={<TeacherStudents teacherProgram={teacherAuth} />} />
                            <Route path="transcripts" element={<TeacherTranscripts teacherProgram={teacherAuth} />} />
                            <Route path="transcript/:id" element={<TranscriptEditor role="teacher" />} />
                            <Route path="transcript-entry/:id" element={<TranscriptEditor role="teacher" mode="student" />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </TeacherLayout>
                ) : (
                    <Navigate to="/teacher" replace />
                )
            } />


            {/* ── Admin Section ── */}
            <Route path="/admin" element={
                adminAuth
                    ? <Navigate to="/admin/dashboard" replace />
                    : <AdminLogin onLogin={() => setAdminAuth(true)} />
            } />

            <Route path="/admin/*" element={
                adminAuth ? (
                    <AdminLayout onLogout={() => setAdminAuth(false)}>
                        <Routes>
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="requests" element={<RequestQueue />} />
                            <Route path="transcript/:id" element={<TranscriptEditor role="admin" />} />
                            <Route path="official/:id" element={<OfficialTranscriptPage />} />
                            <Route path="reminders" element={<AdminReminders />} />
                            <Route path="*" element={<Navigate to="dashboard" replace />} />
                        </Routes>
                    </AdminLayout>
                ) : (
                    <Navigate to="/admin" replace />
                )
            } />

            {/* Legacy routes redirect */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/requests" element={<Navigate to="/admin/requests" replace />} />
            <Route path="/transcript/:id" element={<Navigate to="/admin/transcript/:id" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;
