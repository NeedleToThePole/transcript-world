import React, { useState, useEffect } from 'react';
import { createRequest, getTeacherCodes, lookupStudentForRequest } from '../lib/data';

export default function StudentRequest() {
    const [programs, setPrograms] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', ssn: '', dob: '', phone: '', email: '', studentId: '',
        addressStreet: '', addressCity: '', addressState: '', addressZip: '',
        yearEnrolled: '', yearLastAttended: '', semester: '', program: '',
        type: 'Official', deliveryMethod: 'Email', processingOption: 'Process Immediately', copies: 1,
        forwardName: '', forwardStreet: '', forwardCity: '', forwardState: '', forwardZip: '', forwardPhone: ''
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
        if (lookup.status === 'not_enrolled' && formData.studentId.toUpperCase() !== 'TEST') {
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

    const labelStyle = { fontSize: '0.75rem', marginBottom: '0.1rem', display: 'block', fontWeight: '600', color: '#4b5563' };
    const inputStyle = { padding: '0.35rem 0.5rem', fontSize: '0.85rem', width: '100%' };

    return (
        <div className="container" style={{ maxWidth: '850px', paddingTop: '0.5rem', paddingBottom: '2rem' }}>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', textAlign: 'center' }}>Transcript Request Form</h2>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1e40af' }}>$10.00 Official</div>
                </div>
                <div style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: '#15803d' }}>FREE Unofficial</div>
                </div>
            </div>

            <div className="card" style={{ padding: '1rem 1.25rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>

                    {/* Section 1: Personal Info */}
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr', gap: '0.5rem' }}>
                            <div>
                                <label style={labelStyle}>First Name</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Last Name</label>
                                <input required name="lastName" value={formData.lastName} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>SSN (Last 4)</label>
                                <input name="ssn" value={formData.ssn} onChange={handleChange} style={inputStyle} placeholder="Optional" maxlength="4" />
                            </div>
                            <div>
                                <label style={labelStyle}>Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <input name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Student ID #</label>
                                <input required name="studentId" value={formData.studentId} onChange={handleChange} style={inputStyle} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Mailing Address */}
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                        <label style={{ ...labelStyle, fontSize: '0.8rem', color: '#111827', marginBottom: '0.4rem' }}>Current Mailing Address</label>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <div>
                                <label style={labelStyle}>Street Address</label>
                                <input name="addressStreet" value={formData.addressStreet} onChange={handleChange} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={labelStyle}>City</label>
                                    <input name="addressCity" value={formData.addressCity} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>State</label>
                                    <input name="addressState" value={formData.addressState} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Zip Code</label>
                                    <input name="addressZip" value={formData.addressZip} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Enrollment Info */}
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div>
                            <label style={labelStyle}>Program of Study</label>
                            <select name="program" value={formData.program} onChange={handleChange} required style={inputStyle}>
                                <option value="">— Select —</option>
                                {programs.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Year Enrolled</label>
                            <input name="yearEnrolled" value={formData.yearEnrolled} onChange={handleChange} style={inputStyle} placeholder="e.g. 2023" />
                        </div>
                        <div>
                            <label style={labelStyle}>Last Year Attended</label>
                            <input name="yearLastAttended" value={formData.yearLastAttended} onChange={handleChange} style={inputStyle} placeholder="e.g. 2024" />
                        </div>
                        <div>
                            <label style={labelStyle}>Semester</label>
                            <select name="semester" value={formData.semester} onChange={handleChange} style={inputStyle}>
                                <option value="">Select</option>
                                <option>Spring</option>
                                <option>Fall</option>
                            </select>
                        </div>
                    </div>

                    {/* Section 4: Request Options */}
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1fr', gap: '0.5rem' }}>
                        <div>
                            <label style={labelStyle}>Transcript Type</label>
                            <select name="type" value={formData.type} onChange={handleChange} style={inputStyle}>
                                <option>Official</option>
                                <option>Unofficial</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Delivery Method</label>
                            <select name="deliveryMethod" value={formData.deliveryMethod} onChange={handleChange} style={inputStyle}>
                                <option>Email</option>
                                <option>Mail</option>
                                <option>Pick-up</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Processing</label>
                            <select name="processingOption" value={formData.processingOption} onChange={handleChange} style={inputStyle}>
                                <option>Process Immediately</option>
                                <option>Hold for Grade Change</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Copies</label>
                            <input type="number" name="copies" value={formData.copies} onChange={handleChange} style={inputStyle} min="1" />
                        </div>
                    </div>

                    {/* Section 5: Forwarding Info (Always visible, not required) */}
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '8px' }}>
                        <label style={{ ...labelStyle, fontSize: '0.8rem', color: '#111827', marginBottom: '0.4rem' }}>Forward Transcript To (Optional)</label>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Name / Institution</label>
                                    <input name="forwardName" value={formData.forwardName} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone</label>
                                    <input name="forwardPhone" value={formData.forwardPhone} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={labelStyle}>Street Address / P.O. Box</label>
                                    <input name="forwardStreet" value={formData.forwardStreet} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                                <div>
                                    <label style={labelStyle}>City</label>
                                    <input name="forwardCity" value={formData.forwardCity} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>State</label>
                                    <input name="forwardState" value={formData.forwardState} onChange={handleChange} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Zip Code</label>
                                    <input name="forwardZip" value={formData.forwardZip} onChange={handleChange} style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost display */}
                    <div style={{
                        padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem',
                        backgroundColor: formData.type === 'Official' ? '#eff6ff' : '#f0fdf4',
                        color: formData.type === 'Official' ? '#1e40af' : '#15803d',
                        fontWeight: '700', textAlign: 'center', border: '1px solid',
                        borderColor: formData.type === 'Official' ? '#bfdbfe' : '#bbf7d0'
                    }}>
                        {formData.type === 'Official' ? 'Fee: $10.00 — payable upon pick-up or by mail' : 'No charge for unofficial transcripts'}
                    </div>
                    <br />
                    <button type="submit" className="btn btn-primary"
                        style={{ padding: '0.75rem', fontSize: '1rem', fontWeight: 'bold' }}
                        disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    {requestResult?.status === 'error' && (
                        <div style={{ padding: '0.5rem', borderRadius: '6px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.8rem', textAlign: 'center' }}>
                            ⚠️ {requestResult.message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
