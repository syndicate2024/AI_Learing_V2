import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const CyberpunkError = ({ message, onClose }) => {
  useEffect(() => {
    if (onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [onClose]);

  const glitchAnimation = {
    color: [
      '#FF2E97',
      '#00F6FF',
      '#FF2E97',
      '#ffffff',
      '#FF2E97'
    ],
    x: [0, -2, 2, -2, 0],
    y: [0, 1, -1, 1, 0],
    textShadow: [
      '2px 2px 0px #00F6FF, -2px -2px 0px #FF2E97',
      '-2px 2px 0px #00F6FF, 2px -2px 0px #FF2E97',
      '2px -2px 0px #00F6FF, -2px 2px 0px #FF2E97',
      '-2px -2px 0px #00F6FF, 2px 2px 0px #FF2E97',
      '2px 2px 0px #00F6FF, -2px -2px 0px #FF2E97'
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed z-50 -translate-x-1/2 top-4 left-1/2"
    >
      <motion.div
        className="relative px-6 py-3 border rounded-lg bg-black/80 backdrop-blur-xl border-white/10"
        style={{ boxShadow: '0 0 15px rgba(0,246,255,0.1)' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#FF2E97]/20 to-[#00F6FF]/20 rounded-lg"
          animate={{
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.p
          className="relative font-bold text-[#FF2E97] text-sm sm:text-base"
          animate={glitchAnimation}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        >
          <motion.span 
            className="text-[#00F6FF] mr-2"
            animate={{
              opacity: [1, 0.5, 1],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity
            }}
          >
            ERROR::
          </motion.span>
          {message}
        </motion.p>

        {/* Decorative elements */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-gradient-to-b from-[#FF2E97] to-transparent" />
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-gradient-to-b from-[#00F6FF] to-transparent" />
      </motion.div>
    </motion.div>
  );
};

export default CyberpunkError;