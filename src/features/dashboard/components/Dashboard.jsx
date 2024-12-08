import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate, Outlet } from "react-router-dom";
import { ExplosionEffect, PulsingGridOverlay } from '../../../shared/components';
import CyberpunkGrid from '../../../shared/components/CyberpunkGrid';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';

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

  useEffect(() => {
    localStorage.setItem('dashboardSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

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
        .then(() => navigate("/"))
        .catch((error) => console.error("Error signing out:", error));
    }, 2550);
  }, [signOut, navigate]);

  const handleNavigation = useCallback((section) => {
    if (section === activeSection) return;
    
    setGlitchingTab(section);
    
    setTimeout(() => {
      setActiveSection(section);
      navigate(`/dashboard/${section}`);
      setTimeout(() => setGlitchingTab(null), 300);
    }, 50);
  }, [navigate, activeSection]);

  const handleMenuClick = useCallback(() => {
    console.log('Menu click handler called, current state:', isSidebarOpen);
    setIsSidebarOpen(prev => !prev);
  }, [isSidebarOpen]);

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