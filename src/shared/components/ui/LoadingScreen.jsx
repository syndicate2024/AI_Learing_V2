// src/components/ui/LoadingScreen.jsx
import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-[#0A0F1B] flex items-center justify-center z-50">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
      className="w-16 h-16 border-4 border-t-[#FF2E97] border-r-[#00F6FF] border-b-[#FF2E97] border-l-[#00F6FF] rounded-full"
    />
  </div>
);

export default LoadingScreen;