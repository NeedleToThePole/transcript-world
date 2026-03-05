import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, getStudentByInternalId, getTranscriptByStudentId, saveTranscript } from '../lib/data';
import { getTemplateForProgram } from '../data/programTemplates';
import { Printer, Save, Pencil, Eye, Mail, Check } from 'lucide-react';

// ─── Shared styles ───────────────────────────────────────────────
const cellStyle = { border: '1px solid black', padding: '2px 4px', fontSize: '0.8rem' };
const inputStyle = {
    border: 'none',
    borderBottom: '1px solid #999',
    background: 'transparent',
    width: '100%',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    padding: '1px 2px',
    textAlign: 'center',
    boxShadow: 'none',
};
const fieldInputStyle = {
    border: 'none',
    borderBottom: '1px solid #999',
    background: 'transparent',
    fontFamily: 'inherit',
    fontSize: 'inherit',
    padding: '0 4px',
    minWidth: '80px',
    boxShadow: 'none',
};

// ─── Standalone components (outside main fn to keep stable identity) ─
function Field({ value, onChange, style = {}, align, editMode }) {
    if (editMode) {
        return (
            <input
                style={{ ...fieldInputStyle, ...style, textAlign: align || 'left' }}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        );
    }
    return <span style={{ textDecoration: 'underline', ...style }}>{value || '________'}</span>;
}

