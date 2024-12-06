import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const EnhancedCyberpunkBackground = () => {
  const gridVariants = useMemo(() => ({
    animate: {
      backgroundPosition: ['0px 0px', '100px 100px'],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity
      }
    }
  }), []);

  const glowVariants = useMemo(() => ({
    animate: {
      opacity: [0.3, 0.5, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid Pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,46,151,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,246,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        variants={gridVariants}
        animate="animate"
      />

      {/* Glow Effects */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#FF2E97]/20 via-transparent to-[#00F6FF]/20"
        variants={glowVariants}
        animate="animate"
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-radial-gradient" />
    </div>
  );
};

export default React.memo(EnhancedCyberpunkBackground);