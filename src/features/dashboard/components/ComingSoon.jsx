import { motion } from "framer-motion";

const ComingSoon = ({ title }) => {
  return (
    <div className="flex relative flex-col justify-center items-center p-8 w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-4 font-orbitron bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent">
          {title}
        </h2>
        
        {/* Glitch Effect Container */}
        <div className="inline-block relative">
          <motion.p
            className="mb-8 text-2xl font-exo text-white/80"
            animate={{
              textShadow: [
                "0 0 10px rgba(0,246,255,0.5)",
                "2px 0 10px rgba(255,46,151,0.5)",
                "0 0 10px rgba(0,246,255,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            INITIALIZING...
          </motion.p>
        </div>

        {/* Cyberpunk Border */}
        <motion.div
          className="p-8 rounded-lg border backdrop-blur-xl border-white/10 bg-black/40"
          animate={{
            boxShadow: [
              "0 0 20px rgba(0,246,255,0.2)",
              "0 0 20px rgba(255,46,151,0.2)",
              "0 0 20px rgba(0,246,255,0.2)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="mb-4 text-xl font-exo text-white/60">
            This feature is currently in development.
          </p>
          <div className="flex gap-2 justify-center">
            <span className="text-[#FF2E97]">COMING</span>
            <span className="text-[#00F6FF]">SOON</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Background Grid Effect */}
      <div className="grid absolute inset-0 grid-cols-8 gap-2 opacity-10 -z-10 grid-rows-8">
        {[...Array(64)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ComingSoon; 