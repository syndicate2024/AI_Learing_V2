import { motion } from "framer-motion";

const PulsingGridOverlay = () => {
  return (
    <div className="fixed inset-x-32 top-48 bottom-32 grid grid-cols-8 gap-2 opacity-20 z-[1]">
      {[...Array(64)].map((_, i) => (
        <motion.div
          key={i}
          className="bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] rounded-sm"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default PulsingGridOverlay; 