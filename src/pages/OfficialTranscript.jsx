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

    // Dynamically adjust table font size and padding to ensure it fits on one page
    const totalRowsCount = allTopics.length + terms.length;
    let tableFontSize = '11px';
    let dynamicCellPad = '2px 4px';
    let termLabelFontSize = '11px';
    let headerPaddingTop = '25%';
    let infoBoxMargin = '8px 16px 16px';
    let footerBottomMargin = '20px';

    if (totalRowsCount >= 40) {
        tableFontSize = '8.5px';
        dynamicCellPad = '1px 2px';
        termLabelFontSize = '9px';
        headerPaddingTop = '21.5%';
        infoBoxMargin = '4px 16px 8px';
        footerBottomMargin = '8px';
    } else if (totalRowsCount > 30) {
        tableFontSize = '10px';
        dynamicCellPad = '1px 3px';
        termLabelFontSize = '10.5px';
        headerPaddingTop = '23%';
        infoBoxMargin = '6px 16px 10px';
        footerBottomMargin = '15px';
    }

    return (
        <div className="official-transcript-paper" style={{
            backgroundColor: 'white',
            padding: '0',
            margin: '0 auto',
            maxWidth: '100%',
            width: '8.5in',
            minHeight: '10.5in',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            fontFamily: '"Times New Roman", serif',
            fontSize: '12px',
            lineHeight: '1.3',
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

            {/* ═══ DOE Header (Letterhead Image Cropped) ═══ */}
            <div style={{ position: 'relative', width: '100%', paddingTop: headerPaddingTop, overflow: 'hidden', marginBottom: '8px' }}>
                <img
                    src="/letterhead.jpg"
                    alt="Raphael O. Wheatley Skill Center Letterhead"
                    style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            {/* ═══ Student Info Box ═══ */}
            <div style={{ border: border, margin: infoBoxMargin, padding: '4px 8px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div>STUDENT'S NAME: <Field editMode={editMode} value={header.studentName} onChange={v => onHeaderChange('studentName', v)} /></div>
                    <div>PROGRAM OF STUDY: <Field editMode={editMode} value={header.program} onChange={v => onHeaderChange('program', v)} style={{ fontWeight: 'bold' }} /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
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
            <div style={{ margin: '0 16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: border, fontSize: tableFontSize }}>
                    <thead>
                        <tr style={{ backgroundColor: '#d1fae5' }}>
                            <th style={{ border: border, padding: dynamicCellPad, textAlign: 'center', width: '52%' }}>Courses</th>
                            <th style={{ border: border, padding: dynamicCellPad, textAlign: 'center', width: '12%' }}>Final<br />Grade</th>
                            <th style={{ border: border, padding: dynamicCellPad, textAlign: 'center', width: '12%' }}>Hours<br />Required</th>
                            <th style={{ border: border, padding: dynamicCellPad, textAlign: 'center', width: '12%' }}>Hours<br />Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map((term, ti) => (
                            <React.Fragment key={ti}>
                                <tr>
                                    <td colSpan="4" style={{
                                        border: border, padding: dynamicCellPad,
                                        textAlign: 'center', fontWeight: 'bold',
                                        textDecoration: 'underline', fontSize: termLabelFontSize,
                                    }}>
                                        {term.label}
                                    </td>
                                </tr>
                                {term.courses.map((course, ci) => {
                                    const globalIdx = allTopics
                                        .findIndex(t => t.name === course.name && t.hoursReq === course.hoursReq);
                                    return (
                                        <tr key={ci}>
                                            <td style={{ border: border, padding: dynamicCellPad, textAlign: 'center' }}>
                                                {course.name}
                                            </td>
                                            <td style={{ border: border, padding: dynamicCellPad, textAlign: 'center' }}>
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
                                            <td style={{ border: border, padding: dynamicCellPad, textAlign: 'center' }}>
                                                {course.hoursReq}
                                            </td>
                                            <td style={{ border: border, padding: dynamicCellPad, textAlign: 'center' }}>
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
                marginTop: 'auto',
                marginBottom: footerBottomMargin,
                padding: '0 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: '10px',
            }}>
                {/* Left — Disclaimer + Signature */}
                <div style={{ width: '32%', border: border, padding: '8px', fontSize: '9px' }}>
                    <p style={{ fontStyle: 'italic', lineHeight: '1.3', margin: '0 0 12px' }}>
                        This document is not an official transcript unless stamped with the school seal and has an authorized signature.
                    </p>
                    <p style={{ textAlign: 'center', margin: '0 0 4px', fontWeight: 'bold', fontSize: '10px' }}>Principal</p>
                    <div style={{ borderTop: '1px solid black', marginTop: '16px', paddingTop: '4px', textAlign: 'center' }}>
                        Authorized Personnel, Title
                    </div>
                </div>

                {/* Center — School Seal */}
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="/school-seal.jpg"
                        alt="School Seal"
                        style={{
                            width: '90px', height: '90px',
                            borderRadius: '50%', objectFit: 'cover',
                            margin: '0 auto',
                        }}
                    />
                </div>

                {/* Right — Issue Date, Hours, Graduation, Standing */}
                <div style={{ width: '36%', fontSize: '11px' }}>
                    <div style={{ marginBottom: '5px' }}>
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
