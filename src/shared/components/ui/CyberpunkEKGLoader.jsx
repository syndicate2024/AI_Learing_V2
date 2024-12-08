import { motion } from 'framer-motion';

const CyberpunkEKGLoader = () => {
  return (
    <div className="fixed inset-0 bg-[#0A0F1B] flex flex-col items-center justify-center z-50">
      <div className="relative w-full h-48">
        {/* Base Line */}
        <motion.div 
          className="absolute top-1/2 w-full h-[3px] bg-[#00F6FF]/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: '0 0 20px #00F6FF'
          }}
        />

        {/* EKG Path */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 2000 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FF2E97', stopOpacity: 1 }}>
                <animate
                  attributeName="stop-color"
                  values="#FF2E97; #00F6FF; #FF2E97"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" style={{ stopColor: '#FF2E97', stopOpacity: 1 }}>
                <animate
                  attributeName="stop-color"
                  values="#00F6FF; #FF2E97; #00F6FF"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" style={{ stopColor: '#00F6FF', stopOpacity: 1 }}>
                <animate
                  attributeName="stop-color"
                  values="#FF2E97; #00F6FF; #FF2E97"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
            
            {/* Enhanced Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* First EKG Line */}
          <motion.path
            d={`M0 100 
               L50 100 
               L70 100 L80 20 L90 180 L100 100 
               L120 100 L130 60 L140 140 L150 100 
               L170 100 L180 40 L190 160 L200 100 
               L220 100 L230 80 L240 120 L250 100
               L270 100 L280 30 L290 170 L300 100
               L320 100 L330 50 L340 150 L350 100
               L370 100 L380 20 L390 180 L400 100
               L420 100 L430 70 L440 130 L450 100
               L470 100 L480 40 L490 160 L500 100
               L520 100 L530 20 L540 180 L550 100
               L570 100 L580 60 L590 140 L600 100
               L620 100 L630 30 L640 170 L650 100
               L1000 100`}
            stroke="url(#ekgGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 1, opacity: 1, x: -1000 }}
            animate={{ 
              x: [-1000, 0]
            }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              times: [0, 1]
            }}
            style={{
              filter: "drop-shadow(0 0 8px #FF2E97) drop-shadow(0 0 16px #00F6FF)"
            }}
          />

          {/* Second EKG Line (offset) */}
          <motion.path
            d={`M0 100 
               L50 100 
               L70 100 L80 20 L90 180 L100 100 
               L120 100 L130 60 L140 140 L150 100 
               L170 100 L180 40 L190 160 L200 100 
               L220 100 L230 80 L240 120 L250 100
               L270 100 L280 30 L290 170 L300 100
               L320 100 L330 50 L340 150 L350 100
               L370 100 L380 20 L390 180 L400 100
               L420 100 L430 70 L440 130 L450 100
               L470 100 L480 40 L490 160 L500 100
               L520 100 L530 20 L540 180 L550 100
               L570 100 L580 60 L590 140 L600 100
               L620 100 L630 30 L640 170 L650 100
               L1000 100`}
            stroke="url(#ekgGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
            initial={{ pathLength: 1, opacity: 1, x: -1000 }}
            animate={{ 
              x: [-1000, 0]
            }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: 0.25,
              times: [0, 1]
            }}
            style={{
              filter: "drop-shadow(0 0 8px #FF2E97) drop-shadow(0 0 16px #00F6FF)"
            }}
          />
        </svg>

        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(40)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-[#00F6FF]/30"
              style={{ left: `${i * 2.5}%` }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-[#00F6FF]/30"
              style={{ top: `${i * 10}%` }}
            />
          ))}
        </div>
      </div>

      {/* Loading Text */}
      <motion.div 
        className="mt-8 text-2xl text-[#00F6FF] font-bold tracking-[0.3em] font-exo"
        animate={{
          opacity: [0.5, 1, 0.5],
          color: ['#00F6FF', '#FF2E97', '#00F6FF'],
          textShadow: [
            "0 0 8px rgba(0,246,255,0.5)",
            "0 0 16px rgba(255,46,151,0.8)",
            "0 0 8px rgba(0,246,255,0.5)"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        LOADING...
      </motion.div>

      {/* BPM Counter */}
      <motion.div 
        className="absolute top-1/2 right-8 transform translate-y-[-50%] text-[#FF2E97] font-mono text-3xl font-bold"
        animate={{
          opacity: [1, 0.7, 1],
          scale: [1, 1.1, 1],
          color: ['#FF2E97', '#00F6FF', '#FF2E97'],
          textShadow: [
            "0 0 8px rgba(255,46,151,0.5)",
            "0 0 16px rgba(0,246,255,0.8)",
            "0 0 8px rgba(255,46,151,0.5)"
          ]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        180 BPM
      </motion.div>
    </div>
  );
};

export default CyberpunkEKGLoader; 