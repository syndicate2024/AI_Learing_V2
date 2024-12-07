import { motion } from "framer-motion";
import PropTypes from 'prop-types';

const ComingSoon = ({ title }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Content */}
      <motion.div
        className="relative z-20 p-8 rounded-lg border backdrop-blur-xl bg-black/40 border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent font-orbitron"
          animate={{
            textShadow: [
              "0 0 10px rgba(0,246,255,0.5)",
              "0 0 15px rgba(255,46,151,0.5)",
              "0 0 10px rgba(0,246,255,0.5)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {title}
        </motion.h2>

        <motion.div
          className="text-center text-gray-400 text-lg mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          INITIALIZING...
        </motion.div>

        <motion.div
          className="text-center p-6 rounded-lg backdrop-blur-sm bg-black/20 border border-white/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-300 mb-4">This feature is currently in development.</p>
          <p className="font-bold">
            <span className="text-[#FF2E97]">COMING</span>{" "}
            <span className="text-[#00F6FF]">SOON</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Background Grid Effect */}
      <div className="fixed inset-x-32 top-48 bottom-32 grid grid-cols-8 gap-2 opacity-20 -z-10">
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
    </div>
  );
};

ComingSoon.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ComingSoon; 