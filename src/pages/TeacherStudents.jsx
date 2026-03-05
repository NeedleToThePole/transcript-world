import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentsByProgram, addStudent, archiveStudent, getTranscriptByStudentId } from '../lib/data';
import { Users, Plus, Archive, Search, X, FileText } from 'lucide-react';

export default function TeacherStudents({ teacherProgram }) {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '', phone: '', studentId: '' });
    const [transcriptStatuses, setTranscriptStatuses] = useState({}); // { studentId: 'complete' | 'in_progress' | null }

    useEffect(() => {
        loadStudents();
    }, [teacherProgram]);

    async function loadStudents() {
        setLoading(true);
        try {
            const data = await getStudentsByProgram(teacherProgram);
            setStudents(data);
            // Fetch transcript status for each student
            const statuses = {};
            await Promise.all(data.map(async (s) => {
                const t = await getTranscriptByStudentId(s.id);
                statuses[s.id] = t ? t.status : null;
            }));
            setTranscriptStatuses(statuses);
        } catch (err) {
            console.error('Failed to load students:', err);
        }
        setLoading(false);
    }

    async function handleAddStudent(e) {
        e.preventDefault();
        await addStudent({ ...newStudent, program: teacherProgram });
        setNewStudent({ firstName: '', lastName: '', email: '', phone: '', studentId: '' });
        setShowAddForm(false);
        loadStudents();
    }

    async function handleArchive(student) {
        if (!window.confirm(`Archive ${student.firstName} ${student.lastName}?\n\nThis will remove them from your active roster. They can be restored by an administrator.`)) return;
        await archiveStudent(student.id);
        loadStudents();
    }

    const filtered = students.filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            (s.firstName || '').toLowerCase().includes(q) ||
            (s.lastName || '').toLowerCase().includes(q) ||
            (s.email || '').toLowerCase().includes(q) ||
            String(s.studentId || '').includes(q)
        );
    });

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>
                        <Users size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        My Students
                    </h2>
                    <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                        {teacherProgram} — {students.length} student{students.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.6rem 1.2rem', borderRadius: 'var(--border-radius)',
                        backgroundColor: '#0d9488', color: 'white', border: 'none',
                        cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem',
                    }}
                >
                    <Plus size={18} /> Add Student
                </button>
            </div>

            {/* Add Student Form */}
            {showAddForm && (
                <form onSubmit={handleAddStudent} style={{
                    backgroundColor: '#f0fdfa', border: '1px solid #99f6e4',
                    borderRadius: 'var(--border-radius)', padding: '1.25rem',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Add New Student</h3>
                        <button type="button" onClick={() => setShowAddForm(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <X size={18} />
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>First Name *</label>
                            <input required value={newStudent.firstName}
                                onChange={e => setNewStudent(s => ({ ...s, firstName: e.target.value }))}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Last Name *</label>
                            <input required value={newStudent.lastName}
                                onChange={e => setNewStudent(s => ({ ...s, lastName: e.target.value }))}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Student ID</label>
                            <input value={newStudent.studentId}
                                onChange={e => setNewStudent(s => ({ ...s, studentId: e.target.value }))}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Email</label>
                            <input type="email" value={newStudent.email}
                                onChange={e => setNewStudent(s => ({ ...s, email: e.target.value }))}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '0.25rem' }}>Phone</label>
                            <input type="tel" value={newStudent.phone}
                                onChange={e => setNewStudent(s => ({ ...s, phone: e.target.value }))}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" style={{
                                padding: '0.5rem 1.5rem', borderRadius: '6px',
                                backgroundColor: '#0d9488', color: 'white', border: 'none',
                                cursor: 'pointer', fontWeight: '500', width: '100%',
                            }}>
                                Add to Roster
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    placeholder="Search by name, email, or student ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.5rem',
                        borderRadius: 'var(--border-radius)', border: '1px solid #e2e8f0',
                        fontSize: '0.9rem',
                    }}
                />
            </div>

            {/* Student Table */}
            {loading ? (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Loading students...</p>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <Users size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                    <p>{search ? 'No students match your search.' : 'No students in your roster yet.'}</p>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: 'var(--border-radius)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Student ID</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Name</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: '600', color: '#475569' }}>Phone</th>
                                <th style={{ textAlign: 'center', padding: '0.75rem 1rem', fontWeight: '600', color: '#475569', width: '180px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((s, i) => (
                                <tr key={s.id} style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    backgroundColor: transcriptStatuses[s.id] === 'complete' ? '#f0fdf8' : i % 2 === 0 ? 'white' : '#fafbfc',
                                    borderLeft: transcriptStatuses[s.id] === 'complete' ? '3px solid #22c55e' : '3px solid transparent',
                                }}>
                                    <td style={{ padding: '0.6rem 1rem', color: '#0d9488', fontWeight: '600' }}>
                                        {s.studentId || '—'}
                                    </td>
                                    <td style={{ padding: '0.6rem 1rem', fontWeight: '500' }}>
                                        <Link to={`/teacher/transcript-entry/${s.id}`} style={{ color: '#0d9488', textDecoration: 'none', fontWeight: '600' }}>
                                            {s.firstName} {s.lastName}
                                        </Link>
                                        {transcriptStatuses[s.id] === 'complete' && (
                                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>✅ Done</span>
                                        )}
                                        {transcriptStatuses[s.id] === 'in_progress' && (
                                            <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: '#ca8a04', fontWeight: '600' }}>🔄 In Progress</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '0.6rem 1rem', color: '#64748b' }}>
                                        {s.email || '—'}
                                    </td>
                                    <td style={{ padding: '0.6rem 1rem', color: '#64748b' }}>
                                        {s.phone || '—'}
                                    </td>
                                    <td style={{ padding: '0.6rem 1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <Link
                                            to={`/teacher/transcript-entry/${s.id}`}
                                            title="Open Transcript"
                                            style={{
                                                background: 'none', border: '1px solid #99f6e4',
                                                borderRadius: '6px', padding: '0.3rem 0.5rem',
                                                cursor: 'pointer', color: '#0d9488',
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                fontSize: '0.8rem', textDecoration: 'none',
                                            }}
                                        >
                                            <FileText size={14} /> Transcript
                                        </Link>
                                        <button
                                            onClick={() => handleArchive(s)}
                                            title="Archive student"
                                            style={{
                                                background: 'none', border: '1px solid #fed7aa',
                                                borderRadius: '6px', padding: '0.3rem 0.5rem',
                                                cursor: 'pointer', color: '#ea580c',
                                                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                                                fontSize: '0.8rem',
                                            }}
                                        >
                                            <Archive size={14} /> Archive
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
