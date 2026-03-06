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

    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggleExpand = (id) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
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
                            <React.Fragment key={req.id}>
                                <tr style={{ borderBottom: expandedIds.has(req.id) ? 'none' : '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s' }} onClick={() => toggleExpand(req.id)} className="hover-row">
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '600' }}>{req.firstName} {req.lastName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {req.studentId}</div>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem' }}>{req.program}</td>
                                    <td style={{ padding: '1rem' }}>{req.type}</td>
                                    <td style={{ padding: '1rem' }}>{req.requestDate}</td>
                                    <td style={{ padding: '1rem' }}>{statusBadge(req.status)}</td>
                                    <td style={{ padding: '1rem' }} onClick={(e) => e.stopPropagation()}>
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
                                {expandedIds.has(req.id) && (
                                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #f1f5f9' }}>
                                        <td colSpan="6" style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
                                                {/* Left: Personal & Mailing */}
                                                <div>
                                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Personal & Contact</h4>
                                                    <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                        <div><strong>DOB:</strong> {req.dob || 'N/A'}</div>
                                                        <div><strong>SSN:</strong> {req.ssn || 'N/A'}</div>
                                                        <div><strong>Phone:</strong> {req.phone || 'N/A'}</div>
                                                        <div><strong>Email:</strong> {req.email || 'N/A'}</div>
                                                        <div style={{ marginTop: '0.5rem' }}><strong>Mailing Address:</strong><br />
                                                            {req.addressStreet}<br />
                                                            {req.addressCity}, {req.addressState} {req.addressZip}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Middle: Enrollment & Options */}
                                                <div>
                                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Enrollment & Request</h4>
                                                    <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                        <div><strong>Enrolled:</strong> {req.yearEnrolled || 'N/A'}</div>
                                                        <div><strong>Last Attended:</strong> {req.yearLastAttended || 'N/A'}</div>
                                                        <div><strong>Semester:</strong> {req.semester || 'N/A'}</div>
                                                        <div style={{ marginTop: '0.5rem' }}><strong>Processing:</strong> {req.processingOption}</div>
                                                        <div><strong>Copies:</strong> {req.copies}</div>
                                                        <div><strong>Delivery:</strong> {req.deliveryMethod}</div>
                                                    </div>
                                                </div>
                                                {/* Right: Forwarding */}
                                                <div>
                                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Forward To</h4>
                                                    <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                                                        {req.forwardName ? (
                                                            <>
                                                                <div><strong>Name:</strong> {req.forwardName}</div>
                                                                <div><strong>Phone:</strong> {req.forwardPhone || 'N/A'}</div>
                                                                <div><strong>Address:</strong><br />
                                                                    {req.forwardStreet}<br />
                                                                    {req.forwardCity}, {req.forwardState} {req.forwardZip}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No forwarding info provided</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
