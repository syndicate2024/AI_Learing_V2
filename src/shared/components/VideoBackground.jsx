import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import PropTypes from 'prop-types';

const DataStreams = () => (
  <>
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="data-stream"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          height: `${Math.random() * 30 + 20}%`
        }}
      />
    ))}
  </>
);

const GlitchEffect = () => (
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      className="absolute inset-0 bg-[#00F6FF] mix-blend-screen"
      animate={{
        opacity: [0, 0.1, 0, 0.1, 0],
        x: [-10, 0, 10, -10, 0],
        scaleY: [1, 1.1, 1, 0.9, 1]
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
    <motion.div
      className="absolute inset-0 bg-[#FF2E97] mix-blend-screen"
      animate={{
        opacity: [0, 0.1, 0, 0.1, 0],
        x: [10, 0, -10, 10, 0],
        scaleY: [1, 0.9, 1, 1.1, 1]
      }}
      transition={{
        duration: 0.4,
        repeat: Infinity,
        repeatType: "reverse",
        delay: 0.1
      }}
    />
  </div>
);

const HologramOverlay = () => (
  <div className="absolute inset-0 opacity-30 pointer-events-none hologram" />
);

const InteractiveGlow = ({ mouseX, mouseY }) => {
  const size = 400;
  return (
    <motion.div
      className="absolute mix-blend-soft-light -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle, rgba(0,246,255,0.15) 0%, transparent 70%)',
        x: mouseX,
        y: mouseY
      }}
    />
  );
};

InteractiveGlow.propTypes = {
  mouseX: PropTypes.object.isRequired,
  mouseY: PropTypes.object.isRequired
};

const KeypressEffect = ({ position }) => (
  <motion.div
    className="absolute pointer-events-none"
    initial={{ opacity: 0.7, scale: 0 }}
    animate={{ opacity: 0, scale: 2 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      left: position.x,
      top: position.y,
      width: 100,
      height: 100,
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
    }}
  />
);

KeypressEffect.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired
};

const VideoBackground = ({ isLoginScreen, onVideoComplete }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [keypressEffects, setKeypressEffects] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse movement to affect data streams
  const streamRotation = useTransform(mouseX, [-200, 200], [-5, 5]);
  const streamScale = useTransform(mouseY, [-200, 200], [0.95, 1.05]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleKeyPress = (e) => {
      // Only show effects for actual keys (not modifiers, etc)
      if (e.key?.length !== 1) return;

      const rect = container?.getBoundingClientRect();
      if (!rect) return;

      const randomX = Math.random() * rect.width;
      const randomY = Math.random() * rect.height;

      const newEffect = {
        id: Date.now(),
        position: { x: randomX, y: randomY }
      };

      setKeypressEffects(prev => [...prev, newEffect]);
      
      // Remove effect after animation
      setTimeout(() => {
        setKeypressEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
      }, 500);

      // Add glitch effect on keypress
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 100);
    };

    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (isLoginScreen) {
        setIsTransitioning(true);
        setTimeout(() => {
          video.play();
          setIsTransitioning(false);
        }, 500);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          onVideoComplete?.();
        }, 1000);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [isLoginScreen, onVideoComplete]);

  const handleLoadedData = () => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  };

  return (
    <div ref={containerRef} className="overflow-hidden fixed inset-0 w-full h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key="video-container"
          className="relative w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Base video */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            } ${isTransitioning ? 'blur-sm' : 'blur-0'}`}
            autoPlay
            muted
            playsInline
            onLoadedData={handleLoadedData}
          >
            <source src="/assets/videos/circuit.mp4" type="video/mp4" />
          </video>

          {/* Interactive mouse glow */}
          <InteractiveGlow mouseX={mouseX} mouseY={mouseY} />

          {/* Keypress effects */}
          <AnimatePresence>
            {keypressEffects.map(effect => (
              <KeypressEffect key={effect.id} position={effect.position} />
            ))}
          </AnimatePresence>

          {/* Data streams that follow mouse */}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              rotateZ: streamRotation,
              scale: streamScale
            }}
          >
            <DataStreams />
          </motion.div>

          {/* Rest of existing effects */}
          <AnimatePresence>
            {isTransitioning && (
              <>
                <GlitchEffect />
                <DataStreams />
              </>
            )}
          </AnimatePresence>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#FF2E97]/5 via-transparent to-[#00F6FF]/5 neon-glow"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <HologramOverlay />
          
          <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.03]" />

          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <DataStreams />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

VideoBackground.propTypes = {
  isLoginScreen: PropTypes.bool.isRequired,
  onVideoComplete: PropTypes.func
};

export default VideoBackground; 