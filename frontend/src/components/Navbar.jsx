import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Brain, Menu, X, Rocket, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'ATS Score', path: '/ats-score' },
    { name: 'Cover Generator', path: '/cover-generator' },
    { name: 'About', path: '/about' }
  ];

  return (
    <nav className="glass-premium" style={{ 
      position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
      width: '95%', maxWidth: '1200px', zIndex: 1000, borderRadius: '20px',
      padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain size={22} color="white" />
        </div>
        <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: '900' }}>ApplyFlow.ai</span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="nav-desktop">
        {navLinks.map(link => (
          <NavLink 
            key={link.path} 
            to={link.path}
            className={({ isActive }) => `footer-link ${isActive ? 'active-link' : ''}`}
            style={({ isActive }) => ({ 
              fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em',
              color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)'
            })}
          >
            {link.name}
          </NavLink>
        ))}
        
        <div style={{ width: '1px', height: '20px', background: 'var(--border-subtle)', margin: '0 8px' }}></div>
        
        <button onClick={toggleTheme} className="social-icon-btn" style={{ width: '36px', height: '36px' }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link to="/cover-generator" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
          <Rocket size={14} /> Get Started
        </Link>
      </div>

      {/* Mobile Toggle */}
      <div className="nav-mobile-toggle" onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mobile-menu-container"
          >
            <div className="mobile-menu-header">
               <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: '800' }}>Navigation Matrix</span>
               <div className="mobile-menu-divider"></div>
            </div>

            <div className="mobile-links-wrapper">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <NavLink 
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="link-number">0{i + 1}</span>
                    <span className="link-text">{link.name}</span>
                    <Rocket size={16} className="link-icon" />
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <div className="mobile-menu-footer">
              <div className="mobile-menu-divider" style={{ margin: '20px 0' }}></div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => { toggleTheme(); setIsOpen(false); }} 
                className="btn-theme-mobile"
              >
                {theme === 'dark' ? (
                  <><Sun size={20} /> <span>Switch to Light Protocol</span></>
                ) : (
                  <><Moon size={20} /> <span>Switch to Dark Protocol</span></>
                )}
              </motion.button>
              
              <Link to="/cover-generator" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ marginTop: '12px', width: '100%', borderRadius: '14px' }}>
                <Rocket size={18} /> Initiate Workspace
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 968px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); }
        }
        
        .mobile-menu-container {
          position: absolute;
          top: 85px;
          left: 0;
          right: 0;
          background: var(--nav-mobile-bg);
          backdrop-filter: blur(40px) saturate(180%);
          -webkit-backdrop-filter: blur(40px) saturate(180%);
          border: 1px solid var(--border-bright);
          border-radius: 24px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05);
          z-index: 1000;
        }

        .mobile-menu-header { margin-bottom: 10px; }
        .mobile-menu-divider { height: 1px; background: linear-gradient(90deg, var(--primary), transparent); margin-top: 10px; opacity: 0.3; }

        .mobile-links-wrapper { display: flex; flex-direction: column; gap: 8px; }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px 20px;
          border-radius: 14px;
          text-decoration: none;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .mobile-nav-link.active {
          background: rgba(var(--primary-h), var(--primary-s), var(--primary-l), 0.1);
          border-color: var(--border-primary);
          color: var(--text-primary);
        }

        .mobile-nav-link.active .link-icon { opacity: 1; transform: translateX(0); }
        
        .link-number { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; opacity: 0.5; color: var(--primary); }
        .link-text { font-size: 1.1rem; font-weight: 700; flex: 1; }
        .link-icon { opacity: 0; transform: translateX(-10px); transition: 0.3s; color: var(--primary); }

        .btn-theme-mobile {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
        }

        .active-link::after { width: 100% !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;
