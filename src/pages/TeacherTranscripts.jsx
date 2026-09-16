import React, { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus, addStudent, updateRequest } from '../lib/data';
import { Link } from 'react-router-dom';
import { Pencil, CheckCircle, UserPlus } from 'lucide-react';

export default function TeacherTranscripts({ teacherProgram }) {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('All');

    const fetchRequests = async () => {
        const allData = await getRequests();
        // Filter to only this teacher's program
        const data = teacherProgram
            ? allData.filter(r => r.program === teacherProgram)
            : allData;
        setRequests(data);
    };

    useEffect(() => {
        fetchRequests();
    }, [teacherProgram]);

    const handleMarkReady = async (id) => {
        await updateRequestStatus(id, 'Processing');
        fetchRequests();
    };

    const handleAddToRoster = async (req) => {
        if (!window.confirm(`Add ${req.firstName} ${req.lastName} to your active roster for ${req.program}?`)) return;
        try {
            const newStudent = await addStudent({
                firstName: req.firstName,
                lastName: req.lastName,
                email: req.email,
                phone: req.phone,
                studentId: req.studentId,
                program: req.program,
            });
            await updateRequest(req.id, {
                enrolledStudentId: newStudent.id || newStudent._id,
                notInSystem: false,
                status: 'Pending — Awaiting Grades',
            });
            fetchRequests();
        } catch (err) {
            alert('Failed to add student to roster: ' + err.message);
        }
    };

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => {
            if (filter === 'Not in System') return r.status === 'Not in System' || r.notInSystem;
            if (filter === 'Pending') return r.status === 'Pending' || r.status?.startsWith('Pending') || r.status === 'Not in System' || r.notInSystem;
            return r.status === filter;
        });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2>My Transcripts</h2>
                    {teacherProgram && (
                        <p style={{ color: '#0d9488', fontWeight: '500', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
                            {teacherProgram}
                        </p>
                    )}
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: 'auto', padding: '0.5rem 2rem' }}
                >
                    <option>All</option>
                    <option>Not in System</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Completed</option>
                </select>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '1rem' }}>Student</th>
                            <th style={{ padding: '1rem' }}>Program</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>Date</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>
                                    {req.firstName} {req.lastName}
                                </td>
                                <td style={{ padding: '1rem' }}>{req.program || '—'}</td>
                                <td style={{ padding: '1rem' }}>{req.type}</td>
                                <td style={{ padding: '1rem' }}>{req.requestDate}</td>
                                <td style={{ padding: '1rem' }}>
                                    {(() => {
                                        const isNotEnrolled = req.status === 'Not in System' || req.notInSystem;
                                        const isPending = req.status === 'Pending' || req.status?.startsWith('Pending');
                                        const isComplete = req.status === 'Completed';
                                        return (
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: isNotEnrolled ? '#fee2e2' : isPending ? '#fff7ed' : isComplete ? '#f0fdf4' : '#eff6ff',
                                                color: isNotEnrolled ? '#dc2626' : isPending ? '#c2410c' : isComplete ? '#15803d' : '#1d4ed8',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                            }}>
                                                {isNotEnrolled ? '⚠️ Not in System' : req.status}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {(req.status === 'Not in System' || req.notInSystem) && (
                                        <button
                                            onClick={() => handleAddToRoster(req)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                padding: '0.4rem 0.75rem', borderRadius: '6px',
                                                backgroundColor: '#0d9488', color: 'white',
                                                border: 'none', cursor: 'pointer',
                                                fontSize: '0.85rem', fontWeight: '500',
                                            }}
                                            title="Add Student to Class Roster"
                                        >
                                            <UserPlus size={14} /> Add to Roster
                                        </button>
                                    )}
                                    <Link
                                        to={`/teacher/transcript/${req.id}`}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                            padding: '0.4rem 0.75rem', borderRadius: '6px',
                                            backgroundColor: (req.status === 'Not in System' || req.notInSystem) ? 'transparent' : '#0d9488',
                                            color: (req.status === 'Not in System' || req.notInSystem) ? '#0d9488' : 'white',
                                            border: (req.status === 'Not in System' || req.notInSystem) ? '1px solid #0d9488' : 'none',
                                            textDecoration: 'none', fontSize: '0.85rem',
                                            fontWeight: '500',
                                        }}
                                        title="Edit Transcript"
                                    >
                                        <Pencil size={14} /> Edit
                                    </Link>
                                    {(req.status === 'Pending') && (
                                        <button
                                            onClick={() => handleMarkReady(req.id)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                padding: '0.4rem 0.75rem', borderRadius: '6px',
                                                backgroundColor: 'transparent', color: '#15803d',
                                                border: '1px solid #bbf7d0', cursor: 'pointer',
                                                fontSize: '0.85rem', fontWeight: '500',
                                            }}
                                            title="Mark as Ready for Review"
                                        >
                                            <CheckCircle size={14} /> Ready
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No transcripts found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
