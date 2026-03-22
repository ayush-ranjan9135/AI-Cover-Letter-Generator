import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Shield, Globe, Users, Zap } from 'lucide-react';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ paddingTop: '160px', paddingBottom: '100px', maxWidth: '1000px', margin: '0 auto', padding: '160px 24px 100px' }}
    >
      <section style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '24px' }} className="gradient-text">Mission Control</h2>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto' }}>
          ApplyFlow.ai is engineered for the high-end professional. We bridge the gap between 
          human talent and algorithmic recruitment filters through neutral modeling and narrative synthesis.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '80px' }}>
        {[
          { icon: <Brain />, title: 'Inference Engine', desc: 'Powered by Gemini 2.5 for deep semantic understanding of professional narratives.' },
          { icon: <Cpu />, title: 'Architecture', desc: 'Distributed React-Vite frontend with a high-performance Express-Node backend.' },
          { icon: <Shield />, title: 'Security Protocol', desc: 'Enterprise-grade SSL encryption for all neural data processing pods.' },
          { icon: <Globe />, title: 'Presence', desc: 'Deploying professional identities across the global recruitment landscape.' },
          { icon: <Users />, title: 'Philosophy', desc: 'Human-centric AI designed to amplify professional agency, not replace it.' },
          { icon: <Zap />, title: 'Performance', desc: 'Low-latency synthesis pipelines ensuring real-time professional modeling.' }
        ].map((item, i) => (
          <motion.div 
            key={i} initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
            className="glass-container" style={{ padding: '32px', borderRadius: '24px' }}
          >
            <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>{item.icon}</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '12px' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className="glass-premium" style={{ padding: '60px', borderRadius: '40px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '24px' }}>The ApplyFlow Vision</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
          We believe that every professional deserves a resume that resonates. 
          By combining cutting-edge AI with elite design standards, we empower 
          you to stand out in the most competitive engineering and leadership ecosystems.
        </p>
      </section>
    </motion.div>
  );
};

export default About;
