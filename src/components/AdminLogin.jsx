import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { loginAdmin } from '../lib/data';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await loginAdmin(password);
            if (result.ok) {
                onLogin();
            } else {
                setError(result.error || 'Incorrect password. Please try again.');
                setPassword('');
            }
        } catch {
            setError('Unable to reach server. Please try again.');
        } finally {
            setLoading(false);
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
                        disabled={loading}
                    />

                    {error && (
                        <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
