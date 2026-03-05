import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRequestById } from '../lib/data';
import { getTemplateForProgram } from '../data/programTemplates';
import { Printer, ArrowLeft, Mail } from 'lucide-react';
import OfficialTranscript from './OfficialTranscript';

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

    useEffect(() => {
        getRequestById(id).then(req => {
            if (req) {
                setRequest(req);
                const tmpl = getTemplateForProgram(req.program);
                setTemplate(tmpl);
                const totalTopics = tmpl.columns.reduce((sum, c) => sum + c.topics.length, 0);
                setHeader(h => ({
                    ...h,
                    studentName: `${req.firstName || ''} ${req.lastName || ''}`.trim(),
                    program: tmpl.defaults.program || req.program || '',
                    totalProgramHours: tmpl.defaults.totalProgramHours || '',
                    totalAccumulated: tmpl.defaults.totalAccumulated || '',
                    ceus: tmpl.defaults.ceus || '',
                }));
                setColHours(tmpl.columns.map(col => col.topics.map(() => '')));
                setGrades(Array(totalTopics).fill(''));
            }
            setLoading(false);
        });
    }, [id]);

    const updateHeader = (field, value) => setHeader(h => ({ ...h, [field]: value }));

    const updateGrade = (idx, value) => {
        setGrades(prev => { const copy = [...prev]; copy[idx] = value; return copy; });
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
                    <button className="btn btn-outline" onClick={() => setEditMode(!editMode)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        {editMode ? 'Preview' : 'Edit'}
                    </button>
                    <button className="btn btn-primary" onClick={() => window.print()}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Printer size={16} /> Print Official
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
