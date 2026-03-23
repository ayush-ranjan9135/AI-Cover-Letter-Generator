import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, Shield, Zap, Rocket, ChevronRight } from 'lucide-react';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="page-container"
    >
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div variants={itemVariants} className="glass-premium" style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '8px', 
          padding: '8px 16px', borderRadius: '100px', marginBottom: '32px',
          border: '1px solid var(--border-primary)', background: 'hsla(var(--primary-h), 80%, 40%, 0.1)'
        }}>
          <Zap size={14} color="var(--primary)" fill="var(--primary)" />
          <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Neural Synthesis Protocol V3 Active
          </span>
        </motion.div>

        <motion.h1 variants={itemVariants} style={{ 
          fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: '900', lineHeight: '1.05', 
          marginBottom: '32px', letterSpacing: '-0.03em' 
        }}>
          Engineer your <br />
          <span className="gradient-text">Career Narrative.</span>
        </motion.h1>

        <motion.p variants={itemVariants} style={{ 
          fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', 
          margin: '0 auto 48px', lineHeight: '1.6', fontWeight: '500'
        }}>
          The premier AI workspace for elite professionals. Leverage neural intelligence 
          to align your profile with high-resonance organizational requirements.
        </motion.p>

        <motion.div variants={itemVariants} className="cta-container">
          <Link to="/cover-generator" className="btn btn-primary btn-responsive">
            <Sparkles size={20} /> Start Synthesis
          </Link>
          <Link to="/ats-score" className="btn btn-secondary btn-responsive">
            <BarChart3 size={20} /> Audit Resume
          </Link>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {[
            { icon: <Zap color="var(--primary)" />, title: 'Instant Resonance', desc: 'Synthesize professional narratives in sub-seconds with zero latency.' },
            { icon: <Shield color="var(--secondary)" />, title: 'Zero Data Leak', desc: 'Your profile data is processed through SSL-encrypted inference pods.' },
            { icon: <Rocket color="var(--accent)" />, title: 'Elite Deployment', desc: 'Direct PDF exports optimized for high-performance ATS parsing.' }
          ].map((feature, i) => (
            <motion.div 
              key={i} variants={itemVariants} 
              className="glass-container" 
              style={{ padding: '40px', borderRadius: '32px' }}
            >
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', display: 'inline-flex', marginBottom: '24px', border: '1px solid var(--border-subtle)' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '16px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <style>{`
        .page-container {
            padding-top: 160px;
            padding-bottom: 100px;
        }

        .hero-section {
            text-align: center;
            margin-bottom: 120px;
            padding: 0 24px;
        }

        .cta-container {
            display: flex;
            gap: 20px;
            justify-content: center;
        }

        .btn-responsive {
            padding: 18px 40px;
            font-size: 1rem;
        }

        @media (max-width: 768px) {
            .page-container { padding-top: 120px; }
            .hero-section { margin-bottom: 80px; }
            .cta-container { flex-direction: column; align-items: center; gap: 16px; }
            .btn-responsive { width: 100%; max-width: 320px; }
        }

        @media (max-width: 480px) {
            .page-container { padding-top: 100px; }
            .hero-section { margin-bottom: 60px; }
        }
      `}</style>
    </motion.div>
  );
};

export default Home;
