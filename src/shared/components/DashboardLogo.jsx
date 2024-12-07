import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_CHANGE_INTERVAL = 4 * 60 * 1000; // 4 minutes in milliseconds

const DashboardLogo = () => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logos] = useState([
    '/logos/transparent.png'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % logos.length);
    }, LOGO_CHANGE_INTERVAL);

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div className="flex items-center justify-center h-[300px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLogoIndex}
          initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            rotate: 180 
          }}
          transition={{ 
            duration: 1,
            ease: "easeInOut"
          }}
          className="relative w-[300px] h-[300px] flex items-center justify-center"
        >
          {/* Neon Accent Lines */}
          <div className="absolute w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#00F6FF] opacity-50 z-10" />
          <div className="absolute w-[202px] h-[202px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#FF2E97] opacity-30 z-10" />

          {/* Circular Background with Glow */}
          <motion.div
            className="absolute w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black z-20"
            animate={{
              boxShadow: [
                '0 0 40px rgba(0,246,255,0.5), 0 0 80px rgba(0,246,255,0.3), inset 0 0 100px rgba(255,46,151,0.3)',
                '0 0 50px rgba(255,46,151,0.5), 0 0 90px rgba(255,46,151,0.3), inset 0 0 110px rgba(0,246,255,0.3)',
                '0 0 40px rgba(0,246,255,0.5), 0 0 80px rgba(0,246,255,0.3), inset 0 0 100px rgba(255,46,151,0.3)',
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Inner Rotating Glow */}
          <motion.div
            className="absolute w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#FF2E97]/20 to-[#00F6FF]/20 z-20"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Logo Image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] z-30">
            <img
              src={logos[currentLogoIndex]}
              alt="Cyberpunk Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DashboardLogo;