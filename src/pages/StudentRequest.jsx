import React, { useState, useEffect } from 'react';
import { createRequest, getTeacherCodes, lookupStudentForRequest } from '../lib/data';

export default function StudentRequest() {
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', studentId: '', email: '',
        program: '', type: 'Official', deliveryMethod: 'Email'
    });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [requestResult, setRequestResult] = useState(null);

    useEffect(() => {
        getTeacherCodes()
            .then(data => setPrograms(data.map(tc => tc.program)))
            .catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setRequestResult(null);

        const lookup = await lookupStudentForRequest(formData.studentId, formData.program);

        let status, message;
        if (lookup.status === 'not_enrolled') {
            setRequestResult({
                status: 'error',
                message: 'You are not enrolled in this program. Please contact your teacher to be added to the roster.'
            });
            setSubmitting(false);
            return;
        } else if (lookup.status === 'ready') {
            status = 'Ready for Review';
            message = 'Your transcript is complete and has been sent to the admin for review!';
        } else {
            status = 'Pending — Awaiting Grades';
            message = 'Your request has been submitted. Your instructor has not yet completed your transcript.';
        }

        await createRequest({
            ...formData,
            status,
            transcriptId: lookup.transcript?.id || null,
            enrolledStudentId: lookup.student?.id || null,
            requestDate: new Date().toISOString().split('T')[0]
        });

        setRequestResult({ status: 'success', message });
        setSubmitted(true);
        setSubmitting(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (submitted) {
        return (
            <div className="container" style={{ maxWidth: '600px', marginTop: '2rem', textAlign: 'center' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h2 style={{ color: 'var(--success-color)', marginBottom: '0.75rem', fontSize: '1.3rem' }}>Request Submitted!</h2>
                    <p style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>{requestResult?.message}</p>
                    <div style={{
                        padding: '0.5rem 0.75rem', borderRadius: '8px',
                        backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                        color: '#166534', fontSize: '0.85rem', marginBottom: '0.75rem',
                    }}>
                        You will receive an email once your transcript has been processed.
                    </div>
                    <button className="btn btn-primary" onClick={() => {
                        setSubmitted(false);
                        setRequestResult(null);
                        setFormData(f => ({ ...f, firstName: '', lastName: '', studentId: '', email: '' }));
                    }}>Submit Another Request</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '720px', paddingTop: '0.5rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Request Academic Transcript</h2>

            {/* Pricing Banner */}
            <div style={{
                display: 'flex', gap: '0.75rem', marginBottom: '0.75rem',
            }}>
                <div style={{
                    flex: 1, padding: '0.6rem 1rem', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                    border: '1px solid #bfdbfe', textAlign: 'center',
                }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e40af' }}>$10.00</div>
                    <div style={{ fontSize: '0.78rem', color: '#3b82f6', fontWeight: '500' }}>Official Transcript</div>
                </div>
                <div style={{
                    flex: 1, padding: '0.6rem 1rem', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    border: '1px solid #bbf7d0', textAlign: 'center',
                }}>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#15803d' }}>FREE</div>
                    <div style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: '500' }}>Unofficial Transcript</div>
                </div>
            </div>

            <div className="card" style={{ padding: '1rem 1.25rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.6rem' }}>

                    {/* Row 1: Name fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>First Name</label>
                            <input required name="firstName" value={formData.firstName} onChange={handleChange}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>Last Name</label>
                            <input required name="lastName" value={formData.lastName} onChange={handleChange}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    {/* Row 2: ID + Email */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>Student ID</label>
                            <input required name="studentId" value={formData.studentId} onChange={handleChange}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleChange}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }} />
                        </div>
                    </div>

                    {/* Row 3: Program + Type + Delivery */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.6rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>Program</label>
                            <select name="program" value={formData.program} onChange={handleChange} required
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }}>
                                <option value="">— Select —</option>
                                {programs.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }}>
                                <option>Official</option>
                                <option>Unofficial</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', marginBottom: '0.15rem', display: 'block' }}>Delivery</label>
                            <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange}
                                style={{ padding: '0.45rem 0.6rem', fontSize: '0.9rem' }}>
                                <option>Email</option>
                                <option>Mail</option>
                                <option>Pick-up</option>
                            </select>
                        </div>
                    </div>

                    {/* Cost display */}
                    <div style={{
                        padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem',
                        backgroundColor: formData.type === 'Official' ? '#eff6ff' : '#f0fdf4',
                        color: formData.type === 'Official' ? '#1e40af' : '#15803d',
                        fontWeight: '600', textAlign: 'center',
                    }}>
                        {formData.type === 'Official' ? 'Fee: $10.00 — payable upon pick-up or by mail' : 'No charge for unofficial transcripts'}
                    </div>

                    {requestResult?.status === 'error' && (
                        <div style={{
                            padding: '0.5rem 0.75rem', borderRadius: '6px',
                            backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                            color: '#991b1b', fontSize: '0.85rem',
                        }}>
                            ⚠️ {requestResult.message}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary"
                        style={{ padding: '0.6rem', fontSize: '0.95rem', marginTop: '0.2rem' }}
                        disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
}
