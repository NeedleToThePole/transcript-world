import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '0000') {
            onLogin();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                }}>
                    <Lock size={28} />
                </div>

                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Admin Access</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>
                    Enter the administrator password to continue.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter password"
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            marginBottom: '1rem',
                            boxSizing: 'border-box',
                        }}
                        autoFocus
                    />

                    {error && (
                        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}
