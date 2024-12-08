import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const CyberVortexAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "CYBER VORTEX", 
  achievementDescription = "You've mastered the digital whirlwind" 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    console.log("Cyber Vortex effect triggered");

    let scene, camera, renderer, particles;
    let startTime = Date.now();

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Create vortex particles
      const geometry = new THREE.BufferGeometry();
      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const angles = new Float32Array(particleCount);
      const radiuses = new Float32Array(particleCount);
      const speeds = new Float32Array(particleCount);

      for(let i = 0; i < particleCount; i++) {
        // Initial spiral placement
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 15 + 5;
        const height = (Math.random() - 0.5) * 20;
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        // Store initial angles and radiuses for animation
        angles[i] = angle;
        radiuses[i] = radius;
        speeds[i] = Math.random() * 0.5 + 0.5; // Random rotation speeds

        // Cyberpunk color palette
        const colorChoice = Math.random();
        const color = new THREE.Color(
          colorChoice < 0.3 ? '#FF2E97' :  // Neon Pink
          colorChoice < 0.6 ? '#00F6FF' :  // Neon Blue
          colorChoice < 0.8 ? '#9D00FF' :  // Neon Purple
          '#FF00FF'  // Magenta
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 1;
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
            vOpacity = sin(time * 2.0 + position.x * 0.5) * 0.3 + 0.7;
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec3 vColor;
          varying float vOpacity;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (r > 0.5) discard;
            float glow = 1.0 - (r * 2.0);
            gl_FragColor = vec4(vColor * 1.5, vOpacity * opacity * glow);
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
          
          // Update particle positions in a spiral pattern
          for(let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const speed = speeds[i];
            angles[i] += speed * 0.02; // Rotate around center
            
            // Spiral movement
            const radius = radiuses[i] + Math.sin(elapsedTime * 2 + angles[i]) * 2;
            positions[idx] = Math.cos(angles[i]) * radius;
            positions[idx + 2] = Math.sin(angles[i]) * radius;
            
            // Vertical oscillation
            positions[idx + 1] += Math.sin(elapsedTime * 3 + angles[i]) * 0.05;
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          particles.material.uniforms.time.value = elapsedTime;
          
          // Camera movement
          camera.position.y = Math.sin(elapsedTime * 0.5) * 2;
          camera.lookAt(scene.position);
          
          // Particle system rotation
          particles.rotation.y += 0.003;
          particles.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;

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
                  className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] font-orbitron mb-6 select-none"
                  style={{
                    textShadow: '0 0 30px rgba(255,46,151,0.8), 0 0 60px rgba(0,246,255,0.8)'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 30px rgba(255,46,151,0.8), 0 0 60px rgba(0,246,255,0.8)',
                      '0 0 50px rgba(255,46,151,1), 0 0 100px rgba(0,246,255,1)',
                      '0 0 30px rgba(255,46,151,0.8), 0 0 60px rgba(0,246,255,0.8)',
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
                  <span className="bg-gradient-to-r from-[#FF2E97] to-[#00F6FF] bg-clip-text text-transparent"
                    style={{
                      textShadow: '0 0 20px rgba(255,255,255,0.8)'
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

CyberVortexAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string,
  achievementDescription: PropTypes.string
};

export default CyberVortexAchievementEffect; 