import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById, getTranscriptByStudentId, saveTranscript, getTranscriptById, updateRequest } from '../lib/data';
import { getTemplateForProgram } from '../data/programTemplates';
import { Printer, ArrowLeft, Save, Check, Download } from 'lucide-react';
import OfficialTranscript from './OfficialTranscript';

const loadHtml2Pdf = () => {
    return new Promise((resolve, reject) => {
        if (window.html2pdf) {
            resolve(window.html2pdf);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve(window.html2pdf);
        script.onerror = (err) => reject(err);
        document.body.appendChild(script);
    });
};

export default function OfficialTranscriptPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(true);

    const [header, setHeader] = useState({
        studentName: '', program: '', instructor: '',
        totalProgramHours: '', totalAccumulated: '',
        gpa: '', ceus: '', issueDate: '', graduationDate: '',
        degree: '', completedProgram: 'X',
    });

    const [colHours, setColHours] = useState([]);
    const [grades, setGrades] = useState([]);

    const [saveStatus, setSaveStatus] = useState('');
    const [downloading, setDownloading] = useState(false);

    const handlePrint = () => {
        const prevEdit = editMode;
        setEditMode(false);
        setTimeout(() => {
            window.print();
            setEditMode(prevEdit);
        }, 100);
    };

    const handleDownload = async () => {
        setDownloading(true);
        const prevEdit = editMode;
        setEditMode(false);

        setTimeout(async () => {
            try {
                const html2pdf = await loadHtml2Pdf();
                const element = document.querySelector('.official-transcript-paper');
                const opt = {
                    margin: 0.15,
                    filename: `${header.studentName || 'Student'}_Official_Transcript.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, logging: false },
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                };
                await html2pdf().set(opt).from(element).save();
            } catch (err) {
                console.error(err);
                alert('Could not download PDF. Please try printing as PDF instead.');
            } finally {
                setEditMode(prevEdit);
                setDownloading(false);
            }
        }, 150);
    };

    useEffect(() => {
        getRequestById(id).then(async req => {
            if (req) {
                setRequest(req);
                const tmpl = getTemplateForProgram(req.program);
                setTemplate(tmpl);
                const totalTopics = tmpl.columns.reduce((sum, c) => sum + c.topics.length, 0);

                let existing = null;
                if (req.transcriptId) {
                    existing = await getTranscriptById(req.transcriptId);
                }
                if (!existing && req.enrolledStudentId) {
                    existing = await getTranscriptByStudentId(req.enrolledStudentId);
                }
                if (!existing && req.studentId) {
                    existing = await getTranscriptByStudentId(req.studentId);
                }
                if (!existing && req.id) {
                    existing = await getTranscriptByStudentId(req.id);
                }

                setHeader(h => ({
                    ...h,
                    studentName: existing?.header?.studentName || `${req.firstName || ''} ${req.lastName || ''}`.trim(),
                    program: existing?.header?.program || tmpl.defaults.program || req.program || '',
                    totalProgramHours: existing?.header?.totalProgramHours || tmpl.defaults.totalProgramHours || '',
                    totalAccumulated: existing?.header?.totalAccumulated || tmpl.defaults.totalAccumulated || '',
                    ceus: existing?.header?.ceus || tmpl.defaults.ceus || '',
                    ...(existing?.header || {}),
                    principalSignature: existing?.header?.principalSignature || '',
                }));

                if (existing?.colHours) setColHours(existing.colHours);
                else setColHours(tmpl.columns.map(col => col.topics.map(() => '')));

                if (existing?.grades) setGrades(existing.grades);
                else setGrades(Array(totalTopics).fill(''));
            }
            setLoading(false);
        });
    }, [id]);

    const updateHeader = (field, value) => setHeader(h => ({ ...h, [field]: value }));

    const updateGrade = (idx, value) => {
        setGrades(prev => { const copy = [...prev]; copy[idx] = value; return copy; });
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        const studentId = request.enrolledStudentId || request.studentId || request.studentInfo?.id || request.id;
        const savedT = await saveTranscript({
            studentId,
            program: request.program,
            header,
            colHours,
            grades,
            status: 'complete',
            lastModified: new Date().toISOString(),
        });

        if (request) {
            await updateRequest(request.id, { transcriptId: savedT.id });
            setRequest(prev => ({ ...prev, transcriptId: savedT.id }));
        }

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2500);
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!template) return <div style={{ padding: '2rem' }}>Request not found.</div>;

    return (
        <div>
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <button className="btn btn-outline" onClick={() => navigate(-1)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ArrowLeft size={16} /> Back to Unofficial
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-outline" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', ...(saveStatus === 'saved' ? { color: '#16a34a', borderColor: '#16a34a' } : {}) }}>
                        {saveStatus === 'saving' ? '⏳ Saving...' : saveStatus === 'saved' ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save</>}
                    </button>
                    <button className="btn btn-outline" onClick={() => setEditMode(!editMode)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {editMode ? 'Preview' : 'Edit'}
                    </button>
                    <button className="btn btn-primary" onClick={handlePrint}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Printer size={16} /> Print Official
                    </button>
                    <button className="btn btn-primary" onClick={handleDownload} disabled={downloading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#0f766e', borderColor: '#0f766e' }}>
                        <Download size={16} /> {downloading ? 'Downloading...' : 'Download PDF'}
                    </button>
                </div>
            </div>

            <OfficialTranscript
                header={header}
                template={template}
                colHours={colHours}
                grades={grades}
                onGradeChange={updateGrade}
                onHeaderChange={updateHeader}
                editMode={editMode}
            />
        </div>
    );
}
