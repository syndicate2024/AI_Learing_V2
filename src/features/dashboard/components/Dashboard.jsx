import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Trophy,
  Activity,
  LogOut,
  Settings,
  Menu,
  User
} from "lucide-react";
import { 
  EnhancedCyberpunkBackground,
  ExplosionEffect 
} from '../../../shared/components';
import VideoBackground from '../../../shared/components/VideoBackground';

const Dashboard = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showExplosion, setShowExplosion] = useState(false);
  const [activeSection, setActiveSection] = useState("Overview");
  const [showVideo, setShowVideo] = useState(true);

  const handleSignOut = useCallback(() => {
    setShowExplosion(true);
    setTimeout(() => {
      localStorage.removeItem("rememberedCredentials");
      signOut()
        .then(() => navigate("/"))
        .catch((error) => console.error("Error signing out:", error));
    }, 1000);
  }, [signOut, navigate]);

  const handleNavigation = useCallback((section) => {
    setActiveSection(section);
    setShowExplosion(true);
    setTimeout(() => {
      setShowExplosion(false);
    }, 300);
  }, []);

  const handleVideoComplete = () => {
    // Video has played for its duration, transition to the next background
    setShowVideo(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0F1B] overflow-hidden">
      {/* Background - lowest layer */}
      <div className="absolute inset-0 z-0">
        {showVideo ? (
          <VideoBackground 
            isLoginScreen={false} 
            onVideoComplete={handleVideoComplete} 
          />
        ) : (
          <EnhancedCyberpunkBackground />
        )}
      </div>

      {/* Explosion Effect - highest layer */}
      {showExplosion && (
        <div className="fixed inset-0 z-50">
          <ExplosionEffect />
        </div>
      )}

      {/* Main Content Container - mid layer */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <nav className="fixed top-0 right-0 left-0 z-30 px-4 py-3 border-b backdrop-blur-xl bg-black/40 border-white/10">
          <div className="relative z-[1] flex items-center justify-between mx-auto max-w-7xl">
            {/* Menu Toggle & Title */}
            <div className="flex gap-4 items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="overflow-hidden relative p-2 rounded-full transition-colors group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-0 group-hover:opacity-20 transition-opacity" />
                <Menu className="w-6 h-6 text-white" />
              </motion.button>

              <motion.h1
                className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] font-orbitron"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(0,246,255,0.5)",
                    "0 0 15px rgba(255,46,151,0.5)",
                    "0 0 10px rgba(0,246,255,0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CYBERPUNK DASHBOARD
              </motion.h1>
            </div>

            {/* User Controls */}
            <div className="flex gap-4 items-center">
              <motion.div
                className="flex gap-2 items-center p-2 rounded-lg border backdrop-blur-lg bg-black/20 border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-10 h-10 p-[2px] rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-0 group-hover:opacity-20 transition-opacity" />
                  <div className="flex justify-center items-center w-full h-full bg-black rounded-full">
                    <User size={20} className="text-[#00F6FF]" />
                  </div>
                </div>
                <span className="text-white font-exo">
                  {user?.username || user?.emailAddresses[0].emailAddress}
                </span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="overflow-hidden relative p-2 rounded-full border backdrop-blur-lg transition-all group bg-black/20 border-white/10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-0 group-hover:opacity-20 transition-opacity" />
                <Settings size={20} className="text-white/80 group-hover:text-white" />
              </motion.button>

              <motion.button
                onClick={handleSignOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="overflow-hidden relative px-4 py-2 rounded-full group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]" />
                <div className="absolute inset-[1px] bg-black rounded-full transition-opacity group-hover:bg-opacity-50" />
                <span className="relative z-[1] flex items-center gap-2 text-white">
                  <LogOut size={20} />
                  Logout
                </span>
              </motion.button>
            </div>
          </div>
        </nav>

        {/* Sidebar */}
        <motion.div
          className="fixed top-0 left-0 z-20 pt-20 h-full border-r backdrop-blur-xl bg-black/40 border-white/10"
          animate={{
            width: isSidebarOpen ? "280px" : "0px",
            opacity: isSidebarOpen ? 1 : 0,
          }}
          transition={{ 
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          {isSidebarOpen && (
            <div className="relative z-[1] p-4">
              {/* Navigation Items */}
              <div className="space-y-3">
                {[
                  { icon: LayoutDashboard, title: "Overview" },
                  { icon: BookOpen, title: "Learning Progress" },
                  { icon: Code2, title: "Projects" },
                  { icon: Trophy, title: "Achievements" },
                  { icon: Activity, title: "Recent Activity" }
                ].map((item) => (
                  <motion.button
                    key={item.title}
                    onClick={() => handleNavigation(item.title)}
                    className={`flex items-center w-full gap-4 px-5 py-4 transition-all rounded-lg group relative overflow-hidden
                              ${item.title === activeSection ? "bg-white/10" : "hover:bg-white/5"}`}
                    whileHover={{ 
                      x: 5,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: 0
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-0 
                                transition-opacity duration-300 ${
                                  item.title === activeSection ? "opacity-10" : "group-hover:opacity-5"
                                }`} />
                    <item.icon
                      className={`w-6 h-6 transition-colors
                                ${
                                  item.title === activeSection
                                    ? "text-[#00F6FF]"
                                    : "text-white/70 group-hover:text-[#00F6FF]"
                                }`}
                    />
                    <span
                      className={`font-medium tracking-wide font-exo text-lg transition-colors
                                ${
                                  item.title === activeSection
                                    ? "bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent"
                                    : "text-white/70 group-hover:text-white"
                                }`}
                    >
                      {item.title}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Main Content Area */}
        <motion.main
          className="relative z-10 pt-24 transition-all duration-300"
          animate={{
            marginLeft: isSidebarOpen ? "280px" : "0px",
          }}
        >
          <div className="px-6 mx-auto max-w-7xl">
            {/* Content for each section will be added here */}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;