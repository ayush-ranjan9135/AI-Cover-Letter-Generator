import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Brain, Menu, X, Rocket, Sun, Moon } from 'lucide-react';
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="glass-premium" style={{ 
          position: 'absolute', top: '80px', left: 0, right: 0, 
          padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' 
        }}>
          {navLinks.map(link => (
            <NavLink 
              key={link.path} 
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `footer-link ${isActive ? 'active-link' : ''}`}
              style={{ fontSize: '1.1rem', fontWeight: '700' }}
            >
              {link.name}
            </NavLink>
          ))}
          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '10px 0' }}></div>
          <button onClick={() => { toggleTheme(); setIsOpen(false); }} className="btn btn-secondary" style={{ justifyContent: 'center' }}>
            {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 968px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
        .active-link::after { width: 100% !important; }
      `}</style>
    </nav>
  );
};

export default Navbar;
