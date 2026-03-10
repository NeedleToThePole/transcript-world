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

function TopicColumn({ topics, hours, dates, onUpdate, onUpdateDate, editMode, showChNum, chOffset, layout }) {
    return (
        <table style={{ borderCollapse: 'collapse', border: '1px solid black', fontSize: '0.8rem', width: '100%' }}>
            <thead>
                <tr>
                    {showChNum && <th style={{ ...cellStyle, width: '45px', fontWeight: 'bold' }}>{layout === 'stacked' ? 'Theory' : 'CH #'}</th>}
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
                        {showChNum && <td style={cellStyle}>
                            {editMode ? (
                                <input
                                    style={{ ...inputStyle, width: '50px', textAlign: 'center' }}
                                    value={dates?.[i] || ''}
                                    onChange={e => onUpdateDate?.(i, e.target.value)}
                                    placeholder="MM/DD"
                                />
                            ) : (
                                <span style={{ display: 'block', textAlign: 'center' }}>{dates?.[i] || ''}</span>
                            )}
                        </td>}
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

    // Editable "date" per column
    const [colDates, setColDates] = useState([]);

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
                    if (existing?.colDates) {
                        setColDates(existing.colDates);
                    } else {
                        setColDates(tmpl.columns.map(col => col.topics.map(() => '')));
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
                    if (existing?.colDates) {
                        setColDates(existing.colDates);
                    } else {
                        setColDates(tmpl.columns.map(col => col.topics.map(() => '')));
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

    const updateColDateAt = (colIdx, rowIdx, value) => {
        setColDates(prev => {
            const copy = prev.map(arr => [...arr]);
            copy[colIdx][rowIdx] = value;
            return copy;
        });
    };

    // Auto-calculate totals for specific programs (Barbering)
    useEffect(() => {
        if (!header.program || !colHours || colHours.length === 0) return;

        // Opt-in list of programs for auto-calculation
        const autoCalcPrograms = ['Barbering'];

        if (autoCalcPrograms.includes(header.program)) {
            // Calculate total accumulated hours
            let total = 0;
            for (const col of colHours) {
                for (const hrs of col) {
                    const parsed = parseFloat(hrs);
                    if (!isNaN(parsed)) {
                        total += parsed;
                    }
                }
            }

            // Calculate CEUs (10 hours = 1 CEU)
            const ceus = (total / 10).toFixed(1);

            // Update header state if values have changed to prevent infinite loops
            setHeader(prev => {
                if (prev.totalAccumulated === String(total) && prev.ceus === String(ceus)) {
                    return prev;
                }
                return {
                    ...prev,
                    totalAccumulated: String(total),
                    ceus: String(ceus)
                };
            });
        }
    }, [colHours, header.program]); // Depend on colHours changing

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
            colDates,
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
                minHeight: template.layout === 'stacked' ? '10.5in' : 'auto',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-lg)',
                fontFamily: '"Times New Roman", serif',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* ═══ Unofficial Watermark ═══ */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-35deg)',
                    fontSize: '80px',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    color: 'rgba(0, 0, 0, 0.08)',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 1,
                    letterSpacing: '10px',
                    fontFamily: '"Times New Roman", serif',
                }}>
                    Unofficial Transcript
                </div>

                {/* School Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
                        Raphael O. Wheatley Skill Center
                    </h1>
                    <p style={{ fontSize: '1rem', fontStyle: template.layout === 'stacked' ? 'normal' : 'italic', margin: '0 0 0.75rem', color: (is2Col && template.layout !== 'stacked') ? '#c00' : 'inherit' }}>
                        A Post-Secondary Technical and Career Education Institute
                    </p>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', textDecoration: 'underline', fontStyle: template.layout === 'stacked' ? 'italic' : 'normal', margin: 0, color: (is2Col || template.layout === 'stacked') ? '#c00' : 'inherit' }}>
                        {template.title}
                    </h2>
                </div>

                {/* Header Information rows based on layout  */}
                {template.layout === 'stacked' ? (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <div>Students' Name: <Field editMode={editMode} value={header.studentName} onChange={v => updateHeader('studentName', v)} style={{ minWidth: '200px' }} /></div>
                            <div style={{ width: '250px' }}>Student's ID: <Field editMode={editMode} value={header.studentId || ''} onChange={v => updateHeader('studentId', v)} style={{ minWidth: '150px' }} /></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                            <div>Start Date: <Field editMode={editMode} value={header.startDate} onChange={v => updateHeader('startDate', v)} style={{ width: '120px' }} /></div>
                            <div style={{ width: '250px' }}>Graduation Date: <Field editMode={editMode} value={header.graduationDate} onChange={v => updateHeader('graduationDate', v)} style={{ width: '120px' }} /></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ flex: 1 }}>Total Program Hours: {header.totalProgramHours}</div>
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <div>Total Hours Accumulated: <Field editMode={editMode} value={header.totalAccumulated} onChange={v => updateHeader('totalAccumulated', v)} style={{ width: '60px' }} align="center" /></div>
                                <div>CUE: <Field editMode={editMode} value={header.ceus} onChange={v => updateHeader('ceus', v)} style={{ width: '40px' }} align="center" /></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}

                {/* Topics Table — adapts to 2col, 3col, or stacked layout */}
                <div style={{ display: 'grid', gridTemplateColumns: template.layout === 'stacked' ? '1fr' : `repeat(${numCols}, 1fr)`, gap: template.layout === 'stacked' ? '1rem' : '0px' }}>
                    {template.columns.map((col, ci) => {
                        const chOffset = template.columns
                            .slice(0, ci)
                            .reduce((sum, c) => sum + c.topics.length, 0);
                        return (
                            <div key={ci}>
                                {col.heading && <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px' }}>{col.heading}</div>}
                                <TopicColumn
                                    topics={col.topics}
                                    hours={colHours[ci] || []}
                                    dates={colDates[ci] || []}
                                    onUpdate={(rowIdx, v) => updateColHourAt(ci, rowIdx, v)}
                                    onUpdateDate={(rowIdx, v) => updateColDateAt(ci, rowIdx, v)}
                                    editMode={editMode}
                                    showChNum={is2Col || template.layout === 'stacked'}
                                    chOffset={template.layout === 'stacked' ? 0 : chOffset}
                                    layout={template.layout}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Comment for Barbering layout */}
                {(is2Col && template.layout !== 'stacked') && (
                    <p style={{ fontSize: '0.75rem', fontStyle: 'italic', margin: '0.75rem 0 0' }}>
                        Comment: This document is not an official transcript. Students must submit a transcript request form to the registrar's office to obtain an official transcript.
                    </p>
                )}

                {/* Footer */}
                <div style={{ marginTop: 'auto', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ width: '45%' }}>
                        {(!is2Col || template.layout === 'stacked') && (
                            <p style={{ fontSize: '0.75rem', lineHeight: '1.3', marginBottom: '1rem', fontStyle: 'italic' }}>
                                This official document is not an official transcript unless stamped with the school seal and has an authorized signature.
                            </p>
                        )}
                        {template.signatures ? (
                            <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                                {template.signatures.map((sig, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-end', gap: '1rem' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <div style={{ position: 'absolute', bottom: '1.5rem', width: '100%' }}>
                                                {editMode ? (
                                                    <input
                                                        style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: '"Brush Script MT", "Comic Sans MS", cursive', fontSize: '1.4rem', padding: '0 0.25rem' }}
                                                        value={header[`signature_${i}`] || ''}
                                                        onChange={e => updateHeader(`signature_${i}`, e.target.value)}
                                                    />
                                                ) : (
                                                    <div style={{ fontFamily: '"Brush Script MT", "Comic Sans MS", cursive', fontSize: '1.4rem', padding: '0 0.25rem', height: '1.4rem' }}>{header[`signature_${i}`] || ''}</div>
                                                )}
                                            </div>
                                            <div style={{ borderBottom: '1px solid black', height: '1.5rem' }}></div>
                                            <div style={{ paddingTop: '2px', fontSize: '0.8rem' }}>{sig}</div>
                                        </div>
                                        <div style={{ width: '150px' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                                                <span style={{ marginRight: '5px', fontSize: '0.8rem' }}>Date:</span>
                                                <div style={{ position: 'absolute', bottom: '2px', left: '35px', width: 'calc(100% - 35px)' }}>
                                                    {editMode ? (
                                                        <input
                                                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.9rem', padding: '0 0.25rem' }}
                                                            value={header[`sigDate_${i}`] || ''}
                                                            onChange={e => updateHeader(`sigDate_${i}`, e.target.value)}
                                                            placeholder="MM/DD/YYYY"
                                                        />
                                                    ) : (
                                                        <div style={{ fontSize: '0.9rem', padding: '0 0.25rem', height: '1.1rem' }}>{header[`sigDate_${i}`] || ''}</div>
                                                    )}
                                                </div>
                                                <div style={{ borderBottom: '1px solid black', height: '1.5rem', flex: 1 }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ position: 'relative', marginTop: '3.5rem' }}>
                                <div style={{ position: 'absolute', bottom: '1.5rem', width: '100%' }}>
                                    {editMode ? (
                                        <input
                                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: '"Brush Script MT", "Comic Sans MS", cursive', fontSize: '1.4rem', padding: '0 0.25rem' }}
                                            value={header[`signature_0`] || ''}
                                            onChange={e => updateHeader(`signature_0`, e.target.value)}
                                        />
                                    ) : (
                                        <div style={{ fontFamily: '"Brush Script MT", "Comic Sans MS", cursive', fontSize: '1.4rem', padding: '0 0.25rem', height: '1.4rem' }}>{header[`signature_0`] || ''}</div>
                                    )}
                                </div>
                                <div style={{ borderBottom: '1px solid black', height: '1.5rem' }}></div>
                                <div style={{ paddingTop: '2px', fontSize: '0.85rem' }}>Authorized Personnel, Title</div>
                            </div>
                        )}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '180px', height: '180px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto'
                        }}>
                            <img src="/school-seal.jpg" alt="Raphael O Wheatley Seal" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    </div>

                    <div style={{ width: '35%', textAlign: 'right' }}>
                        {template.hideRightFooter !== true && (
                            <>
                                <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                    TRANSCRIPT ISSUE DATE: <Field editMode={editMode} value={header.issueDate} onChange={v => updateHeader('issueDate', v)} style={{ width: '100px' }} />
                                </div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>STUDENT IS IN GOOD STANDING</div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
