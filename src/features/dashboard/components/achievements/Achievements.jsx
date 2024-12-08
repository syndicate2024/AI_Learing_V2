import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CyberpunkAchievementEffect, FireworksAchievementEffect } from '../../../../shared/components';
import { Trophy } from 'lucide-react';

const achievementData = [
  {
    title: "MASTER HACKER",
    description: "You've unlocked the secrets of the matrix!",
    effect: "cyber",
    progress: 100
  },
  {
    title: "BOOM!!!",
    description: "YOU ARE AWESOME",
    effect: "fireworks",
    progress: 85
  },
  {
    title: "CYBER NINJA",
    description: "Silent. Swift. Deadly.",
    effect: "cyber",
    progress: 75
  },
  {
    title: "BOOM!!!",
    description: "INCREDIBLE SKILLS!",
    effect: "fireworks",
    progress: 65
  },
  {
    title: "DATA WIZARD",
    description: "Master of the Digital Realm",
    effect: "cyber",
    progress: 45
  },
  {
    title: "BOOM!!!",
    description: "UNSTOPPABLE!",
    effect: "fireworks",
    progress: 30
  }
];

const Achievements = () => {
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAchievementClick = useCallback((achievement) => {
    if (isButtonDisabled) return;
    
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
              ${isButtonDisabled 
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E97]/30 to-[#00F6FF]/30" />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
                  <p className="text-white/80">{achievement.description}</p>
                </div>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden p-0.5">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF2E97]/30 to-[#00F6FF]/30" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements; 