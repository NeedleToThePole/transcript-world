import React from 'react';

/**
 * OfficialTranscript — DOE-branded official transcript layout.
 *
 * Designed to fit on a SINGLE printed page (letter-size, portrait).
 * All sizing uses compact values so the content does not overflow.
 */

const border = '1px solid #222';
const cellPad = '2px 4px';

function Field({ value, onChange, style = {}, editMode }) {
    if (editMode) {
        return (
            <input
                style={{
                    border: 'none', borderBottom: '1px solid #999',
                    background: 'transparent', fontFamily: 'inherit',
                    fontSize: 'inherit', padding: '0 2px', minWidth: '40px',
                    boxShadow: 'none', ...style,
                }}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        );
    }
    return <span style={{ fontWeight: 'bold', textDecoration: 'underline', ...style }}>{value || '________'}</span>;
}

/**
 * Auto-split a flat list of courses into terms.
 */
function splitIntoTerms(allTopics, allGrades, allHoursReq, allHoursComp) {
    const total = allTopics.length;
    if (total === 0) return [];

    const numTerms = Math.min(4, Math.max(1, Math.ceil(total / 5)));
    const perTerm = Math.ceil(total / numTerms);
    const terms = [];

    for (let t = 0; t < numTerms; t++) {
        const start = t * perTerm;
        const end = Math.min(start + perTerm, total);
        const termLabel = ['TERM I', 'TERM II', 'TERM III', 'TERM IV'][t] || `TERM ${t + 1}`;
        terms.push({
            label: termLabel,
            courses: allTopics.slice(start, end).map((topic, i) => ({
                name: topic.name,
                grade: allGrades[start + i] || '',
                hoursReq: topic.hoursReq,
                hoursComp: allHoursComp[start + i] || '',
            })),
        });
    }
    return terms;
}

