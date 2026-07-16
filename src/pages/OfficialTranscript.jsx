import React, { useState, useEffect } from 'react';

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
            <span style={{ position: 'relative', display: 'inline-block', minWidth: '40px', ...style }}>
                <input
                    style={{
                        border: 'none', borderBottom: '1px solid #999',
                        background: 'transparent', fontFamily: 'inherit',
                        fontSize: 'inherit', padding: '0 2px', width: '100%',
                        boxShadow: 'none', ...style,
                    }}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
                <span className="print-text-only" style={{ display: 'none', fontWeight: 'bold', textDecoration: 'underline', ...style }}>
                    {value || '________'}
                </span>
            </span>
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
                globalIdx: start + i,
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
    const [transparentSig, setTransparentSig] = useState('');

    useEffect(() => {
        if (header.addSignature && !transparentSig) {
            const img = new Image();
            img.src = '/mario-signature.jpg';
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                try {
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i+1];
                        const b = data[i+2];
                        
                        const brightness = (r + g + b) / 3;
                        if (brightness > 200) {
                            const alpha = Math.max(0, Math.min(255, (255 - brightness) * 4.6));
                            data[i+3] = alpha;
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    setTransparentSig(canvas.toDataURL('image/png'));
                } catch (e) {
                    console.error('Failed to process signature transparency:', e);
                    setTransparentSig('/mario-signature.jpg');
                }
            };
            img.onerror = () => {
                setTransparentSig('/mario-signature.jpg');
            };
        }
    }, [header.addSignature, transparentSig]);
    const allTopics = template.columns.flatMap(col => col.topics);
    const allHoursComp = colHours.flat();
    const allGrades = grades || allTopics.map(() => '');

    let terms = [];
    if (template.useColumnsAsTerms) {
        let globalIdx = 0;
        terms = template.columns.map((col, colIdx) => {
            const termLabel = col.heading || `TERM ${colIdx + 1}`;
            const courses = col.topics.map((topic, topicIdx) => {
                const idx = globalIdx++;
                return {
                    name: topic.name,
                    grade: allGrades[idx] || '',
                    hoursReq: topic.hoursReq,
                    hoursComp: allHoursComp[idx] || '',
                    globalIdx: idx,
                };
            });
            return { label: termLabel, courses };
        });
    } else {
        terms = splitIntoTerms(allTopics, allGrades, [], allHoursComp);
    }

    // Dynamic sizing: count total rows (courses + term headers) to decide compression
    const totalRows = allTopics.length + terms.length;
    const isCompact = totalRows >= 35;
    const isSuperUltraCompact = totalRows >= 50;
    const isUltraCompact = totalRows >= 44 && totalRows < 50;
    const isHairBraiding = header.program && header.program.toLowerCase().includes('hair braiding');
    const isMedicalMassage = header.program && header.program.toLowerCase().includes('massage');
    const isNailTechnology = header.program && header.program.toLowerCase().includes('nail');
    const isHvac = header.program && (header.program.toLowerCase().includes('hvac') || header.program.toLowerCase().includes('heating'));
    const isSpacious = isHairBraiding || isMedicalMassage;
    const isMidSize = isNailTechnology || isHvac;

    const tFS = isSuperUltraCompact ? '6.8px' : isUltraCompact ? '7.5px' : isCompact ? '8px' : isSpacious ? '11.5px' : isMidSize ? '10.5px' : '10px';       
    const tCP = isSuperUltraCompact ? '0.1px 2px' : isUltraCompact ? '0.5px 2px' : isCompact ? '1px 2px' : isSpacious ? '3px 4px' : isMidSize ? '1.5px 3px' : '1px 3px'; 
    const headWidth = isSuperUltraCompact ? '80%' : '90%';                          // Use 90% header width for everyone so it fits
    const hPT = isSuperUltraCompact ? '25.6%' : '28.8%';                              // 32% relative crop (32% of 90% is 28.8%) for everyone
    const iBM = isSuperUltraCompact ? '0px 16px 2px' : isUltraCompact ? '0px 16px 4px' : isCompact ? '2px 16px 6px' : '4px 16px 8px'; // info box margin
    const fMB = isSuperUltraCompact ? '1px' : isUltraCompact ? '2px' : isCompact ? '4px' : '8px';            // footer margin bottom
    const sealSz = isSuperUltraCompact ? '65px' : isUltraCompact ? '75px' : isCompact ? '81px' : '95px';       // seal size 
    const ftrPad = isSuperUltraCompact ? '0.5px' : isUltraCompact ? '1px' : isCompact ? '2px' : '4px';         // footer disclaimer padding
    const ftrSigMT = isSuperUltraCompact ? '2px' : isUltraCompact ? '4px' : '6px';       // footer signature margin-top

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
            lineHeight: isSuperUltraCompact ? '1.1' : '1.3',
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

            {/* ═══ DOE Header (Letterhead Image Scaled) ═══ */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: isSuperUltraCompact ? '2px' : isCompact ? '4px' : '8px' }}>
                <div style={{ position: 'relative', width: headWidth, paddingTop: hPT, overflow: 'hidden' }}>
                    <img
                        src="/letterhead.jpg"
                        alt="Raphael O. Wheatley Skill Center Letterhead"
                        style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: 'auto', display: 'block' }}
                    />
                </div>
            </div>

            {/* ═══ Student Info Box ═══ */}
            <div style={{ border: border, margin: iBM, padding: isSuperUltraCompact ? '2px 6px' : (isCompact ? '4px 8px' : '6px 8px'), fontSize: isSuperUltraCompact ? '9px' : (isCompact ? '10px' : '11px') }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isSuperUltraCompact ? '1px' : (isCompact ? '2px' : '4px') }}>
                    <div>STUDENT'S NAME: <Field editMode={editMode} value={header.studentName} onChange={v => onHeaderChange('studentName', v)} /></div>
                    <div>PROGRAM OF STUDY: <Field editMode={editMode} value={header.program} onChange={v => onHeaderChange('program', v)} style={{ fontWeight: 'bold' }} /></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isSuperUltraCompact ? '0px' : (isCompact ? '1px' : '4px') }}>
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
            <div style={{ margin: isCompact ? '0 12px' : '0 16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: border, fontSize: tFS }}>
                    <thead>
                        <tr style={{ backgroundColor: '#d1fae5' }}>
                            <th style={{ border: border, padding: tCP, textAlign: 'center', width: '52%' }}>Courses</th>
                            <th style={{ border: border, padding: tCP, textAlign: 'center', width: '12%' }}>Final<br />Grade</th>
                            <th style={{ border: border, padding: tCP, textAlign: 'center', width: '12%' }}>Hours<br />Required</th>
                            <th style={{ border: border, padding: tCP, textAlign: 'center', width: '12%' }}>Hours<br />Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {terms.map((term, ti) => (
                            <React.Fragment key={ti}>
                                <tr>
                                    <td colSpan="4" style={{
                                        border: border, padding: tCP,
                                        textAlign: 'center', fontWeight: 'bold',
                                        textDecoration: 'underline', fontSize: tFS,
                                    }}>
                                        {term.label}
                                    </td>
                                </tr>
                                {term.courses.map((course, ci) => {
                                    const globalIdx = course.globalIdx !== undefined ? course.globalIdx : allTopics
                                        .findIndex(t => t.name === course.name && t.hoursReq === course.hoursReq);
                                    return (
                                        <tr key={ci}>
                                            <td style={{ border: border, padding: tCP, textAlign: 'center' }}>
                                                {course.name}
                                            </td>
                                            <td style={{ border: border, padding: tCP, textAlign: 'center' }}>
                                                {editMode ? (
                                                    <span style={{ position: 'relative', display: 'block', width: '100%' }}>
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
                                                        <span className="print-text-only" style={{ display: 'none' }}>
                                                            {allGrades[globalIdx] || ''}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span>{allGrades[globalIdx] || ''}</span>
                                                )}
                                            </td>
                                            <td style={{ border: border, padding: tCP, textAlign: 'center' }}>
                                                {course.hoursReq}
                                            </td>
                                            <td style={{ border: border, padding: tCP, textAlign: 'center' }}>
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
                marginBottom: fMB,
                padding: '0 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                fontSize: isSuperUltraCompact ? '8.5px' : '10px',
            }}>
                {/* Left — Signature */}
                <div style={{ width: '32%', border: border, padding: ftrPad, fontSize: isSuperUltraCompact ? '7px' : (isCompact ? '7.5px' : '9px'), display: 'flex', flexDirection: 'column' }}>
                    <p style={{ textAlign: 'center', margin: '0 0 2px', fontWeight: 'bold', fontSize: isSuperUltraCompact ? '7.5px' : (isCompact ? '8px' : '10px') }}>Principal</p>
                    <div style={{ position: 'relative', marginTop: isSuperUltraCompact ? '1.2rem' : '1.6rem', height: isSuperUltraCompact ? '24px' : '32px' }}>
                        {header.addSignature ? (
                            <div style={{ position: 'absolute', bottom: isSuperUltraCompact ? '-10px' : '-18px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={transparentSig || '/mario-signature.jpg'}
                                    alt="Dr. Mario Francis Signature"
                                    style={{
                                        height: isSuperUltraCompact ? '75px' : '100px',
                                        width: 'auto',
                                        mixBlendMode: 'multiply',
                                        pointerEvents: 'none',
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ position: 'absolute', bottom: '2px', width: '100%', textAlign: 'center' }}>
                                {editMode ? (
                                    <>
                                        <input
                                            style={{
                                                width: '100%',
                                                border: 'none',
                                                background: 'transparent',
                                                outline: 'none',
                                                fontFamily: '"Brush Script MT", "Comic Sans MS", cursive',
                                                fontSize: isSuperUltraCompact ? '1.10rem' : '1.35rem',
                                                padding: '0',
                                                textAlign: 'center',
                                                boxShadow: 'none',
                                            }}
                                            value={header.principalSignature !== undefined ? header.principalSignature : ''}
                                            onChange={e => onHeaderChange('principalSignature', e.target.value)}
                                        />
                                        <span className="print-text-only" style={{
                                            display: 'none',
                                            fontFamily: '"Brush Script MT", "Comic Sans MS", cursive',
                                            fontSize: isSuperUltraCompact ? '1.10rem' : '1.35rem',
                                            textAlign: 'center',
                                        }}>
                                            {header.principalSignature !== undefined ? header.principalSignature : ''}
                                        </span>
                                    </>
                                ) : (
                                    <div style={{
                                        fontFamily: '"Brush Script MT", "Comic Sans MS", cursive',
                                        fontSize: isSuperUltraCompact ? '1.10rem' : '1.35rem',
                                        textAlign: 'center',
                                        height: isSuperUltraCompact ? '1.10rem' : '1.35rem',
                                        lineHeight: '1',
                                    }}>
                                        {header.principalSignature !== undefined ? header.principalSignature : ''}
                                    </div>
                                )}
                            </div>
                        )}
                        <div style={{ borderTop: '1px solid black', position: 'absolute', bottom: '0', width: '100%' }}></div>
                    </div>
                    <div style={{ paddingTop: '2px', textAlign: 'center' }}>
                        Authorized Personnel, Title
                    </div>
                </div>

                {/* Center — School Seal */}
                <div style={{ textAlign: 'center' }}>
                    <img
                        src="/school-seal.jpg"
                        alt="School Seal"
                        style={{
                            width: sealSz, height: sealSz,
                            borderRadius: '50%', objectFit: 'cover',
                            margin: '0 auto',
                        }}
                    />
                </div>

                {/* Right — Issue Date, Hours, Graduation, Standing */}
                <div style={{ width: '36%', fontSize: isSuperUltraCompact ? '8px' : (isCompact ? '9px' : '11px') }}>
                    <div style={{ marginBottom: isSuperUltraCompact ? '2px' : (isCompact ? '2px' : '5px') }}>
                        TRANSCRIPT ISSUE DATE: <Field editMode={editMode} value={header.issueDate} onChange={v => onHeaderChange('issueDate', v)} />
                    </div>
                    <div style={{ marginBottom: isSuperUltraCompact ? '1px' : (isCompact ? '1px' : '3px') }}>
                        TOTAL HOURS COMPLETED: <Field editMode={editMode} value={header.totalAccumulated} onChange={v => onHeaderChange('totalAccumulated', v)} style={{ fontWeight: 'bold' }} />
                    </div>
                    <div style={{ marginBottom: isSuperUltraCompact ? '1px' : (isCompact ? '1px' : '3px') }}>
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
