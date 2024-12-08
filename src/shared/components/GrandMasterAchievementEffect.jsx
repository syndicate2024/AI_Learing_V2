import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const GrandMasterAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "GRAND MASTER"
}) => {
  const [showTrophy, setShowTrophy] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !mountedRef.current) return;

    // Show trophy after text scrolls up (45 seconds)
    const trophyTimer = setTimeout(() => {
      if (mountedRef.current) {
        setShowTrophy(true);
      }
    }, 45000);

    // Show congratulations after trophy effect (15 seconds)
    const congratsTimer = setTimeout(() => {
      if (mountedRef.current) {
        setShowCongrats(true);
      }
    }, 60000);

    return () => {
      clearTimeout(trophyTimer);
      clearTimeout(congratsTimer);
    };
  }, [isVisible]);

  const handleExit = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="overflow-hidden fixed inset-0 bg-black"
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        zIndex: 99999
      }}
    >
      {!showCongrats && !showTrophy && (
        <motion.div
          className="flex relative justify-center items-center w-full min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="w-full max-w-4xl text-center"
            initial={{ y: '100vh' }}
            animate={{ y: '-200vh' }}
            transition={{
              duration: 45,
              ease: 'linear'
            }}
          >
            <div className="px-8 py-[50vh]">
              <h1 className="text-8xl font-bold text-[#FFD700] font-orbitron mb-16 select-none">
                {achievementTitle}
              </h1>

              <div className="text-3xl text-[#FFD700] font-exo space-y-12 leading-relaxed">
                <p>
                  Your journey through the digital realm has forged you into a true master. As you venture forth, remember: in the ever-evolving landscape of technology, your greatest power lies not just in the code you write, but in your unwavering spirit to learn, adapt, and innovate.
                </p>
                
                <p>
                  What once seemed impossible is now your reality. The transition into a developer role is not just about mastering code—it is about transforming your life. Six-figure opportunities, remote work freedom, and the ability to create meaningful change are now within your grasp. Your dedication has opened doors that many spend years trying to unlock.
                </p>
                
                <p>
                  But remember, this achievement is not the end—it is a beginning. In the vast expanse of technology, there are always new horizons to explore, higher peaks to climb, and greater innovations to pioneer. Your journey of growth and discovery is infinite. The future is yours to shape, and your potential knows no bounds.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showTrophy && !showCongrats && (
        <motion.div
          className="flex absolute inset-0 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [180, 0],
            }}
            transition={{ 
              duration: 2,
              ease: "easeOut"
            }}
          >
            {/* Trophy Image */}
            <motion.img 
              src="/trophy.png"
              alt="Grand Master Trophy"
              className="object-contain w-64 h-64"
              animate={{
                filter: [
                  'drop-shadow(0 0 20px #FFD700)',
                  'drop-shadow(0 0 40px #FF2E97)',
                  'drop-shadow(0 0 20px #4169E1)',
                  'drop-shadow(0 0 40px #FFD700)',
                ],
              }}
              transition={{
                duration: 4,
                repeat: 3,
                ease: "linear"
              }}
            />

            {/* Light Beams */}
            <motion.div
              className="absolute inset-0 -z-10"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(255,46,151,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(65,105,225,0.3) 0%, transparent 70%)',
                ],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 6,
                repeat: 2,
                ease: "linear"
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {showCongrats && (
        <motion.div
          className="flex absolute inset-0 flex-col justify-center items-center px-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1 }}
        >
          <motion.h2
            className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FF2E97] to-[#4169E1] font-orbitron mb-8"
            animate={{
              textShadow: [
                '0 0 40px rgba(255,215,0,0.8)',
                '0 0 60px rgba(255,215,0,1)',
                '0 0 40px rgba(255,215,0,0.8)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Congratulations!
          </motion.h2>
          
          <p className="mb-12 text-4xl text-white font-exo">
            You have completed your journey to mastery.
          </p>

          <motion.button
            onClick={handleExit}
            className="px-8 py-4 bg-gradient-to-r from-[#FFD700] via-[#FF2E97] to-[#4169E1] rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue Your Journey
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

GrandMasterAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string
};

export default GrandMasterAchievementEffect; 