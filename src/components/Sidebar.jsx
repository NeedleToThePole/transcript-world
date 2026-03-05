import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileText, GraduationCap, LogOut, Mail } from 'lucide-react';

export default function Sidebar({ onLogout }) {
    const navStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--border-radius)',
        color: isActive ? 'white' : 'var(--text-muted)',
        backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
        marginBottom: '0.5rem',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'all 0.2s'
    });

    return (
        <aside className="no-print" style={{
            width: '260px',
            backgroundColor: 'white',
            borderRight: '1px solid #e2e8f0',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Link to="/admin/dashboard" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', textDecoration: 'none' }}>
                <GraduationCap size={28} />
                <span>ROWSC</span>
            </Link>

            <nav style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.5rem', paddingLeft: '1rem' }}>
                    ADMINISTRATION
                </div>
                <NavLink to="/admin/dashboard" style={navStyle}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>
                <NavLink to="/admin/requests" style={navStyle}>
                    <FileText size={20} />
                    Requests Queue
                </NavLink>
                <NavLink to="/admin/reminders" style={navStyle}>
                    <Mail size={20} />
                    Teacher Reminders
                </NavLink>
            </nav>

            <button
                onClick={onLogout}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', borderRadius: 'var(--border-radius)',
                    color: '#dc2626', backgroundColor: 'transparent',
                    border: '1px solid #fecaca', cursor: 'pointer',
                    fontWeight: '500', fontSize: '0.9rem',
                    transition: 'all 0.2s',
                }}
            >
                <LogOut size={18} /> Sign Out
            </button>
        </aside>
    );
}
