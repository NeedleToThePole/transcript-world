import React, { useState, useEffect } from 'react';
import { getRequests } from '../lib/data';
import { useNavigate } from 'react-router-dom';
import { Bell, X, ArrowRight } from 'lucide-react';

export default function AdminToast() {
    const [readyCount, setReadyCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getRequests().then(data => {
            const ready = data.filter(r => r.status === 'Ready for Review').length;
            setReadyCount(ready);
            if (ready > 0 && !dismissed) {
                setTimeout(() => setVisible(true), 600);
                setTimeout(() => setVisible(false), 8000);
            }
        });
    }, []);

    const handleGoToQueue = () => {
        setVisible(false);
        navigate('/admin/requests');
    };

    const handleDismiss = () => {
        setVisible(false);
        setDismissed(true);
    };

    if (readyCount === 0 || dismissed) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: visible ? '1.5rem' : '-120px',
            right: '1.5rem',
            zIndex: 9999,
            transition: 'bottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            maxWidth: '420px',
            width: '100%',
        }}>
            <div style={{
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: 'white',
            }}>
                {/* Pulse icon */}
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    animation: 'toastPulse 2s ease-in-out infinite',
                }}>
                    <Bell size={22} color="white" />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                        {readyCount} Transcript{readyCount > 1 ? 's' : ''} Ready!
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        {readyCount > 1 ? 'Completed transcripts are' : 'A completed transcript is'} waiting for your review.
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                        onClick={handleGoToQueue}
                        style={{
                            padding: '0.5rem 0.9rem',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                        }}
                    >
                        View <ArrowRight size={14} />
                    </button>
                    <button
                        onClick={handleDismiss}
                        style={{
                            padding: '0.4rem',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#94a3b8',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Keyframe animation via inline style tag */}
            <style>{`
                @keyframes toastPulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
                }
            `}</style>
        </div>
    );
}
