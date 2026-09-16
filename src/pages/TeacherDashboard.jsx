import React, { useEffect, useState } from 'react';
import { getRequests } from '../lib/data';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeacherDashboard({ teacherProgram }) {
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [recentRequests, setRecentRequests] = useState([]);
    const [notInSystemCount, setNotInSystemCount] = useState(0);

    useEffect(() => {
        getRequests().then(allData => {
            // Filter to only this teacher's program
            const data = teacherProgram
                ? allData.filter(r => r.program === teacherProgram)
                : allData;
            const notInSys = data.filter(r => r.status === 'Not in System' || r.notInSystem);
            setNotInSystemCount(notInSys.length);
            setStats({
                total: data.length,
                pending: data.filter(r => r.status === 'Pending' || r.status?.startsWith('Pending') || r.status === 'Processing' || r.status === 'Not in System' || r.notInSystem).length,
                completed: data.filter(r => r.status === 'Completed').length
            });
            setRecentRequests(data.slice(0, 5));
        });
    }, [teacherProgram]);

    return (
        <div>
            <h2 style={{ marginBottom: '0.25rem' }}>Teacher Dashboard</h2>
            {teacherProgram && (
                <p style={{ color: '#0d9488', fontWeight: '500', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    Program: {teacherProgram}
                </p>
            )}

            {notInSystemCount > 0 && (
                <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    padding: '0.85rem 1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    color: '#991b1b',
                }}>
                    <div>
                        <strong>⚠️ Notice:</strong> {notInSystemCount} student{notInSystemCount > 1 ? 's' : ''} requested a transcript for {teacherProgram} but {notInSystemCount > 1 ? 'are' : 'is'} not currently in your system roster.
                    </div>
                    <Link
                        to="/teacher/transcripts"
                        style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '6px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                        }}
                    >
                        Review Requests →
                    </Link>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: '#ccfbf120', color: '#0d9488' }}>
                        <FileText size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Assigned</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total}</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: '#fff7ed', color: '#c2410c' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Needs Attention</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pending}</p>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: '#f0fdf4', color: '#15803d' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Completed</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.completed}</p>
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Recent Assignments</h3>
                    <Link to="/teacher/transcripts" className="btn btn-outline">View All</Link>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '0.75rem' }}>Student</th>
                            <th style={{ padding: '0.75rem' }}>Program</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentRequests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem' }}>{req.firstName} {req.lastName}</td>
                                <td style={{ padding: '0.75rem' }}>{req.program || '—'}</td>
                                <td style={{ padding: '0.75rem' }}>{req.requestDate}</td>
                                <td style={{ padding: '0.75rem' }}>
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
                            </tr>
                        ))}
                        {recentRequests.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No assignments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
