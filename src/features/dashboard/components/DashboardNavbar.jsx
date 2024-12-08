import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Settings, User, Menu } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import DashboardLogo from '../../../shared/components/DashboardLogo';

const DashboardNavbar = ({ onMenuClick, onSignOut }) => {
  const { user } = useUser();

  const handleMenuClick = (e) => {
    console.log('Menu button clicked');
    e.stopPropagation();
    onMenuClick?.();
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-40 h-32 border-b backdrop-blur-xl bg-black/40 border-white/10">
      <div className="relative z-[1] flex items-center justify-between mx-auto max-w-7xl h-full px-12">
        {/* Left Section - Title with Menu */}
        <div className="flex items-center min-w-[400px] pt-4">
          <div className="flex items-center gap-4">
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
            
            {/* Hamburger Menu Button */}
            <motion.button
              onClick={handleMenuClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-[#FF2E97]/10 to-[#00F6FF]/10 
                hover:from-[#FF2E97]/20 hover:to-[#00F6FF]/20 cursor-pointer transition-all duration-200
                border border-white/10 hover:border-white/20"
              style={{ zIndex: 50 }}
            >
              <Menu className="w-6 h-6 text-[#00F6FF] hover:text-white transition-colors" />
            </motion.button>
          </div>
        </div>

        {/* Center Section - Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-40 h-40 flex items-center justify-center" style={{ bottom: '-80px' }}>
          <div className="relative w-full h-full">
            <DashboardLogo />
          </div>
        </div>

        {/* Right Section - User Controls */}
        <div className="flex items-center gap-4 min-w-[400px] justify-end pt-4">
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
            onClick={onSignOut}
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
  );
};

export default DashboardNavbar; 