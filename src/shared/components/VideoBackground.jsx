import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const VideoBackground = ({ isLoginScreen, onVideoComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (!isLoginScreen) {
        onVideoComplete?.();
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [isLoginScreen, onVideoComplete]);

  return (
    <div className="overflow-hidden fixed inset-0 w-full h-full">
      <motion.div
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        >
          <source src="/assets/videos/circuit.mp4" type="video/mp4" />
        </video>
      </motion.div>
    </div>
  );
};

VideoBackground.propTypes = {
  isLoginScreen: PropTypes.bool.isRequired,
  onVideoComplete: PropTypes.func
};

export default VideoBackground; 