import React, { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus } from '../lib/data';
import { Link } from 'react-router-dom';
import { Eye, Check, X, Printer, Mail, FileText } from 'lucide-react';

export default function RequestQueue() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('All');

    const fetchRequests = async () => {
        const data = await getRequests();
        setRequests(data);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        await updateRequestStatus(id, status);
        fetchRequests();
    };

    const statuses = ['All', 'Ready for Review', 'Pending', 'Pending — Awaiting Grades', 'Processing', 'Completed'];

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => r.status === filter || (filter === 'Pending' && r.status?.startsWith('Pending')));

    const statusBadge = (status) => {
        const colors = {
            'Ready for Review': { bg: '#f0fdf4', color: '#15803d' },
            'Pending': { bg: '#fff7ed', color: '#c2410c' },
            'Pending — Awaiting Grades': { bg: '#fefce8', color: '#a16207' },
            'Processing': { bg: '#eff6ff', color: '#1d4ed8' },
            'Completed': { bg: '#f0fdf4', color: '#15803d' },
        };
        const c = colors[status] || colors['Pending'];
        return (
            <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.72rem',
                backgroundColor: c.bg,
                color: c.color,
                fontWeight: '600',
                whiteSpace: 'nowrap',
            }}>
                {status}
            </span>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Request Queue</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: 'auto', padding: '0.5rem 2rem' }}
                >
                    {statuses.map(s => <option key={s}>{s}</option>)}
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
                        {filteredRequests.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                                    No requests {filter !== 'All' ? `with status "${filter}"` : 'yet'}.
                                </td>
                            </tr>
                        )}
                        {filteredRequests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: '600' }}>{req.firstName} {req.lastName}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {req.studentId}</div>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{req.program}</td>
                                <td style={{ padding: '1rem' }}>{req.type}</td>
                                <td style={{ padding: '1rem' }}>{req.requestDate}</td>
                                <td style={{ padding: '1rem' }}>{statusBadge(req.status)}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        <Link to={`/admin/transcript/${req.id}`} className="btn btn-primary" style={{ padding: '0.4rem' }} title="View Transcript">
                                            <Eye size={16} />
                                        </Link>

                                        {req.status === 'Ready for Review' && (
                                            <>
                                                <Link
                                                    to={`/admin/official/${req.id}`}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.4rem', color: '#0d9488', borderColor: '#0d9488' }}
                                                    title="View Official Transcript"
                                                >
                                                    <FileText size={16} />
                                                </Link>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.4rem', color: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                                                    onClick={() => handleStatusUpdate(req.id, 'Completed')}
                                                    title="Mark Complete"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            </>
                                        )}

                                        {(req.status === 'Pending' || req.status?.startsWith('Pending')) && (
                                            <>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.4rem', color: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                                                    onClick={() => handleStatusUpdate(req.id, 'Processing')}
                                                    title="Approve / Start"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.4rem', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
                                                    onClick={() => handleStatusUpdate(req.id, 'Denied')}
                                                    title="Deny"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </>
                                        )}

                                        {req.status === 'Processing' && (
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', color: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                                                onClick={() => handleStatusUpdate(req.id, 'Completed')}
                                                title="Mark Complete"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}

                                        {req.status === 'Completed' && (
                                            <Link
                                                to={`/admin/official/${req.id}`}
                                                className="btn btn-outline"
                                                style={{ padding: '0.4rem', color: '#0d9488', borderColor: '#0d9488' }}
                                                title="View Official / Print"
                                            >
                                                <Printer size={16} />
                                            </Link>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
