import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { 
  Sparkles, Download, Clipboard, Check, Upload, 
  FileText, AlertCircle, Brain, Target, Code, Building, User
} from 'lucide-react';
import LoadingScreen from '../components/LoadingScreen';
import InteractiveCard from '../components/InteractiveCard';

const CoverGenerator = () => {
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        skills: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported.');
            return;
        }

        setFileName(file.name);
        setIsParsing(true);
        setError('');
        
        const uploadData = new FormData();
        uploadData.append('resume', file);

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${API_URL}/api/parse-pdf`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResumeText(response.data.text);
        } catch (err) {
            console.error("Upload error:", err);
            const errorMessage = err.response?.data?.error || err.message || 'Failed to parse PDF resume.';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
        } finally {
            setIsParsing(false);
        }
    };

    const generateLetter = async (e) => {
        if (e) e.preventDefault();
        setIsGenerating(true);
        setError('');
        setOutput('');
        
        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${API_URL}/api/generate-cover-letter`, {
                ...formData,
                resumeText
            });
            setOutput(response.data.letter);
        } catch (err) {
            console.error("Synthesis error:", err);
            const errorMessage = err.response?.data?.error || err.message || 'Neural synthesis failed.';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleExportPDF = () => {
        if (!output) return;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxLineWidth = pageWidth - margin * 2;
        const lineHeight = 7;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Cover Letter", margin, margin);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        
        const lines = doc.splitTextToSize(output, maxLineWidth);
        let cursorY = margin + 15;
        
        lines.forEach(line => {
            if (cursorY + lineHeight > pageHeight - margin) {
                doc.addPage();
                cursorY = margin;
            }
            doc.text(line, margin, cursorY);
            cursorY += lineHeight;
        });
        
        doc.save(`ApplyFlow_Cover_Letter_${formData.name.replace(/\s+/g, '_') || 'Output'}.pdf`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: '160px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', padding: '160px 24px 100px' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }} className="gradient-text">Neural Narrative Synthesis</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Generate high-impact professional stories tailored to your target role.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px' }} className="gen-grid">
                <InteractiveCard className={isGenerating ? "neural-pulse" : ""} style={{ padding: '40px' }}>
                    <form onSubmit={generateLetter}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label className="label-premium">Name</label>
                                <div className="input-wrapper">
                                    <div className="input-icon"><User size={18} /></div>
                                    <input 
                                        type="text" name="name" value={formData.name} onChange={handleInputChange}
                                        className="input-premium" style={{ paddingLeft: '44px' }} placeholder="Your Name"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label-premium">Target Role</label>
                                <div className="input-wrapper">
                                    <div className="input-icon"><Target size={18} /></div>
                                    <input 
                                        type="text" name="role" value={formData.role} onChange={handleInputChange}
                                        className="input-premium" style={{ paddingLeft: '44px' }} placeholder="Job Title"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="label-premium">Company</label>
                                <div className="input-wrapper">
                                    <div className="input-icon"><Building size={18} /></div>
                                    <input 
                                        type="text" name="company" value={formData.company} onChange={handleInputChange}
                                        className="input-premium" style={{ paddingLeft: '44px' }} placeholder="Target Org"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="label-premium">JD Keywords / Snippets</label>
                            <div className="input-wrapper">
                                <div className="input-icon" style={{ top: '24px' }}><Code size={18} /></div>
                                <textarea 
                                    name="skills" value={formData.skills} onChange={handleInputChange}
                                    className="input-premium" rows="4" style={{ paddingLeft: '44px', resize: 'none' }} 
                                    placeholder="Paste job description keywords here..."
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="label-premium">Resume Context (Optional PDF)</label>
                            <input type="file" id="pdf-upload" onChange={handleFileUpload} style={{ display: 'none' }} accept=".pdf" />
                            <label htmlFor="pdf-upload" style={{ 
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                                border: '1px solid var(--border-subtle)', borderRadius: '14px',
                                cursor: 'pointer', transition: 'all 0.2s ease', background: 'rgba(255,255,255,0.02)'
                            }}>
                                {isParsing ? <div className="btn-loader"></div> : <Upload size={20} color="var(--text-tertiary)" />}
                                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: '600' }}>
                                    {fileName || "Personalize via Resume"}
                                </span>
                            </label>
                        </div>

                        {error && (
                            <div style={{ color: 'var(--error)', fontSize: '0.9rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isGenerating || isParsing}>
                            {isGenerating ? <div className="btn-loader"></div> : <><Sparkles size={18} /> Synthesize Narrative</>}
                        </button>
                    </form>
                </InteractiveCard>

                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <LoadingScreen />
                            </motion.div>
                        ) : output ? (
                            <motion.div key="output" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                    <h3 className="label-premium" style={{ margin: 0 }}>Professional Narrative</h3>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-secondary" onClick={copyToClipboard} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                            {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                                            {isCopied ? 'Copied' : 'Copy'}
                                        </button>
                                        <button className="btn btn-primary" onClick={handleExportPDF} style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                                            <Download size={16} /> Export PDF
                                        </button>
                                    </div>
                                </div>
                                <InteractiveCard className="neural-pulse" style={{ padding: '40px', fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                    {output}
                                </InteractiveCard>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 40px', textAlign: 'center' }}>
                                <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '50%', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                                    <Brain size={48} color="var(--text-tertiary)" opacity={0.2} />
                                </div>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem', maxWidth: '300px' }}>
                                    Neural engine is idle. Provide context to generate your <strong>high-resonance professional identity.</strong>
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            </div>

            <style>{`
                @media (max-width: 968px) {
                    .gen-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </motion.div>
    );
};

export default CoverGenerator;
