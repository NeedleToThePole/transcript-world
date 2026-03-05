import React, { useState, useEffect } from 'react';
import { Lock, BookOpen } from 'lucide-react';
import { getTeacherCodes } from '../lib/data';

export default function TeacherLogin({ onLogin }) {
    const [step, setStep] = useState(1);           // 1 = pick program, 2 = enter code
    const [selectedProgram, setSelectedProgram] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [teacherCodes, setTeacherCodes] = useState([]);

    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        getTeacherCodes()
            .then(data => { setTeacherCodes(data); setApiError(false); })
            .catch(() => setApiError(true));
    }, []);

    const handleProgramSelect = () => {
        if (!selectedProgram) {
            setError('Please select a program.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleCodeSubmit = (e) => {
        e.preventDefault();
        const match = teacherCodes.find(
            tc => tc.program === selectedProgram && tc.code === code
        );
        if (match) {
            onLogin(selectedProgram);
        } else {
            setError('Invalid access code. Please try again.');
            setCode('');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0fdf4',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                width: '100%',
                maxWidth: '440px',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    backgroundColor: '#0d9488',
                    color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                }}>
                    {step === 1 ? <BookOpen size={28} /> : <Lock size={28} />}
                </div>

                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Teacher Access</h2>

                {apiError && (
                    <p style={{ color: '#dc2626', fontSize: '0.8rem', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '6px', marginBottom: '1rem' }}>
                        ⚠️ Cannot connect to the server. Make sure json-server is running on port 3000.
                    </p>
                )}

                {step === 1 ? (
                    <>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            Select your program to continue.
                        </p>

                        <select
                            value={selectedProgram}
                            onChange={e => { setSelectedProgram(e.target.value); setError(''); }}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                marginBottom: '1rem',
                                boxSizing: 'border-box',
                                backgroundColor: 'white',
                            }}
                        >
                            <option value="">— Choose Program —</option>
                            {teacherCodes.map(tc => (
                                <option key={tc.id} value={tc.program}>{tc.program}</option>
                            ))}
                        </select>

                        {error && (
                            <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
                        )}

                        <button
                            onClick={handleProgramSelect}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '1rem',
                                backgroundColor: '#0d9488',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            Continue
                        </button>
                    </>
                ) : (
                    <>
                        <p style={{ color: '#64748b', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                            Enter the access code for:
                        </p>
                        <p style={{
                            color: '#0d9488', fontWeight: '600', fontSize: '1rem',
                            marginBottom: '1.5rem',
                        }}>
                            {selectedProgram}
                        </p>

                        <form onSubmit={handleCodeSubmit}>
                            <input
                                type="password"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                placeholder="Enter access code"
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
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    fontSize: '1rem',
                                    backgroundColor: '#0d9488',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'background-color 0.2s',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                Sign In
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep(1); setCode(''); setError(''); }}
                                style={{
                                    width: '100%',
                                    padding: '0.6rem',
                                    fontSize: '0.9rem',
                                    backgroundColor: 'transparent',
                                    color: '#64748b',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                }}
                            >
                                ← Back to Program Selection
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
