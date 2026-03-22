import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = "Neural Synthesis" }) => {
  return (
    <div style={{ 
        height: '400px', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', justifyContent: 'center', gap: '32px' 
    }}>
        <div className="circular-progress"></div>
        <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }} className="gradient-text">
                {message}
            </h3>
            <p className="dot-pulse" style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                Modeling Professional Identity
            </p>
        </div>
    </div>
  );
};

export default LoadingScreen;
