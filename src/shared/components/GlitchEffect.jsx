import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const GlitchEffect = ({ children, isGlitching, className = '' }) => {
    const glitchVariants = {
        initial: {
            x: 0,
            y: 0,
            scale: 1,
            filter: 'none',
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        },
        glitch: {
            x: [0, -15, 20, -8, 0, 15, -20, 8, 0],
            y: [0, 12, -15, 8, 0, -12, 15, -8, 0],
            scale: [1, 1.4, 0.7, 1.3, 1, 1.4, 0.7, 1.3, 1],
            filter: [
                'none',
                'brightness(400%) contrast(300%) hue-rotate(90deg) saturate(300%)',
                'brightness(100%) contrast(100%) hue-rotate(0deg)',
                'brightness(500%) contrast(400%) hue-rotate(-90deg) saturate(300%)',
                'none',
                'brightness(400%) contrast(300%) hue-rotate(180deg) saturate(300%)',
                'none'
            ],
            transition: {
                duration: 0.3,
                times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1],
                ease: "easeInOut",
                repeat: 0
            }
        }
    };

    return (
        <motion.div
            className={className}
            initial="initial"
            animate={isGlitching ? "glitch" : "initial"}
            variants={glitchVariants}
        >
            {children}
        </motion.div>
    );
};

GlitchEffect.propTypes = {
    children: PropTypes.node.isRequired,
    isGlitching: PropTypes.bool.isRequired,
    className: PropTypes.string
};

export default GlitchEffect; 