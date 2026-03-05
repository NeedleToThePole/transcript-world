import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="no-print" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            backgroundColor: 'white',
            borderBottom: '1px solid #e2e8f0'
        }}>
            <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-main)' }}>Transcript Manager</h1>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Raphael O. Wheatley Skill Center</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
                    <Bell size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem'
                    }}>
                        JD
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Jane Doe</span>
                </div>
            </div>
        </header>
    );
}