export default function OfficialTranscript({
    header,
    template,
    colHours,
    grades,
    onGradeChange,
    onHeaderChange,
    editMode,
}) {
    const allTopics = template.columns.flatMap(col => col.topics);
    const allHoursComp = colHours.flat();
    const allGrades = grades || allTopics.map(() => '');

    const terms = splitIntoTerms(allTopics, allGrades, [], allHoursComp);

    return (
        <div className="official-transcript-paper" style={{
            backgroundColor: 'white',
            padding: '0',
            margin: '0 auto',
            maxWidth: '800px',
            boxShadow: 'var(--shadow-lg)',
            fontFamily: '"Times New Roman", serif',
            fontSize: '10px',
            lineHeight: '1.2',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* ═══ Watermark ═══ */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-35deg)',
                fontSize: '80px',
                fontWeight: 'bold',
                fontStyle: 'italic',
                color: 'rgba(0, 0, 0, 0.10)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 1,
                letterSpacing: '10px',
                fontFamily: '"Times New Roman", serif',
            }}>
                Official Transcript
            </div>

            {/* ═══ DOE Header ═══ */}
            <div style={{
                textAlign: 'center',
                padding: '8px 12px 6px',
                borderBottom: '2px solid #0891b2',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Left logo — VI Department of Education */}
                    <img
                        src="/vi-doe-logo.png"
                        alt="VI Department of Education"
                        style={{
                            width: '55px', height: '55px',
                            borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                        }}
                    />

                    <div style={{ flex: 1, padding: '0 8px' }}>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.5px', margin: '0 0 1px' }}>
                            THE VIRGIN ISLANDS DEPARTMENT OF
                        </p>
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 2px', letterSpacing: '2px' }}>
                            EDUCATION
                        </h1>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', margin: '0' }}>RAPHAEL O. WHEATLEY SKILL CENTER</p>
                        <p style={{ fontSize: '8px', fontStyle: 'italic', margin: '1px 0' }}>
                            A Post-Secondary Career and Technical Education Institute
                        </p>
                        <p style={{ fontSize: '7.5px', fontWeight: 'bold', margin: '1px 0' }}>
                            Dr. Mario Francis: Principal
                        </p>
                        <p style={{ fontSize: '7px', color: '#555', margin: '0' }}>
                            P.O. Box 9337, St. Thomas, VI 00801 &nbsp;|&nbsp; Tel: (340) 774-6277 &nbsp;|&nbsp; mario.francis@vide.vi
                        </p>
                    </div>

                    {/* Right seal — School Seal */}
                    <img
                        src="/school-seal.jpg"
                        alt="Raphael O. Wheatley Skill Center Seal"
                        style={{
                            width: '55px', height: '55px',
                            borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
                        }}
                    />
                </div>
            </div>

            {/* ═══ Student Info Box ═══ */}
            <div style={{ border: border, margin: '6px 12px 5px', padding: '4px 6px', fontSize: '9.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div>STUDENT'S NAME: <Field editMode={editMode} value={header.studentName} onChange={v => onHeaderChange('studentName', v)} /></div>
                    <div>PROGRAM OF STUDY: <Field editMode={editMode} value={header.program} onChange={v => onHeaderChange('program', v)} style={{ fontWeight: 'bold' }} /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div>INSTRUCTOR: <Field editMode={editMode} value={header.instructor} onChange={v => onHeaderChange('instructor', v)} style={{ fontWeight: 'bold' }} /></div>
                    <div>COMPLETED PROGRAM: &nbsp;
                        <Field editMode={editMode} value={header.completedProgram || 'X'} onChange={v => onHeaderChange('completedProgram', v)} style={{ width: '14px', textAlign: 'center' }} /> YES &nbsp;&nbsp;
                        __ NO
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>DEGREE: <Field editMode={editMode} value={header.degree || ''} onChange={v => onHeaderChange('degree', v)} style={{ fontWeight: 'bold' }} /></div>
                    <div>GPA: <Field editMode={editMode} value={header.gpa} onChange={v => onHeaderChange('gpa', v)} style={{ fontWeight: 'bold', width: '35px' }} /></div>
                    <div>CEU: <Field editMode={editMode} value={header.ceus} onChange={v => onHeaderChange('ceus', v)} style={{ fontWeight: 'bold', width: '35px' }} /></div>
                </div>
            </div>

            {/* ═══ Course Table ═══ */}
            <div style={{ margin: '0 12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: border, fontSize: '9px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#d1fae5' }}>
                            <th style={{ border: border, padding: cellPad, textAlign: 'center', width: '52%' }}>Courses</th>
                            <th style={{ border: border, padding: cellPad, textAlign: 'center', width: '12%' }}>Final<br />Grade</th>
                            <th style={{ border: border, padding: cellPad, textAlign: 'center', width: '12%' }}>Hours<br />Required</th>
                            <th style={{ border: border, padding: cellPad, textAlign: 'center', width: '12%' }}>Hours<br />Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map((term, ti) => (
                            <React.Fragment key={ti}>
                                <tr>
                                    <td colSpan="4" style={{
                                        border: border, padding: cellPad,
                                        textAlign: 'center', fontWeight: 'bold',
                                        textDecoration: 'underline', fontSize: '9px',
                                    }}>
                                        {term.label}
                                    </td>
                                </tr>
                                {term.courses.map((course, ci) => {
                                    const globalIdx = allTopics
                                        .findIndex(t => t.name === course.name && t.hoursReq === course.hoursReq);
                                    return (
                                        <tr key={ci}>
                                            <td style={{ border: border, padding: cellPad, textAlign: 'center' }}>
                                                {course.name}
                                            </td>
                                            <td style={{ border: border, padding: cellPad, textAlign: 'center' }}>
                                                {editMode ? (
                                                    <input
                                                        style={{
                                                            border: 'none', borderBottom: '1px solid #ccc',
                                                            background: 'transparent', width: '100%',
                                                            textAlign: 'center', fontFamily: 'inherit',
                                                            fontSize: 'inherit', boxShadow: 'none',
                                                        }}
                                                        value={allGrades[globalIdx] || ''}
                                                        onChange={e => onGradeChange(globalIdx, e.target.value)}
                                                        placeholder="—"
                                                    />
                                                ) : (
                                                    <span>{allGrades[globalIdx] || ''}</span>
                                                )}
                                            </td>
                                            <td style={{ border: border, padding: cellPad, textAlign: 'center' }}>
                                                {course.hoursReq}
                                            </td>
                                            <td style={{ border: border, padding: cellPad, textAlign: 'center' }}>
                                                {course.hoursComp || ''}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ═══ Footer ═══ */}
            <div style={{
                margin: '6px 12px 8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: '8.5px',
            }}>
                {/* Left — Disclaimer + Signature */}
                <div style={{ width: '32%', border: border, padding: '5px', fontSize: '7.5px' }}>
                    <p style={{ fontStyle: 'italic', lineHeight: '1.2', margin: '0 0 8px' }}>
                        This document is not an official transcript unless stamped with the school seal and has an authorized signature.
                    </p>
                    <p style={{ textAlign: 'center', margin: '0 0 2px', fontWeight: 'bold', fontSize: '8px' }}>Principal</p>
                    <div style={{ borderTop: '1px solid black', marginTop: '12px', paddingTop: '2px', textAlign: 'center' }}>
                        Authorized Personnel, Title
                    </div>
                </div>

                {/* Center — School Seal */}
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="/school-seal.jpg"
                        alt="School Seal"
                        style={{
                            width: '60px', height: '60px',
                            borderRadius: '50%', objectFit: 'cover',
                            margin: '0 auto',
                        }}
                    />
                </div>

                {/* Right — Issue Date, Hours, Graduation, Standing */}
                <div style={{ width: '35%', fontSize: '9px' }}>
                    <div style={{ marginBottom: '3px' }}>
                        TRANSCRIPT ISSUE DATE: <Field editMode={editMode} value={header.issueDate} onChange={v => onHeaderChange('issueDate', v)} />
                    </div>
                    <div style={{ marginBottom: '3px' }}>
                        TOTAL HOURS COMPLETED: <Field editMode={editMode} value={header.totalAccumulated} onChange={v => onHeaderChange('totalAccumulated', v)} style={{ fontWeight: 'bold' }} />
                    </div>
                    <div style={{ marginBottom: '3px' }}>
                        GRADUATION DATE: <Field editMode={editMode} value={header.graduationDate || ''} onChange={v => onHeaderChange('graduationDate', v)} style={{ fontWeight: 'bold' }} />
                    </div>
                    <div>
                        STUDENT IS IN GOOD STANDING: &nbsp;
                        <strong>X</strong> YES &nbsp;&nbsp; __ NO
                    </div>
                </div>
            </div>

        </div>
    );
}
