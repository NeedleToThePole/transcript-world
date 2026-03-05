import React, { useEffect, useState } from 'react';
import { getRequests } from '../lib/data';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [recentRequests, setRecentRequests] = useState([]);

    useEffect(() => {
        getRequests().then(data => {
            setStats({
                total: data.length,
                pending: data.filter(r => r.status === 'Pending').length,
                completed: data.filter(r => r.status === 'Completed').length
            });
            setRecentRequests(data.slice(0, 5)); // Get first 5
        });
    }, []);

    const StatCard = ({ icon: Icon, title, value, color }) => (
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h2 style={{ marginBottom: '1.5rem' }}>Dashboard Overview</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard icon={FileText} title="Total Requests" value={stats.total} color="var(--primary-color)" />
                <StatCard icon={Clock} title="Pending Approval" value={stats.pending} color="var(--warning-color)" />
                <StatCard icon={CheckCircle} title="Completed" value={stats.completed} color="var(--success-color)" />
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.1rem' }}>Recent Requests</h3>
                    <Link to="/admin/requests" className="btn btn-outline">View All</Link>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '0.75rem' }}>Student ID</th>
                            <th style={{ padding: '0.75rem' }}>Type</th>
                            <th style={{ padding: '0.75rem' }}>Date</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentRequests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '0.75rem' }}>{req.studentId}</td>
                                <td style={{ padding: '0.75rem' }}>{req.type}</td>
                                <td style={{ padding: '0.75rem' }}>{req.requestDate}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        backgroundColor: req.status === 'Pending' ? '#fff7ed' : '#f0fdf4',
                                        color: req.status === 'Pending' ? '#c2410c' : '#15803d'
                                    }}>
                                        {req.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {recentRequests.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No requests found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