function TopicColumn({ topics, hours, onUpdate, editMode, showChNum, chOffset }) {
    return (
        <table style={{ borderCollapse: 'collapse', border: '1px solid black', fontSize: '0.8rem', width: '100%' }}>
            <thead>
                <tr>
                    {showChNum && <th style={{ ...cellStyle, width: '35px', fontWeight: 'bold' }}>CH #</th>}
                    <th style={{ ...cellStyle, textAlign: 'left', fontWeight: 'bold' }}>
                        {showChNum ? 'Theory Subject' : 'Topics'}
                    </th>
                    <th style={{ ...cellStyle, width: '55px', fontWeight: 'bold' }}>
                        {showChNum ? <>Hours<br />Required</> : <>Total Hrs.<br />Required</>}
                    </th>
                    <th style={{ ...cellStyle, width: '55px', fontWeight: 'bold' }}>
                        {showChNum ? <>Hours<br />Completed</> : <>Total Hrs.<br />Completed</>}
                    </th>
                    {showChNum && <th style={{ ...cellStyle, width: '60px', fontWeight: 'bold' }}>Date</th>}
                </tr>
            </thead>
            <tbody>
                {topics.map((topic, i) => (
                    <tr key={i}>
                        {showChNum && (
                            <td style={{ ...cellStyle, textAlign: 'center' }}>{(chOffset || 0) + i + 1}</td>
                        )}
                        <td style={{
                            ...cellStyle,
                            fontWeight:
                                topic.name.toLowerCase().includes('eval') ||
                                    topic.name.toLowerCase().includes('exam') ||
                                    topic.name === 'Total Program Hours' ||
                                    topic.name === 'Externship Hours'
                                    ? 'bold' : 'normal'
                        }}>
                            {topic.name}
                        </td>
                        <td style={{ ...cellStyle, textAlign: 'center', fontWeight: 'bold' }}>{topic.hoursReq}</td>
                        <td style={cellStyle}>
                            {editMode ? (
                                <input
                                    style={inputStyle}
                                    value={hours[i]}
                                    onChange={e => onUpdate(i, e.target.value)}
                                    placeholder="—"
                                />
                            ) : (
                                <span style={{ display: 'block', textAlign: 'center' }}>{hours[i] || ''}</span>
                            )}
                        </td>
                        {showChNum && <td style={cellStyle}></td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// ─── Main editor ─────────────────────────────────────────────────
export default function TranscriptEditor({ role = 'admin', mode = 'request' }) {
    const { id } = useParams(); const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [student, setStudent] = useState(null);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(true);
    const [saveStatus, setSaveStatus] = useState('');
    const [transcriptStatus, setTranscriptStatus] = useState(null); // null | 'in_progress' | 'complete'

    // Editable header fields
    const [header, setHeader] = useState({
        studentName: '',
        program: '',
        instructor: '',
        instructor2: '',
        totalClassHours: '',
        totalExternshipHours: '',
        totalProgramHours: '',
        totalAccumulated: '',
        schoolYear: '',
        startDate: '',
        endDate: '',
        graduationDate: '',
        gpa: '',
        ceus: '',
        issueDate: '',
    });

    // Editable "hours completed" per column (up to 3 columns)
    const [colHours, setColHours] = useState([]);

    useEffect(() => {
        if (mode === 'student') {
            // Load by student ID (teacher roster flow)
            getStudentByInternalId(id).then(async (stu) => {
                if (stu) {
                    setStudent(stu);
                    const tmpl = getTemplateForProgram(stu.program);
                    setTemplate(tmpl);

                    // Check for existing saved transcript
                    const existing = await getTranscriptByStudentId(stu.id);
                    if (existing) setTranscriptStatus(existing.status || 'in_progress');

                    setHeader(h => ({
                        ...h,
                        studentName: `${stu.firstName || ''} ${stu.lastName || ''}`.trim(),
                        program: tmpl.defaults.program || stu.program || '',
                        totalClassHours: existing?.header?.totalClassHours || tmpl.defaults.totalClassHours || '',
                        totalExternshipHours: existing?.header?.totalExternshipHours || tmpl.defaults.totalExternshipHours || '',
                        totalProgramHours: existing?.header?.totalProgramHours || tmpl.defaults.totalProgramHours || '',
                        totalAccumulated: existing?.header?.totalAccumulated || tmpl.defaults.totalAccumulated || '',
                        ceus: existing?.header?.ceus || tmpl.defaults.ceus || '',
                        ...(existing?.header || {}),
                        studentName: existing?.header?.studentName || `${stu.firstName || ''} ${stu.lastName || ''}`.trim(),
                    }));

                    // Restore saved hours or initialize empty
                    if (existing?.colHours) {
                        setColHours(existing.colHours);
                    } else {
                        setColHours(tmpl.columns.map(col => col.topics.map(() => '')));
                    }
                }
                setLoading(false);
            });
        } else {
            // Load by request ID (original admin flow)
            getRequestById(id).then(async (req) => {
                if (req) {
                    setRequest(req);
                    const tmpl = getTemplateForProgram(req.program);
                    setTemplate(tmpl);

                    // Check if there's a saved transcript linked to this student
                    let existing = null;
                    if (req.transcriptId) {
                        existing = await getTranscriptByStudentId(req.transcriptId);
                    }

                    setHeader(h => ({
                        ...h,
                        studentName: existing?.header?.studentName || `${req.firstName || ''} ${req.lastName || ''}`.trim(),
                        program: existing?.header?.program || tmpl.defaults.program || req.program || '',
                        totalClassHours: existing?.header?.totalClassHours || tmpl.defaults.totalClassHours || '',
                        totalExternshipHours: existing?.header?.totalExternshipHours || tmpl.defaults.totalExternshipHours || '',
                        totalProgramHours: existing?.header?.totalProgramHours || tmpl.defaults.totalProgramHours || '',
                        totalAccumulated: existing?.header?.totalAccumulated || tmpl.defaults.totalAccumulated || '',
                        ceus: existing?.header?.ceus || tmpl.defaults.ceus || '',
                        ...(existing?.header || {}),
                    }));

                    if (existing?.colHours) {
                        setColHours(existing.colHours);
                    } else {
                        setColHours(tmpl.columns.map(col => col.topics.map(() => '')));
                    }
                }
                setLoading(false);
            });
        }
    }, [id, mode]);

    const updateHeader = (field, value) => {
        setHeader(h => ({ ...h, [field]: value }));
    };

    const updateColHourAt = (colIdx, rowIdx, value) => {
        setColHours(prev => {
            const copy = prev.map(arr => [...arr]);
            copy[colIdx][rowIdx] = value;
            return copy;
        });
    };

    const handlePrint = () => window.print();

    const handleSave = async (forceComplete = false) => {
        setSaveStatus('saving');
        const studentId = student?.id || request?.studentId || id;
        const program = student?.program || request?.program || header.program;

        // Auto-detect: complete only if all hours are filled
        const allFilled = colHours.every(col => col.every(h => h !== '' && h !== undefined));
        const status = forceComplete ? 'complete' : (allFilled ? 'complete' : 'in_progress');

        await saveTranscript({
            studentId,
            program,
            header,
            colHours,
            status,
            lastModified: new Date().toISOString(),
        });
        setSaveStatus(forceComplete ? 'force_saved' : 'saved');
        setTranscriptStatus(status);
        setTimeout(() => setSaveStatus(''), 2500);
    };

    const handleEmail = () => {
        const email = student?.email || request?.email || '';
        const subject = encodeURIComponent(`Your ${header.program} Transcript – Raphael O. Wheatley Skill Center`);
        const body = encodeURIComponent(`Dear ${header.studentName},\n\nPlease find your official transcript attached.\n\nBest regards,\nRaphael O. Wheatley Skill Center`);
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!template) return <div style={{ padding: '2rem' }}>Request not found.</div>;

    const is2Col = template.layout === '2col';
    const numCols = template.columns.length;

    return (
        <div>
            {/* Toolbar */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                {/* Status badge — pushed to the left */}
                {transcriptStatus && (
                    <div style={{
                        marginRight: 'auto',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        backgroundColor: transcriptStatus === 'complete' ? '#f0fdf4' : '#fefce8',
                        color: transcriptStatus === 'complete' ? '#15803d' : '#a16207',
                        border: `1px solid ${transcriptStatus === 'complete' ? '#bbf7d0' : '#fde68a'}`,
                    }}>
                        {transcriptStatus === 'complete' ? '✅ Completed' : '🔄 In Progress'}
                    </div>
                )}
                <button
                    className="btn btn-outline"
                    onClick={() => setEditMode(!editMode)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                    {editMode ? <><Eye size={16} /> Preview</> : <><Pencil size={16} /> Edit</>}
                </button>
                <button className="btn btn-outline" onClick={() => handleSave()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', ...(saveStatus === 'saved' ? { color: '#16a34a', borderColor: '#16a34a' } : {}) }}>
                    {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? <><Check size={16} /> Saved!</> : saveStatus === 'force_saved' ? <><Check size={16} /> Forced Complete!</> : <><Save size={16} /> Save</>}
                </button>
                <button className="btn btn-outline" onClick={() => { if (window.confirm('Override auto-detect and mark this transcript as COMPLETE?\n\nUse this for testing or special cases.')) handleSave(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7c3aed', borderColor: '#c4b5fd', fontSize: '0.85rem' }}>
                    ⚡ Force Complete
                </button>
                <button className="btn btn-outline" onClick={handleEmail} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={16} /> Email Student
                </button>{role === 'admin' && (
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate(`/admin/official/${id}`)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0d9488', borderColor: '#0d9488' }}
                    >
                        📜 Convert to Official
                    </button>
                )}
                <button className="btn btn-primary" onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Printer size={16} /> Print / PDF
                </button>
            </div>

            {/* Transcript Document */}
            <div className="transcript-paper" style={{
                backgroundColor: 'white',
                padding: '1.5rem 2rem',
                margin: '0 auto',
                maxWidth: '1100px',
                boxShadow: 'var(--shadow-lg)',
                fontFamily: '"Times New Roman", serif',
                fontSize: '0.9rem',
                lineHeight: '1.4',
            }}>

                {/* School Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                        Raphael O. Wheatley Skill Center
                    </h1>
                    <p style={{ fontSize: '1rem', fontStyle: 'italic', margin: '0 0 0.75rem', color: is2Col ? '#c00' : 'inherit' }}>
                        A Post-Secondary Technical and Career Education Institute
                    </p>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', textDecoration: 'underline', margin: 0, color: is2Col ? '#c00' : 'inherit' }}>
                        {template.title}
                    </h2>
                </div>

                {/* Student Info Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>Student: <Field editMode={editMode} value={header.studentName} onChange={v => updateHeader('studentName', v)} style={{ minWidth: '200px' }} /></div>
                    <div>Program: <Field editMode={editMode} value={header.program} onChange={v => updateHeader('program', v)} style={{ minWidth: '180px' }} /></div>
                    {!is2Col && (
                        <div>Instructor: <Field editMode={editMode} value={header.instructor} onChange={v => updateHeader('instructor', v)} style={{ minWidth: '150px' }} /></div>
                    )}
                </div>

                {/* Stats Row 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {!is2Col && (
                        <>
                            <div>Total Classroom Hours: <Field editMode={editMode} value={header.totalClassHours} onChange={v => updateHeader('totalClassHours', v)} style={{ width: '50px' }} align="center" /></div>
                            <div>Total Externship Hours: <Field editMode={editMode} value={header.totalExternshipHours} onChange={v => updateHeader('totalExternshipHours', v)} style={{ width: '50px' }} align="center" /></div>
                        </>
                    )}
                    <div>Total Program Hours: <Field editMode={editMode} value={header.totalProgramHours} onChange={v => updateHeader('totalProgramHours', v)} style={{ width: '50px' }} align="center" /></div>
                    <div>Total Hours Accumulated: <Field editMode={editMode} value={header.totalAccumulated} onChange={v => updateHeader('totalAccumulated', v)} style={{ width: '60px' }} align="center" /></div>
                    {is2Col && (
                        <div>CUE: <Field editMode={editMode} value={header.ceus} onChange={v => updateHeader('ceus', v)} style={{ width: '50px' }} align="center" /></div>
                    )}
                </div>

                {/* Stats Row 2 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {!is2Col && (
                        <div>School Year: <Field editMode={editMode} value={header.schoolYear} onChange={v => updateHeader('schoolYear', v)} style={{ width: '90px' }} /></div>
                    )}
                    <div>Start Date: <Field editMode={editMode} value={header.startDate} onChange={v => updateHeader('startDate', v)} style={{ width: '90px' }} /></div>
                    <div>End Date: <Field editMode={editMode} value={header.endDate} onChange={v => updateHeader('endDate', v)} style={{ width: '90px' }} /></div>
                    {is2Col && (
                        <div>Graduation Date: <Field editMode={editMode} value={header.graduationDate} onChange={v => updateHeader('graduationDate', v)} style={{ width: '90px' }} /></div>
                    )}
                    {!is2Col && (
                        <>
                            <div>GPA: <Field editMode={editMode} value={header.gpa} onChange={v => updateHeader('gpa', v)} style={{ width: '40px' }} align="center" /> %</div>
                            <div>CEUs: <Field editMode={editMode} value={header.ceus} onChange={v => updateHeader('ceus', v)} style={{ width: '40px' }} align="center" /></div>
                        </>
                    )}
                </div>

                {/* Instructor row for Barbering (2 instructors) */}
                {is2Col && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>Instructor: <Field editMode={editMode} value={header.instructor} onChange={v => updateHeader('instructor', v)} style={{ minWidth: '200px' }} /></div>
                        <div>Instructor: <Field editMode={editMode} value={header.instructor2} onChange={v => updateHeader('instructor2', v)} style={{ minWidth: '200px' }} /></div>
                    </div>
                )}

                {/* Topics Table — adapts to 2col or 3col layout */}
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${numCols}, 1fr)`, gap: '0px' }}>
                    {template.columns.map((col, ci) => {
                        const chOffset = template.columns
                            .slice(0, ci)
                            .reduce((sum, c) => sum + c.topics.length, 0);
                        return (
                            <TopicColumn
                                key={ci}
                                topics={col.topics}
                                hours={colHours[ci] || []}
                                onUpdate={(rowIdx, v) => updateColHourAt(ci, rowIdx, v)}
                                editMode={editMode}
                                showChNum={is2Col}
                                chOffset={chOffset}
                            />
                        );
                    })}
                </div>

                {/* Comment for Barbering layout */}
                {is2Col && (
                    <p style={{ fontSize: '0.75rem', fontStyle: 'italic', margin: '0.75rem 0 0' }}>
                        Comment: This document is not an official transcript. Students must submit a transcript request form to the registrar's office to obtain an official transcript.
                    </p>
                )}

                {/* Footer */}
                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ width: '35%' }}>
                        {!is2Col && (
                            <p style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                                This official document is not an official transcript unless stamped with the school seal and has an authorized signature.
                            </p>
                        )}
                        <div style={{ borderTop: '1px solid black', marginTop: '2.5rem', paddingTop: '0.25rem', fontSize: '0.85rem' }}>
                            Authorized Personnel, Title
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '90px', height: '90px',
                            border: '2px solid #b8860b', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto', fontSize: '0.7rem', color: '#b8860b'
                        }}>
                            SEAL
                        </div>
                    </div>

                    <div style={{ width: '35%', textAlign: 'right' }}>
                        <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            TRANSCRIPT ISSUE DATE: <Field editMode={editMode} value={header.issueDate} onChange={v => updateHeader('issueDate', v)} style={{ width: '100px' }} />
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>STUDENT IS IN GOOD STANDING</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
