import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const DataStormAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "DATA STORM", 
  achievementDescription = "Master of the Digital Tempest" 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    console.log("Data Storm effect triggered");

    let scene, camera, renderer, particles, lightning;
    let startTime = Date.now();
    let lightningTime = 0;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Create storm particles
      const geometry = new THREE.BufferGeometry();
      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const angles = new Float32Array(particleCount);
      const radiuses = new Float32Array(particleCount);
      const speeds = new Float32Array(particleCount);

      for(let i = 0; i < particleCount; i++) {
        // Spiral placement with height variation
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 20 + 10;
        const height = (Math.random() - 0.5) * 20;
        
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        angles[i] = angle;
        radiuses[i] = radius;
        speeds[i] = Math.random() * 1 + 0.5;

        // Electric color palette
        const colorChoice = Math.random();
        const color = new THREE.Color(
          colorChoice < 0.3 ? '#00FFFF' :  // Cyan
          colorChoice < 0.6 ? '#4169E1' :  // Royal Blue
          colorChoice < 0.8 ? '#1E90FF' :  // Dodger Blue
          '#87CEEB'  // Sky Blue
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 1;
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
            vOpacity = sin(time * 3.0 + position.y * 0.5) * 0.3 + 0.7;
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

      // Create lightning group
      lightning = new THREE.Group();
      scene.add(lightning);

      camera.position.z = 40;

      const createLightningBolt = () => {
        const points = [];
        const startPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          20,
          (Math.random() - 0.5) * 40
        );
        const endPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          -20,
          (Math.random() - 0.5) * 40
        );
        
        points.push(startPoint);
        
        // Create jagged path
        let currentPoint = startPoint.clone();
        const segments = Math.floor(Math.random() * 3) + 3;
        for(let i = 0; i < segments; i++) {
          const t = (i + 1) / (segments + 1);
          const targetPoint = new THREE.Vector3().lerpVectors(startPoint, endPoint, t);
          
          // Add randomness to path
          targetPoint.x += (Math.random() - 0.5) * 10;
          targetPoint.z += (Math.random() - 0.5) * 10;
          
          points.push(targetPoint);
          currentPoint = targetPoint;
        }
        
        points.push(endPoint);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: 0x00FFFF,
          transparent: true,
          opacity: 0.8
        });
        
        const bolt = new THREE.Line(geometry, material);
        bolt.userData.lifeTime = Math.random() * 0.5 + 0.2;
        bolt.userData.birthTime = lightningTime;
        return bolt;
      };

      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const DURATION = 8.0;
        const FADE_START = 6.0;
        
        if (elapsedTime < DURATION) {
          const positions = particles.geometry.attributes.position.array;
          lightningTime = elapsedTime;
          
          // Update storm particles
          for(let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            const speed = speeds[i];
            angles[i] += speed * 0.02;
            
            const radius = radiuses[i] + Math.sin(elapsedTime * 2 + angles[i]) * 2;
            positions[idx] = Math.cos(angles[i]) * radius;
            positions[idx + 2] = Math.sin(angles[i]) * radius;
            
            positions[idx + 1] += Math.sin(elapsedTime * 3 + angles[i]) * 0.1;
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          particles.material.uniforms.time.value = elapsedTime;
          
          // Create new lightning bolts
          if(Math.random() < 0.1) {
            lightning.add(createLightningBolt());
          }

          // Update existing lightning
          lightning.children.forEach((bolt, index) => {
            const boltAge = lightningTime - bolt.userData.birthTime;
            if(boltAge > bolt.userData.lifeTime) {
              lightning.remove(bolt);
              bolt.geometry.dispose();
              bolt.material.dispose();
            } else {
              bolt.material.opacity = Math.sin(boltAge / bolt.userData.lifeTime * Math.PI);
            }
          });

          // Rotate entire scene
          scene.rotation.y += 0.002;
          
          // Camera movement
          camera.position.y = Math.sin(elapsedTime * 0.5) * 5;
          camera.lookAt(scene.position);

          // Calculate fade-out
          let opacity = 1.0;
          if (elapsedTime > FADE_START) {
            opacity = Math.cos((elapsedTime - FADE_START) / (DURATION - FADE_START) * Math.PI * 0.5);
          }
          particles.material.uniforms.opacity.value = opacity;
          lightning.children.forEach(bolt => {
            bolt.material.opacity *= opacity;
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
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
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
              className="flex fixed inset-0 justify-center items-center"
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
              <div className="px-4 text-center">
                <motion.h1
                  className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] to-[#4169E1] font-orbitron mb-6 select-none"
                  style={{
                    textShadow: '0 0 30px rgba(0,255,255,0.8), 0 0 60px rgba(65,105,225,0.8)'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 30px rgba(0,255,255,0.8), 0 0 60px rgba(65,105,225,0.8)',
                      '0 0 50px rgba(0,255,255,1), 0 0 100px rgba(65,105,225,1)',
                      '0 0 30px rgba(0,255,255,0.8), 0 0 60px rgba(65,105,225,0.8)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {achievementTitle}
                </motion.h1>

                <motion.div
                  className="text-4xl text-white select-none font-exo"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.0, duration: 1.0 }}
                >
                  <span className="bg-gradient-to-r from-[#00FFFF] to-[#4169E1] bg-clip-text text-transparent"
                    style={{
                      textShadow: '0 0 20px rgba(0,255,255,0.8)'
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

DataStormAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string,
  achievementDescription: PropTypes.string
};

export default DataStormAchievementEffect; 