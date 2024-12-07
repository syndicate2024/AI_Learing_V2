import React from 'react';
import { motion } from 'framer-motion';
import { GlitchEffect } from '../../../shared/components';
import {
  LayoutDashboard,
  Code2,
  Trophy,
  Activity,
  Calendar,
  Save,
  GraduationCap,
  Rocket,
  Users,
  Brain,
  BookMarked,
  Star
} from 'lucide-react';

const menuItems = [
  // Core Features
  { icon: LayoutDashboard, title: "Overview", path: "overview" },
  { icon: GraduationCap, title: "Learning Progress", path: "learning-progress" },
  { icon: Code2, title: "Projects", path: "projects" },
  { icon: Trophy, title: "Achievements", path: "achievements" },
  { icon: Activity, title: "Activity", path: "activity" },
  { icon: Calendar, title: "Daily Log", path: "daily-log" },
  { icon: Save, title: "Backup", path: "backup" },
  // New Features
  { icon: Rocket, title: "Challenges", path: "challenges" },
  { icon: Users, title: "Community", path: "community" },
  { icon: Brain, title: "AI Assistant", path: "ai-assistant" },
  { icon: BookMarked, title: "Resources", path: "resources" },
  { icon: Star, title: "Premium", path: "premium" }
];

const DashboardSidebar = ({ isOpen, activeSection, glitchingTab, onNavigate }) => {
  return (
    <motion.div
      className="fixed top-0 left-0 z-30 h-screen border-r backdrop-blur-xl bg-black/40 border-white/10"
      animate={{
        width: isOpen ? "280px" : "0px",
        opacity: isOpen ? 1 : 0,
      }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut"
      }}
    >
      {isOpen && (
        <div className="relative z-[1] flex flex-col h-full pt-32 pb-6">
          <div className="flex flex-col flex-1 justify-between p-3">
            {/* Core Features Group */}
            <div className="space-y-2">
              {menuItems.slice(0, 7).map((item) => (
                <GlitchEffect
                  key={item.title}
                  isGlitching={glitchingTab === item.path}
                  className="w-full"
                >
                  <motion.button
                    onClick={() => onNavigate(item.path)}
                    className={`flex items-center w-full gap-3 px-4 py-2.5 transition-all rounded-lg group relative overflow-hidden
                      ${item.path === activeSection ? "bg-gradient-to-r from-[#FF2E97]/20 to-[#00F6FF]/20" : "hover:bg-white/5"}`}
                    whileHover={{ 
                      x: 5,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-0 
                      transition-opacity duration-300 ${
                        item.path === activeSection ? "opacity-20" : "group-hover:opacity-5"
                      }`} />
                    <div className="relative z-10 flex items-center gap-3">
                      <item.icon
                        className={`w-5 h-5 transition-colors duration-300
                          ${
                            item.path === activeSection
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]"
                              : "text-white/70 group-hover:text-[#00F6FF]"
                          }`}
                      />
                      <span
                        className={`font-medium tracking-wide font-exo text-base whitespace-nowrap transition-colors duration-300
                          ${
                            item.path === activeSection
                              ? "bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent"
                              : "text-white/70 group-hover:text-white"
                          }`}
                      >
                        {item.title}
                      </span>
                    </div>
                  </motion.button>
                </GlitchEffect>
              ))}
            </div>

            {/* Additional Features Group */}
            <div className="mt-4 space-y-2">
              {menuItems.slice(7).map((item) => (
                <GlitchEffect
                  key={item.title}
                  isGlitching={glitchingTab === item.path}
                  className="w-full"
                >
                  <motion.button
                    onClick={() => onNavigate(item.path)}
                    className={`flex items-center w-full gap-3 px-4 py-2.5 transition-all rounded-lg group relative overflow-hidden
                      ${item.path === activeSection ? "bg-gradient-to-r from-[#FF2E97]/20 to-[#00F6FF]/20" : "hover:bg-white/5"}`}
                    whileHover={{ 
                      x: 5,
                      transition: { duration: 0.1 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] opacity-0 
                      transition-opacity duration-300 ${
                        item.path === activeSection ? "opacity-20" : "group-hover:opacity-5"
                      }`} />
                    <div className="relative z-10 flex items-center gap-3">
                      <item.icon
                        className={`w-5 h-5 transition-colors duration-300
                          ${
                            item.path === activeSection
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]"
                              : "text-white/70 group-hover:text-[#00F6FF]"
                          }`}
                      />
                      <span
                        className={`font-medium tracking-wide font-exo text-base whitespace-nowrap transition-colors duration-300
                          ${
                            item.path === activeSection
                              ? "bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent"
                              : "text-white/70 group-hover:text-white"
                          }`}
                      >
                        {item.title}
                      </span>
                    </div>
                  </motion.button>
                </GlitchEffect>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default DashboardSidebar; 