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

  // Update localStorage when sidebar state changes
  useEffect(() => {
    localStorage.setItem('dashboardSidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  // Update localStorage when active section changes
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
    }, 1000);
  }, [signOut, navigate]);

  const handleNavigation = useCallback((section) => {
    if (section === activeSection) return;
    
    setGlitchingTab(section);
    
    setTimeout(() => {
      setActiveSection(section);
      navigate(section);
      setTimeout(() => setGlitchingTab(null), 300);
    }, 50);
  }, [navigate, activeSection]);

  const handleMenuClick = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0F1B] overflow-hidden">
      {/* Base Layer - Subtle Grid */}
      <CyberpunkGrid />

      {/* Second Layer - Pulsing Grid */}
      <PulsingGridOverlay />

      {/* Navigation and Sidebar */}
      <DashboardNavbar 
        onMenuClick={handleMenuClick}
        onSignOut={handleSignOut}
      />
      <DashboardSidebar 
        isOpen={isSidebarOpen}
        activeSection={activeSection}
        glitchingTab={glitchingTab}
        onNavigate={handleNavigation}
      />

      {/* Coming Soon - Mid Layer */}
      <motion.div
        className="fixed inset-0 z-20 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] font-orbitron"
          animate={{
            textShadow: [
              "0 0 20px rgba(0,246,255,0.5)",
              "0 0 30px rgba(255,46,151,0.5)",
              "0 0 20px rgba(0,246,255,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          COMING SOON
        </motion.h1>
      </motion.div>

      {/* Explosion Effect - Top Layer */}
      {showExplosion && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ExplosionEffect 
            onComplete={() => {
              setShowExplosion(false);
            }} 
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-15 pt-32">
        <div className="px-6 mx-auto max-w-7xl flex items-center justify-center min-h-[calc(100vh-208px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
