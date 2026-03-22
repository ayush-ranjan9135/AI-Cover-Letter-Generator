import React from 'react';
import { Brain, Linkedin, Github, Globe, Instagram, Facebook, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-premium" style={{ width: '100%', padding: '80px 24px', zIndex: 10 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '60px' }}>
            <div style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <Brain size={24} color="var(--primary)" />
                    <span style={{ fontSize: '1.25rem', fontWeight: '900' }} className="gradient-text">ApplyFlow.ai</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '300px', fontSize: '0.9rem' }}>
                    Engineering the future of recruitment through high-resonance professional modeling.
                </p>
            </div>
            
            {[{ title: 'SaaS', links: ['Engine', 'API', 'Pricing'] }, { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] }].map((cat, i) => (
                <div key={i}>
                    <h4 className="label-premium" style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>{cat.title}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cat.links.map(link => (
                            <a key={link} href="#" className="footer-link">{link}</a>
                        ))}
                    </div>
                </div>
            ))}

            <div>
                <h4 className="label-premium" style={{ color: 'var(--text-primary)', marginBottom: '24px' }}>Connect</h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {[
                      { icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/ayush-ranjan-9135d3', label: 'LinkedIn' },
                      { icon: <Github size={20} />, url: 'https://github.com/ayush-ranjan9135', label: 'GitHub' },
                      { icon: <Globe size={20} />, url: 'https://alpha-portfolio-five.vercel.app', label: 'Portfolio' },
                      { icon: <Instagram size={20} />, url: 'https://instagram.com/', label: 'Instagram' },
                      { icon: <Facebook size={20} />, url: 'https://facebook.com/', label: 'Facebook' }
                    ].map((social, i) => (
                        <a 
                          key={i} 
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="social-icon-btn"
                          title={social.label}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '60px auto 0', paddingTop: '40px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.05em' }}>
            <span>© 2026 APPLYFLOW WORKSPACE</span>
            <div style={{ display: 'flex', gap: '24px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={14} className="pulse-slow" /> ENCRYPTED</span>
            </div>
        </div>
      </footer>
  );
};

export default Footer;
