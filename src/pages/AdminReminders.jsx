import React, { useState, useEffect } from 'react';
import { getTeacherCodes, getStudentsByProgram, getTranscriptByStudentId } from '../lib/data';
import { Mail, Clock, CheckCircle, AlertTriangle, Send } from 'lucide-react';

export default function AdminReminders() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentReminders, setSentReminders] = useState({});

    useEffect(() => {
        loadProgramStats();
    }, []);

    async function loadProgramStats() {
        setLoading(true);
        const codes = await getTeacherCodes();
        const stats = await Promise.all(codes.map(async (tc) => {
            const students = await getStudentsByProgram(tc.program);
            let complete = 0, inProgress = 0, notStarted = 0;
            await Promise.all(students.map(async (s) => {
                const t = await getTranscriptByStudentId(s.id);
                if (t?.status === 'complete') complete++;
                else if (t) inProgress++;
                else notStarted++;
            }));
            return {
                ...tc,
                total: students.length,
                complete,
                inProgress,
                notStarted,
                incomplete: inProgress + notStarted,
            };
        }));
        setPrograms(stats);
        setLoading(false);
    }

    function sendReminder(prog) {
        const subject = encodeURIComponent(
            `Friendly Reminder: Please Complete Student Transcripts — ${prog.program}`
        );
        const body = encodeURIComponent(
            `Dear ${prog.teacherName || prog.program + ' Instructor'},

This is a friendly reminder to please complete the student transcripts for your ${prog.program} program.

Current Status:
• Total Students: ${prog.total}
• Completed: ${prog.complete}
• In Progress: ${prog.inProgress}
• Not Started: ${prog.notStarted}

Please log in to the ROWSC Transcript Portal and complete any remaining transcripts at your earliest convenience. Timely completion ensures students can receive their official transcripts without delay.

Thank you for your time and dedication!

Best regards,
Raphael O. Wheatley Skill Center
Administration`
        );
        window.open(`mailto:${prog.teacherEmail || ''}?subject=${subject}&body=${body}`, '_self');
        setSentReminders(prev => ({ ...prev, [prog.program]: new Date().toLocaleString() }));
    }

    function sendBulkReminder() {
        const incomplete = programs.filter(p => p.incomplete > 0);
        if (incomplete.length === 0) return;
        const emails = incomplete.map(p => p.teacherEmail).filter(Boolean).join(',');
        const subject = encodeURIComponent('Friendly Reminder: Please Complete Student Transcripts');
        const body = encodeURIComponent(
            `Dear Instructors,

This is a friendly reminder to please complete the student transcripts for your program.

Please log in to the ROWSC Transcript Portal and complete any remaining transcripts at your earliest convenience. Timely completion ensures students can receive their official transcripts without delay.

Thank you for your time and dedication!

Best regards,
Raphael O. Wheatley Skill Center
Administration`
        );
        window.open(`mailto:${emails}?subject=${subject}&body=${body}`, '_self');
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading program stats...</div>;

    const withIncomplete = programs.filter(p => p.incomplete > 0);
    const allComplete = programs.filter(p => p.incomplete === 0 && p.total > 0);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ margin: 0 }}><Mail size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Teacher Reminders</h2>
                    <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                        Send friendly reminders to complete student transcripts
                    </p>
                </div>
                {withIncomplete.length > 0 && (
                    <button
                        onClick={sendBulkReminder}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.6rem 1.2rem', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white', border: 'none', cursor: 'pointer',
                            fontWeight: '600', fontSize: '0.9rem',
                            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                        }}
                    >
                        <Send size={16} /> Remind All ({withIncomplete.length})
                    </button>
                )}
            </div>

            {/* Programs with incomplete transcripts */}
            {withIncomplete.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                        Needs Attention ({withIncomplete.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {withIncomplete.map(prog => (
                            <div key={prog.id} style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                padding: '1rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                borderLeft: '4px solid #f59e0b',
                            }}>
                                {/* Program info */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.3rem' }}>
                                        {prog.program}
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                        {prog.teacherEmail || 'No email set'}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: '#475569' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#16a34a' }}>{prog.complete}</div>
                                        <div>Done</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#ca8a04' }}>{prog.inProgress}</div>
                                        <div>In Progress</div>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#dc2626' }}>{prog.notStarted}</div>
                                        <div>Not Started</div>
                                    </div>
                                    <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem' }}>
                                        <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{prog.total}</div>
                                        <div>Total</div>
                                    </div>
                                </div>

                                {/* Send button */}
                                <button
                                    onClick={() => sendReminder(prog)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                        padding: '0.5rem 1rem', borderRadius: '8px',
                                        backgroundColor: sentReminders[prog.program] ? '#f0fdf4' : '#fff7ed',
                                        color: sentReminders[prog.program] ? '#16a34a' : '#c2410c',
                                        border: `1px solid ${sentReminders[prog.program] ? '#bbf7d0' : '#fed7aa'}`,
                                        cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {sentReminders[prog.program] ? (
                                        <><CheckCircle size={15} /> Sent</>
                                    ) : (
                                        <><Mail size={15} /> Remind</>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All complete programs */}
            {allComplete.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <CheckCircle size={14} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />
                        All Complete ({allComplete.length})
                    </h3>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {allComplete.map(prog => (
                            <div key={prog.id} style={{
                                backgroundColor: '#f0fdf4',
                                borderRadius: '10px',
                                border: '1px solid #bbf7d0',
                                padding: '0.75rem 1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                borderLeft: '4px solid #22c55e',
                            }}>
                                <CheckCircle size={18} color="#16a34a" />
                                <div style={{ flex: 1, fontWeight: '500' }}>{prog.program}</div>
                                <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {prog.complete}/{prog.total} complete
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {programs.every(p => p.total === 0) && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                    <p>No students enrolled in any programs yet.</p>
                </div>
            )}
        </div>
    );
}
