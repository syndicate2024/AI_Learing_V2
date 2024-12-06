import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_INTERVAL = 10000; // 10 seconds per logo

const RotatingLogo = () => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logos] = useState([
    '/logos/myAI.png',
    '/logos/myAI_v2.png',
    '/logos/myAi_brain.png',
    // Add all your logo paths here
    ...Array.from({ length: 61 }, (_, i) => `/logos/Untitled-3 (${i + 1}).png`)
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % logos.length);
    }, LOGO_INTERVAL);

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLogoIndex}
          initial={{ opacity: 0, y: -20, rotateY: -180 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          exit={{ opacity: 0, y: 20, rotateY: 180 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <img
            src={logos[currentLogoIndex]}
            alt="AI Learning Platform Logo"
            className="h-16 w-auto"
          />
          
          {/* Circuit underline */}
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-0.5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            <div className="h-full bg-gradient-to-r from-transparent via-[#00F6FF] to-transparent" />
            
            {/* Circuit dots */}
            <motion.div
              className="absolute left-0 top-1/2 w-2 h-2 rounded-full bg-[#00F6FF]"
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingLogo; 