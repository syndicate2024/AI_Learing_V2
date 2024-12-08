import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CyberpunkAchievementEffect, 
  FireworksAchievementEffect,
  MatrixRainAchievementEffect,
  CyberVortexAchievementEffect,
  NeuralNetworkAchievementEffect,
  DataStormAchievementEffect,
  GrandMasterAchievementEffect
} from '../../../../shared/components';

const achievementData = [
  {
    title: "MASTER HACKER",
    description: "You've unlocked the secrets of the matrix!",
    effect: "cyber",
    progress: 100,
    theme: "from-[#FF2E97] to-[#00F6FF]",
    icon: "🔓"
  },
  {
    title: "BOOM!!!",
    description: "YOU ARE AWESOME",
    effect: "fireworks",
    progress: 85,
    theme: "from-[#FFD700] to-[#FF2E97]",
    icon: "💥"
  },
  {
    title: "MATRIX MASTER",
    description: "You've entered the Matrix",
    effect: "matrix",
    progress: 75,
    theme: "from-[#00FF00] to-[#50FF50]",
    icon: "🌐"
  },
  {
    title: "CYBER VORTEX",
    description: "You've mastered the digital whirlwind",
    effect: "vortex",
    progress: 65,
    theme: "from-[#9D00FF] to-[#FF00FF]",
    icon: "🌀"
  },
  {
    title: "NEURAL MASTER",
    description: "Neural Network Mastery Achieved",
    effect: "neural",
    progress: 45,
    theme: "from-[#9D00FF] to-[#FF00FF]",
    icon: "🧠"
  },
  {
    title: "DATA STORM",
    description: "Master of the Digital Tempest",
    effect: "storm",
    progress: 30,
    theme: "from-[#00FFFF] to-[#4169E1]",
    icon: "⚡"
  }
];

const grandMasterAchievement = {
  title: "GRAND MASTER",
  description: "The pinnacle of digital mastery. A true cyberpunk legend.",
  effect: "grandMaster",
  progress: 100,
  theme: "from-[#FFD700] via-[#FF2E97] to-[#4169E1]",
  icon: "🏆"
};

const Achievements = () => {
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAchievementClick = useCallback((achievement) => {
    if (isButtonDisabled || achievement.effect === 'none') return;
    
    setIsButtonDisabled(true);
    setActiveAchievement(achievement);
    
    const timeout = achievement.effect === 'grandMaster' ? 24000 : 8000;
    
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, timeout);
  }, [isButtonDisabled]);

  const handleAchievementComplete = useCallback(() => {
    setActiveAchievement(null);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8 z-0">
      {/* Achievement Effects */}
      <CyberpunkAchievementEffect 
        isVisible={activeAchievement?.effect === 'cyber'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />
      <FireworksAchievementEffect 
        isVisible={activeAchievement?.effect === 'fireworks'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />
      <MatrixRainAchievementEffect 
        isVisible={activeAchievement?.effect === 'matrix'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />
      <CyberVortexAchievementEffect 
        isVisible={activeAchievement?.effect === 'vortex'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />
      <NeuralNetworkAchievementEffect 
        isVisible={activeAchievement?.effect === 'neural'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />
      <DataStormAchievementEffect 
        isVisible={activeAchievement?.effect === 'storm'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />
      <GrandMasterAchievementEffect
        isVisible={activeAchievement?.effect === 'grandMaster'}
        onComplete={handleAchievementComplete}
        achievementTitle={activeAchievement?.title}
        achievementDescription={activeAchievement?.description}
      />

      {/* Achievement Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementData.map((achievement, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ 
              y: -10,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            onClick={() => handleAchievementClick(achievement)}
            className={`
              relative overflow-hidden rounded-lg border-2 border-white/20 shadow-lg 
              transition-all duration-300 cursor-pointer
              ${achievement.effect === 'none' 
                ? 'opacity-50 cursor-not-allowed' 
                : isButtonDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }
            `}
            style={{
              background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.95))',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Background Pattern */}
            <motion.div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #FF2E97 25%, transparent 25%),
                  linear-gradient(-45deg, #00F6FF 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #FF2E97 75%),
                  linear-gradient(-45deg, transparent 75%, #00F6FF 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
              whileHover={{ opacity: 0.15 }}
            />
            
            {/* Glow Effect */}
            <motion.div 
              className={`absolute inset-0 bg-gradient-to-r ${achievement.theme} opacity-30`}
              whileHover={{ opacity: 0.4 }}
            />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <motion.div 
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.theme} flex items-center justify-center shadow-lg text-2xl`}
                  whileHover={{ 
                    scale: 1.1,
                    rotate: [0, 5, -5, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  {achievement.icon}
                </motion.div>
                <div>
                  <motion.h3 
                    className="text-lg font-bold text-white"
                    whileHover={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
                  >
                    {achievement.title}
                  </motion.h3>
                  <p className="text-white/80">{achievement.description}</p>
                </div>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden p-0.5">
                <motion.div 
                  className={`h-full rounded-full bg-gradient-to-r ${achievement.theme}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  whileHover={{ filter: "brightness(1.2)" }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grand Master Achievement Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{ 
          y: -15,
          scale: 1.03,
          transition: { duration: 0.3 }
        }}
        onClick={() => handleAchievementClick(grandMasterAchievement)}
        className={`
          relative overflow-hidden rounded-lg border-2 border-[#FFD700] shadow-lg 
          transition-all duration-300 cursor-pointer mt-8 col-span-full
          ${isButtonDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }
        `}
        style={{
          background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.95))',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Background Pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #FFD700 25%, transparent 25%),
              linear-gradient(-45deg, #FF2E97 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #4169E1 75%),
              linear-gradient(-45deg, transparent 75%, #FFD700 75%)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 0 15px, 15px -15px, -15px 0px'
          }}
          whileHover={{ opacity: 0.2 }}
        />
        
        {/* Animated Glow Effect */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r ${grandMasterAchievement.theme} opacity-30`}
          whileHover={{ 
            opacity: [0.3, 0.5, 0.3],
            transition: { duration: 2, repeat: Infinity }
          }}
        />
        
        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-6 mb-6">
            <motion.div 
              className={`w-16 h-16 rounded-full bg-gradient-to-r ${grandMasterAchievement.theme} flex items-center justify-center shadow-lg text-3xl`}
              whileHover={{ 
                scale: 1.2,
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.5 }
              }}
            >
              {grandMasterAchievement.icon}
            </motion.div>
            <div>
              <motion.h3 
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FF2E97] to-[#4169E1] mb-2"
                whileHover={{
                  textShadow: [
                    "0 0 20px rgba(255,215,0,0.5)",
                    "0 0 30px rgba(255,215,0,0.8)",
                    "0 0 20px rgba(255,215,0,0.5)",
                  ],
                  transition: { duration: 1, repeat: Infinity }
                }}
              >
                {grandMasterAchievement.title}
              </motion.h3>
              <p className="text-white/90 text-lg max-w-4xl leading-relaxed">{grandMasterAchievement.description}</p>
            </div>
          </div>
          <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden p-0.5">
            <motion.div 
              className={`h-full rounded-full bg-gradient-to-r ${grandMasterAchievement.theme}`}
              initial={{ width: 0 }}
              animate={{ width: `${grandMasterAchievement.progress}%` }}
              transition={{ duration: 1.5, delay: 1 }}
              whileHover={{ filter: "brightness(1.3)" }}
            />
          </div>
        </div>

        {/* Hover Glow */}
        <motion.div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300"
          whileHover={{ opacity: 1 }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${grandMasterAchievement.theme} opacity-30`} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Achievements; 