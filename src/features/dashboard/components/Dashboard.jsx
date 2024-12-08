import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate, Outlet } from "react-router-dom";
import { ExplosionEffect, PulsingGridOverlay } from '../../../shared/components';
import CyberpunkGrid from '../../../shared/components/CyberpunkGrid';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { CyberpunkEKGLoader } from '../../../shared/components/ui';
import { createRoot } from 'react-dom/client';

const Dashboard = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('dashboardSidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showExplosion, setShowExplosion] = useState(false);
  const [activeSection, setActiveSection] = useState(() => {
    const saved = localStorage.getItem('dashboardActiveSection');
    return saved || "overview";
  });
  const [glitchingTab, setGlitchingTab] = useState(null);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('dashboardSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Save active section
  useEffect(() => {
    localStorage.setItem('dashboardActiveSection', activeSection);
  }, [activeSection]);

  const handleSignOut = useCallback(() => {
    setShowExplosion(true);
    setTimeout(() => {
      localStorage.removeItem("rememberedCredentials");
      localStorage.removeItem("dashboardActiveSection");
      localStorage.removeItem('dashboardVideoShown');
      signOut()
        .then(() => {
          // Show loading screen for 3 seconds after explosion
          const loadingScreen = document.createElement('div');
          loadingScreen.id = 'signout-loading';
          loadingScreen.style.position = 'fixed';
          loadingScreen.style.inset = '0';
          loadingScreen.style.zIndex = '100';
          document.body.appendChild(loadingScreen);
          
          const root = createRoot(loadingScreen);
          root.render(<CyberpunkEKGLoader />);
          
          setTimeout(() => {
            root.unmount();
            loadingScreen.remove();
            navigate("/");
          }, 3000);
        })
        .catch((error) => console.error("Error signing out:", error));
    }, 2550);
  }, [signOut, navigate]);

  const handleNavigation = useCallback((section) => {
    if (section === activeSection) return;

    // Immediately navigate and update state
    navigate(`/dashboard/${section}`);
    setActiveSection(section);
    
    // Apply glitch effect after navigation (30% chance)
    if (Math.random() < 0.3) {
      requestAnimationFrame(() => {
        setGlitchingTab(section);
        setTimeout(() => setGlitchingTab(null), 300);
      });
    }
  }, [navigate, activeSection]);

  const handleMenuClick = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0F1B] overflow-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <CyberpunkGrid />
        <PulsingGridOverlay />
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={isSidebarOpen}
          activeSection={activeSection}
          glitchingTab={glitchingTab}
          onNavigate={handleNavigation}
        />

        {/* Main Content */}
        <div className="relative pt-32">
          <div className="px-6 mx-auto max-w-7xl flex items-center justify-center min-h-[calc(100vh-208px)]">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Top Layer - Navbar */}
      <div className="relative z-40">
        <DashboardNavbar 
          onMenuClick={handleMenuClick}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Effects Layer */}
      {showExplosion && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ExplosionEffect 
            onComplete={() => {
              setShowExplosion(false);
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;