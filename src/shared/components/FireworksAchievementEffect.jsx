import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const FireworksAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "BOOM!!!", 
  achievementDescription = "YOU ARE AWESOME" 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    console.log("Fireworks achievement effect triggered");

    let scene, camera, renderer;
    let explosions = [];
    let startTime = Date.now();

    const createExplosion = (position) => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 1500;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const delays = new Float32Array(particleCount);

      for(let i = 0; i < particleCount; i++) {
        // Initial position (all particles start from explosion center)
        positions[i * 3] = position.x + (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.3;

        // Random velocities in all directions
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 6 + 3;
        
        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;

        // Random colors for each explosion
        const colorChoice = Math.random();
        const color = new THREE.Color(
          colorChoice < 0.2 ? '#FF2E97' :  // Neon Pink
          colorChoice < 0.4 ? '#00F6FF' :  // Neon Blue
          colorChoice < 0.6 ? '#FFD700' :  // Gold
          colorChoice < 0.8 ? '#66FFFF' :  // Cyan
          colorChoice < 0.9 ? '#FF00FF' :  // Magenta
          '#50FF00'  // Neon Green
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 0.6 + 0.2;
        delays[i] = Math.random() * 0.3;
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
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (350.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform float opacity;
          varying vec3 vColor;
          void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if (r > 0.5) discard;
            float alpha = (0.5 - r) * 2.0 * opacity;
            gl_FragColor = vec4(vColor * 2.0, alpha);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
      });

      const points = new THREE.Points(geometry, material);
      points.startTime = Date.now();
      points.position.copy(position);
      scene.add(points);
      
      return {
        points,
        geometry,
        material,
        velocities,
        delays
      };
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);
      camera.position.z = 15;

      // Schedule multiple explosions
      const explosionTimings = [
        { time: 0, position: new THREE.Vector3(-5, -2, 0) },
        { time: 0.5, position: new THREE.Vector3(5, 3, 0) },
        { time: 1.0, position: new THREE.Vector3(-3, 4, 0) },
        { time: 1.5, position: new THREE.Vector3(4, -3, 0) },
        { time: 2.0, position: new THREE.Vector3(0, 5, 0) },
        { time: 2.5, position: new THREE.Vector3(-4, 0, 0) },
        { time: 3.0, position: new THREE.Vector3(3, 2, 0) }
      ];

      const animate = () => {
        const currentTime = (Date.now() - startTime) / 1000;
        const DURATION = 8.0;
        const FADE_START = 5.0;

        if (currentTime < DURATION) {
          // Create new explosions based on timing
          explosionTimings.forEach(({ time, position }) => {
            if (currentTime >= time && currentTime <= time + 0.1) {
              explosions.push(createExplosion(position));
            }
          });

          // Update existing explosions
          explosions.forEach((explosion, index) => {
            const elapsedTime = (Date.now() - explosion.points.startTime) / 1000;
            const positions = explosion.points.geometry.attributes.position.array;
            
            const speedMultiplier = Math.max(0.1, 1 - elapsedTime * 0.3);
            
            for(let i = 0; i < positions.length; i += 3) {
              if (elapsedTime > explosion.delays[Math.floor(i / 3)]) {
                positions[i] += explosion.velocities[i] * speedMultiplier * 0.1;
                positions[i + 1] += explosion.velocities[i + 1] * speedMultiplier * 0.1;
                positions[i + 2] += explosion.velocities[i + 2] * speedMultiplier * 0.1;
              }
            }

            explosion.points.geometry.attributes.position.needsUpdate = true;

            // Calculate opacity
            let opacity = 1.0;
            if (currentTime > FADE_START) {
              opacity = Math.cos((currentTime - FADE_START) / (DURATION - FADE_START) * Math.PI * 0.5);
            }
            explosion.material.uniforms.opacity.value = opacity;

            explosion.points.rotation.y += 0.002 * speedMultiplier;
            explosion.points.rotation.x += 0.001 * speedMultiplier;
          });

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
      explosions.forEach(explosion => {
        explosion.geometry.dispose();
        explosion.material.dispose();
      });
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

FireworksAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string,
  achievementDescription: PropTypes.string
};

export default FireworksAchievementEffect; 