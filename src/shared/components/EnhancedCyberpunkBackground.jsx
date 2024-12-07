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

  const gradientVariants = useMemo(() => ({
    animate: {
      background: [
        'linear-gradient(45deg, rgba(255,46,151,0.15) 0%, rgba(0,246,255,0.15) 100%)',
        'linear-gradient(225deg, rgba(255,46,151,0.15) 0%, rgba(0,246,255,0.15) 100%)',
        'linear-gradient(45deg, rgba(255,46,151,0.15) 0%, rgba(0,246,255,0.15) 100%)'
      ],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 10,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  }), []);

  const glowVariants = useMemo(() => ({
    animate: {
      opacity: [0.2, 0.4, 0.2],
      scale: [1, 1.1, 1],
      transition: {
        duration: 5,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  }), []);

  return (
    <div className="overflow-hidden absolute inset-0">
      {/* Static Square Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Animated Gradient Grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,46,151,0.15) 0%, rgba(0,246,255,0.15) 100%)
          `,
          backgroundSize: '200% 200%'
        }}
        variants={gradientVariants}
        animate="animate"
      />

      {/* Moving Grid Pattern */}
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

