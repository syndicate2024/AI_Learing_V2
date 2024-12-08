import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const CyberpunkAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "LEVEL UP!", 
  achievementDescription = "Achievement Unlocked" 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    console.log("Achievement effect triggered");

    let scene, camera, renderer, particles;
    let startTime = Date.now();

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      containerRef.current.appendChild(renderer.domElement);

      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load('/assets/particle.png', () => {
        console.log("Particle texture loaded successfully");
      }, undefined, (error) => {
        console.error("Error loading particle texture:", error);
      });

      const geometry = new THREE.BufferGeometry();
      const particleCount = 5000;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for(let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 20;
        const radius = (i / particleCount) * 20;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

        const speed = Math.random() * 10 + 5;
        velocities[i * 3] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * speed;

        const colorChoice = Math.random();
        const color = new THREE.Color(
          colorChoice < 0.33 ? '#FF2E97' : 
          colorChoice < 0.66 ? '#00F6FF' : 
          '#FFD700'
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 8 + 4;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pointTexture: { value: texture }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          uniform float time;
          void main() {
            vColor = color;
            vec3 pos = position;
            pos.x += sin(time * 2.0 + position.z) * 1.0;
            pos.y += cos(time * 2.0 + position.x) * 1.0;
            pos.z += sin(time * 2.0 + position.y) * 1.0;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (500.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
            gl_FragColor = vec4(vColor * 1.5, texColor.a);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      camera.position.z = 50;

      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const DURATION = 4.0;
        
        if (elapsedTime < DURATION) {
          const phase = elapsedTime / DURATION;
          const positions = particles.geometry.attributes.position.array;
          
          for(let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * (1 - phase) * 0.3;
            positions[i + 1] += velocities[i + 1] * (1 - phase) * 0.3;
            positions[i + 2] += velocities[i + 2] * (1 - phase) * 0.3;
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          particles.material.uniforms.time.value = elapsedTime;
          
          particles.rotation.y += 0.006;
          particles.rotation.x += 0.003;
          
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
            {/* Dark overlay */}
            <motion.div
              className="fixed inset-0"
              style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                zIndex: 101
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
              style={{ 
                zIndex: 103
              }}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-center px-4">
                {/* Main Title */}
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
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {achievementTitle}
                </motion.h1>

                {/* Description */}
                <motion.div
                  className="text-4xl text-white font-exo select-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
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

CyberpunkAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string,
  achievementDescription: PropTypes.string
};

export default CyberpunkAchievementEffect; 