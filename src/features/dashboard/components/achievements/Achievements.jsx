import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CyberpunkAchievementEffect, 
  FireworksAchievementEffect,
  MatrixRainAchievementEffect,
  CyberVortexAchievementEffect
} from '../../../../shared/components';
import { Trophy } from 'lucide-react';

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
    title: "COMING SOON",
    description: "Neural Network Mastery",
    effect: "none",
    progress: 45,
    theme: "from-gray-400 to-gray-600",
    icon: "🧠"
  },
  {
    title: "COMING SOON",
    description: "Future Achievement",
    effect: "none",
    progress: 30,
    theme: "from-gray-400 to-gray-600",
    icon: "🔮"
  }
];

const Achievements = () => {
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAchievementClick = useCallback((achievement) => {
    if (isButtonDisabled || achievement.effect === 'none') return;
    
    setIsButtonDisabled(true);
    setActiveAchievement(achievement);
    
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 8000); // Match the duration of the effects
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

      {/* Achievement Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievementData.map((achievement, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleAchievementClick(achievement)}
            className={`
              relative overflow-hidden rounded-lg border-2 border-white/20 shadow-lg 
              transition-all duration-300 cursor-pointer
              ${achievement.effect === 'none' 
                ? 'opacity-50 cursor-not-allowed' 
                : isButtonDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-xl hover:scale-105 hover:-translate-y-1'
              }
            `}
            style={{
              background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.95))',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Background Pattern */}
            <div 
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
            />
            
            {/* Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${achievement.theme} opacity-30`} />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.theme} flex items-center justify-center shadow-lg text-2xl`}>
                  {achievement.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                  <p className="text-white/80">{achievement.description}</p>
                </div>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden p-0.5">
                <motion.div 
                  className={`h-full rounded-full bg-gradient-to-r ${achievement.theme}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className={`absolute inset-0 bg-gradient-to-r ${achievement.theme} opacity-30`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 