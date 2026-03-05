import React, { useEffect, useState } from 'react';
import { getRequests, updateRequestStatus } from '../lib/data';
import { Link } from 'react-router-dom';
import { Pencil, CheckCircle } from 'lucide-react';

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
    }, []);

    const handleMarkReady = async (id) => {
        await updateRequestStatus(id, 'Processing');
        fetchRequests();
    };

    const filteredRequests = filter === 'All'
        ? requests
        : requests.filter(r => r.status === filter);

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
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        backgroundColor: req.status === 'Pending' ? '#fff7ed' :
                                            req.status === 'Completed' ? '#f0fdf4' : '#eff6ff',
                                        color: req.status === 'Pending' ? '#c2410c' :
                                            req.status === 'Completed' ? '#15803d' : '#1d4ed8'
                                    }}>
                                        {req.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <Link
                                        to={`/teacher/transcript/${req.id}`}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                            padding: '0.4rem 0.75rem', borderRadius: '6px',
                                            backgroundColor: '#0d9488', color: 'white',
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
