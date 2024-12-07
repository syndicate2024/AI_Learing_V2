import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const GlitchEffect = ({ children, isGlitching, className = '' }) => {
    const glitchVariants = {
        initial: {
            x: 0,
            y: 0,
            scale: 1,
            filter: 'none'
        },
        glitch: {
            x: [0, -10, 15, -5, 0, 10, -15, 5, 0],
            y: [0, 8, -12, 5, 0, -8, 12, -5, 0],
            scale: [1, 1.3, 0.8, 1.2, 1, 1.3, 0.8, 1.2, 1],
            filter: [
                'none',
                'brightness(300%) contrast(200%) hue-rotate(90deg) saturate(200%)',
                'brightness(100%) contrast(100%) hue-rotate(0deg)',
                'brightness(400%) contrast(300%) hue-rotate(-90deg) saturate(200%)',
                'none',
                'brightness(300%) contrast(200%) hue-rotate(180deg) saturate(200%)',
                'none'
            ],
            transition: {
                duration: 0.5,
                times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1],
                ease: "linear"
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