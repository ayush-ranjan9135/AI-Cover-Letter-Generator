import React from 'react';
import { motion } from 'framer-motion';

const ATSGauge = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
          <filter id="gaugeShadow">
             <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="var(--primary-glow)" />
          </filter>
        </defs>
        <circle cx="80" cy="80" r={radius} fill="transparent" stroke="var(--border-subtle)" strokeWidth="12" />
        <motion.circle 
          cx="80" cy="80" r={radius} fill="transparent" 
          stroke="url(#gaugeGradient)" strokeWidth="12" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: 'url(#gaugeShadow)' }}
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <motion.span 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', display: 'block', lineHeight: 1 }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Precision</span>
      </div>
    </div>
  );
};

export default ATSGauge;
