import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const MatrixRainAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "MATRIX MASTER", 
  achievementDescription = "You've entered the Matrix" 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    console.log("Matrix Rain effect triggered");

    let scene, camera, renderer, particles;
    let startTime = Date.now();

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Create matrix rain particles
      const geometry = new THREE.BufferGeometry();
      const particleCount = 5000;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const lifetimes = new Float32Array(particleCount);

      for(let i = 0; i < particleCount; i++) {
        // Random starting positions across the screen
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = Math.random() * 50 + 25; // Start above screen
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Downward velocity with slight variation
        velocities[i * 3] = (Math.random() - 0.5) * 0.2;
        velocities[i * 3 + 1] = -Math.random() * 2 - 1; // Falling speed
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

        // Matrix green with slight variations
        const colorChoice = Math.random();
        const color = new THREE.Color(
          colorChoice < 0.7 ? '#00FF00' :  // Matrix Green
          colorChoice < 0.9 ? '#50FF50' :  // Lighter Green
          '#20FF20'  // Mid Green
        );
        colors[i * 3] = color.r * 0.8;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b * 0.8;

        sizes[i] = Math.random() * 2 + 1;
        lifetimes[i] = Math.random() * 2; // Random start times
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1.0 }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          varying float vOpacity;
          uniform float time;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            vOpacity = sin(time + position.y * 0.5) * 0.5 + 0.5;
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec3 vColor;
          varying float vOpacity;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (r > 0.5) discard;
            gl_FragColor = vec4(vColor, vOpacity * opacity);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      camera.position.z = 30;

      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const DURATION = 8.0;
        const FADE_START = 6.0;
        
        if (elapsedTime < DURATION) {
          const positions = particles.geometry.attributes.position.array;
          
          for(let i = 0; i < positions.length; i += 3) {
            // Update positions
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];

            // Reset particles that fall below screen
            if (positions[i + 1] < -25) {
              positions[i + 1] = 25;
              lifetimes[Math.floor(i / 3)] = Math.random() * 2;
            }
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          particles.material.uniforms.time.value = elapsedTime;

          // Calculate opacity for fade-out
          let opacity = 1.0;
          if (elapsedTime > FADE_START) {
            opacity = Math.cos((elapsedTime - FADE_START) / (DURATION - FADE_START) * Math.PI * 0.5);
          }
          particles.material.uniforms.opacity.value = opacity;
          
          renderer.render(scene, camera);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          if (onComplete) {
            onComplete();
          }
        }
      };

      animate();
    };

    init();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
      if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isVisible, onComplete]);

  return (
    <div 
      className="achievement-effect-root"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isVisible ? 'all' : 'none',
        zIndex: 100
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <>
            {/* Dark overlay with longer fade */}
            <motion.div
              className="fixed inset-0"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 101
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            />

            {/* Three.js container */}
            <div 
              ref={containerRef} 
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 102
              }}
            />

            {/* Achievement Text Overlay */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center"
              style={{ zIndex: 103 }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -20 }}
              transition={{ 
                duration: 1.2,
                exit: { duration: 1.5 },
                ease: "easeInOut"
              }}
            >
              <div className="text-center px-4">
                <motion.h1
                  className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FF00] to-[#50FF50] font-orbitron mb-6 select-none"
                  style={{
                    textShadow: '0 0 30px rgba(0,255,0,0.8), 0 0 60px rgba(0,255,0,0.8)'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 30px rgba(0,255,0,0.8), 0 0 60px rgba(0,255,0,0.8)',
                      '0 0 50px rgba(0,255,0,1), 0 0 100px rgba(0,255,0,1)',
                      '0 0 30px rgba(0,255,0,0.8), 0 0 60px rgba(0,255,0,0.8)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {achievementTitle}
                </motion.h1>

                <motion.div
                  className="text-4xl text-white font-exo select-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.0, duration: 1.0 }}
                >
                  <span className="bg-gradient-to-r from-[#00FF00] to-[#50FF50] bg-clip-text text-transparent"
                    style={{
                      textShadow: '0 0 20px rgba(0,255,0,0.8)'
                    }}
                  >
                    {achievementDescription}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

MatrixRainAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string,
  achievementDescription: PropTypes.string
};

export default MatrixRainAchievementEffect; 