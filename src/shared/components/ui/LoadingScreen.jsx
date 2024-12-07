// src/components/ui/LoadingScreen.jsx
import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-[#0A0F1B]/90 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div className="relative">
      {/* Spinning Border */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-32 h-32 rounded-full border-2 border-transparent 
                   bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] p-1"
      >
        <div className="w-full h-full rounded-full bg-[#0A0F1B]" />
      </motion.div>

      {/* Loading Text */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-full left-1/2 mt-4 transform -translate-x-1/2"
      >
        <span className="font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]">
          LOADING...
        </span>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#FF2E97]/20 to-[#00F6FF]/20 rounded-full blur-md" />
      <div className="absolute -inset-1 bg-gradient-to-r from-[#FF2E97]/10 to-[#00F6FF]/10 rounded-full blur-sm" />
    </div>
  </motion.div>
);

export default LoadingScreen;