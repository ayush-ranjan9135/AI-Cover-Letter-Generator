import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, BarChart3, AlertCircle, Check, Shield, Brain, Lock, Cpu 
} from 'lucide-react';
import ATSGauge from '../components/ATSGauge';
import InteractiveCard from '../components/InteractiveCard';

const ATSScore = () => {
    const [resumeText, setResumeText] = useState('');
    const [fileName, setFileName] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isScoring, setIsScoring] = useState(false);
    const [atsResult, setAtsResult] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        role: '',
        skills: '',
        organization: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf') {
            setError('Only PDF files are supported for resume upload.');
            return;
        }

        setFileName(file.name);
        setError('');
        setIsParsing(true);
        setAtsResult(null);
        
        const uploadData = new FormData();
        uploadData.append('resume', file);

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${API_URL}/api/parse-pdf`, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000 
            });
            setResumeText(response.data.text);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err.response?.data?.error || 'Failed to parse PDF resume.');
        } finally {
            setIsParsing(false);
        }
    };

    const calculateATS = async (e) => {
        if (e) e.preventDefault();
        if (!resumeText || !formData.role || !formData.skills) {
            setError('Please upload a resume and fill in the target role & skills.');
            return;
        }

        setIsScoring(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || '';
            const response = await axios.post(`${API_URL}/api/ats-score`, {
                ...formData,
                resumeText
            });
            setAtsResult(response.data);
        } catch (err) {
            console.error("ATS error:", err);
            setError('Failed to calculate ATS score. Check your connection.');
        } finally {
            setIsScoring(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ paddingTop: '160px', paddingBottom: '100px', maxWidth: '1200px', margin: '0 auto', padding: '160px 24px 100px' }}
        >
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '16px' }} className="gradient-text">ATS Compatibility Audit</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Measure your professional resonance against target role requirements.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }} className="ats-grid">
                <InteractiveCard className={isScoring ? "neural-pulse" : ""} style={{ padding: '40px' }}>
                    <form onSubmit={calculateATS}>
                        <div className="form-group">
                            <label className="label-premium">Target Role</label>
                            <input 
                                type="text" name="role" value={formData.role} onChange={handleInputChange}
                                className="input-premium" placeholder="e.g. Senior Frontend Engineer"
                            />
                        </div>

                        <div className="form-group">
                            <label className="label-premium">Stack Alignment & JD Keywords</label>
                            <textarea 
                                name="skills" value={formData.skills} onChange={handleInputChange}
                                className="input-premium" rows="5" placeholder="Paste key skills or job description snippets..."
                                style={{ resize: 'none' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '32px' }}>
                            <label className="label-premium">Resume Analysis (PDF)</label>
                            <input type="file" id="resume-upload" onChange={handleFileUpload} style={{ display: 'none' }} accept=".pdf" />
                            <label htmlFor="resume-upload" style={{ 
                                display: 'flex', alignItems: 'center', gap: '16px', padding: '24px',
                                border: '2px dashed var(--border-subtle)', borderRadius: '16px',
                                cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'center',
                                justifyContent: 'center', background: 'rgba(255,255,255,0.02)'
                            }}>
                                {isParsing ? (
                                    <div className="loader-md"></div>
                                ) : fileName ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Check size={20} color="var(--success)" />
                                        <span style={{ fontWeight: '700' }}>{fileName}</span>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Upload size={20} color="var(--text-tertiary)" />
                                        <span style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Upload Professional Resume</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {error && (
                            <div style={{ color: 'var(--error)', fontSize: '0.9rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={isScoring || isParsing}>
                            {isScoring ? <div className="btn-loader"></div> : <><BarChart3 size={18} /> Audit Match</>}
                        </button>
                    </form>
                </InteractiveCard>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    <AnimatePresence mode="wait">
                        {atsResult ? (
                            <InteractiveCard 
                                key="ats-result" 
                                className="neural-pulse"
                                style={{ padding: '40px' }}
                            >
                                <p className="label-premium" style={{ textAlign: 'center', marginBottom: '32px' }}>Compatibility Matrix</p>
                                <ATSGauge score={atsResult.score} />
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
                                    <div>
                                        <h4 className="label-premium" style={{ color: 'var(--success)', fontSize: '0.75rem' }}>Critical Strengths</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                            {atsResult.strengths.map((s, i) => (
                                                <span key={i} className="glass-premium" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="label-premium" style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>Optimization Needed</h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                                            {atsResult.missingKeywords.map((k, i) => (
                                                <span key={i} className="glass-premium" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: 'var(--warning)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>{k}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </InteractiveCard>
                        ) : (
                            <motion.section 
                                className="glass-container" 
                                style={{ padding: '60px 40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                            >
                                <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '50%', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
                                    <Cpu size={32} color="var(--text-tertiary)" />
                                </div>
                                <p style={{ color: 'var(--text-tertiary)', fontSize: '0.95rem' }}>
                                    Sourcing resume data to generate <br /><strong>Predictive ATS Intelligence</strong>
                                </p>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    <div className="glass-container" style={{ padding: '32px' }}>
                        <h3 className="label-premium" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                            <Shield size={16} color="var(--primary)" /> System Integrity
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {[
                                { icon: <Brain size={16} />, title: 'Neural Engine', desc: 'Gemini 2.5 Powered reasoning' },
                                { icon: <Lock size={16} />, title: 'Zero Data Leak', desc: 'SSL Encrypted inference' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                                    <div style={{ background: 'var(--bg-card)', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', color: 'var(--primary)' }}>{item.icon}</div>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.title}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 968px) {
                    .ats-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </motion.div>
    );
};

export default ATSScore;
