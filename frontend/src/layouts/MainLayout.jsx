import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LiquidIntelligence from '../components/Three/LiquidIntelligence';

const MainLayout = () => {
    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // Mouse position tracking for interactive glass effects
    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            document.documentElement.style.setProperty('--mouse-x', `${x}%`);
            document.documentElement.style.setProperty('--mouse-y', `${y}%`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="app-container">
            {/* Engineering Grid Background */}
            <div className="mesh-bg"></div>
            
            {/* Interactive Neural Background */}
            <LiquidIntelligence />

            <Navbar />
            
            <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
