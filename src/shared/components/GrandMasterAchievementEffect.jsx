import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { ExplosionEffect } from './ExplosionEffect';

const GrandMasterAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "GRAND MASTER"
}) => {
  const [showExplosion, setShowExplosion] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [trophyOpacity, setTrophyOpacity] = useState(1);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !mountedRef.current) return;

    // Show explosion after 3 seconds
    const explosionTimer = setTimeout(() => {
      if (mountedRef.current) {
        setShowExplosion(true);
      }
    }, 3000);

    // Start fading out trophy after explosion (5 seconds)
    const fadeTimer = setTimeout(() => {
      if (mountedRef.current) {
        setTrophyOpacity(0);
        // Start text immediately as trophy starts fading
        setShowText(true);
      }
    }, 8000);

    // Show congratulations after text (60 seconds)
    const congratsTimer = setTimeout(() => {
      if (mountedRef.current) {
        setShowText(false); // Fade out text
        setTimeout(() => {
          if (mountedRef.current) {
            setShowCongrats(true);
          }
        }, 2000); // Wait 2 seconds after text fade out
      }
    }, 68000);

    return () => {
      clearTimeout(explosionTimer);
      clearTimeout(fadeTimer);
      clearTimeout(congratsTimer);
    };
  }, [isVisible]);

  const handleExit = () => {
    console.log('Exit clicked');
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
      {/* Trophy */}
      <motion.div
        className="flex absolute inset-x-0 bottom-0 top-48 justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: trophyOpacity, scale: 1 }}
        transition={{ 
          duration: 3,
          opacity: { duration: 3 }
        }}
        style={{ zIndex: 100000 }}
      >
        <motion.div
          className="relative w-[500px] h-[500px] flex items-center justify-center"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Trophy Image */}
          <motion.img 
            src="/trophy.png"
            alt="Grand Master Trophy"
            className="object-contain w-full h-full"
            animate={{
              filter: [
                'drop-shadow(0 0 40px #FFD700)',
                'drop-shadow(0 0 80px #FF2E97)',
                'drop-shadow(0 0 40px #4169E1)',
                'drop-shadow(0 0 80px #FFD700)',
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
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
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </motion.div>

      {/* Explosion Effect */}
      {showExplosion && (
        <div className="fixed inset-0 z-[100001] pointer-events-none">
          <ExplosionEffect onComplete={() => setShowExplosion(false)} />
        </div>
      )}

      {/* Scrolling Text */}
      <AnimatePresence>
        {showText && !showCongrats && (
          <motion.div
            className="flex relative justify-center items-center w-full min-h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3,
              delay: 1 // Start fading in as trophy fades
            }}
          >
            <motion.div
              className="w-full max-w-4xl text-center"
              initial={{ y: '50vh' }}
              animate={{ y: '-80vh' }}
              transition={{
                duration: 60,
                ease: 'linear',
                delay: 2 // Start scrolling after fade in
              }}
            >
              <div className="px-8">
                <h1 className="text-8xl font-bold text-[#FFD700] font-orbitron mb-16 select-none">
                  {achievementTitle}
                </h1>

                <div className="text-3xl text-[#FFD700] font-exo space-y-24 leading-relaxed">
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
      </AnimatePresence>

      {/* Congratulations */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            className="flex fixed inset-0 flex-col justify-center items-center px-8 text-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ zIndex: 100002 }}
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
              className="px-8 py-4 bg-gradient-to-r from-[#FFD700] via-[#FF2E97] to-[#4169E1] rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform cursor-pointer z-[100003]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Your Journey
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

GrandMasterAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string
};

export default GrandMasterAchievementEffect; 