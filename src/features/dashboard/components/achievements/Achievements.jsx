import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CyberpunkAchievementEffect } from '../../../../shared/components';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  const [showAchievement, setShowAchievement] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleTestAchievement = useCallback(() => {
    console.log("Test achievement button clicked"); // Debug log
    if (isButtonDisabled) return;
    
    setIsButtonDisabled(true);
    setShowAchievement(true);
    console.log("Achievement state set to true"); // Debug log
    
    setTimeout(() => {
      setIsButtonDisabled(false);
      console.log("Button re-enabled"); // Debug log
    }, 4000);
  }, [isButtonDisabled]);

  const handleAchievementComplete = useCallback(() => {
    console.log("Achievement animation complete"); // Debug log
    setShowAchievement(false);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8 z-0">
      {/* Achievement Effect */}
      <CyberpunkAchievementEffect 
        isVisible={showAchievement}
        onComplete={handleAchievementComplete}
        achievementTitle="MASTER HACKER"
        achievementDescription="You've unlocked the secrets of the matrix!"
      />

      {/* Test Button */}
      <div className="relative z-10 flex justify-center mb-8">
        <motion.button
          onClick={handleTestAchievement}
          disabled={isButtonDisabled}
          className={`
            px-8 py-4 rounded-lg bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] 
            text-white font-bold relative group overflow-hidden
            transition-all duration-300 transform hover:scale-105 active:scale-95
            ${isButtonDisabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:shadow-lg hover:shadow-[#FF2E97]/20 hover:-translate-y-0.5'
            }
          `}
        >
          <span className="flex items-center gap-2 relative z-10">
            <Trophy className="w-6 h-6" />
            {isButtonDisabled ? 'Achievement in Progress...' : 'Test Achievement Animation'}
          </span>
          {!isButtonDisabled && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#00F6FF] to-[#FF2E97] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </motion.button>
      </div>

      {/* Achievement Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative overflow-hidden rounded-lg border-2 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
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
                  <h3 className="text-lg font-bold text-white">Achievement {i + 1}</h3>
                  <p className="text-white/80">Coming Soon</p>
                </div>
              </div>
              <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden p-0.5">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-[#FF2E97] to-[#00F6FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.random() * 100}%` }}
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