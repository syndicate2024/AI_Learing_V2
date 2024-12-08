import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import PropTypes from 'prop-types';

const NeuralNetworkAchievementEffect = ({ 
  isVisible, 
  onComplete, 
  achievementTitle = "NEURAL MASTER", 
  achievementDescription = "Neural Network Mastery Achieved" 
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;
    console.log("Neural Network effect triggered");

    let scene, camera, renderer, nodes, connections, pulses;
    let startTime = Date.now();

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Create neural network nodes
      const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0x9D00FF,
        transparent: true,
        opacity: 0.8
      });

      nodes = new THREE.Group();
      const nodePositions = [];
      const nodeCount = 20;

      // Create nodes in a 3D space
      for(let i = 0; i < nodeCount; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
        node.position.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        );
        nodes.add(node);
        nodePositions.push(node.position);
      }

      scene.add(nodes);

      // Create connections between nodes
      connections = new THREE.Group();
      const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0x9D00FF,
        transparent: true,
        opacity: 0.3
      });

      for(let i = 0; i < nodeCount; i++) {
        for(let j = i + 1; j < nodeCount; j++) {
          const distance = nodePositions[i].distanceTo(nodePositions[j]);
          if(distance < 15) { // Only connect nearby nodes
            const geometry = new THREE.BufferGeometry().setFromPoints([
              nodePositions[i],
              nodePositions[j]
            ]);
            const line = new THREE.Line(geometry, connectionMaterial.clone());
            connections.add(line);
          }
        }
      }

      scene.add(connections);

      // Create energy pulses
      pulses = new THREE.Group();
      const pulseGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF00FF,
        transparent: true,
        opacity: 0.8
      });

      // Create pulses for each connection
      connections.children.forEach(connection => {
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
        pulse.userData.startPoint = connection.geometry.attributes.position.array.slice(0, 3);
        pulse.userData.endPoint = connection.geometry.attributes.position.array.slice(3, 6);
        pulse.userData.progress = Math.random(); // Random starting point
        pulse.userData.speed = Math.random() * 0.5 + 0.5; // Random speed
        pulses.add(pulse);
      });

      scene.add(pulses);

      camera.position.z = 40;

      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const DURATION = 8.0;
        const FADE_START = 6.0;
        
        if (elapsedTime < DURATION) {
          // Rotate entire network
          nodes.rotation.y += 0.002;
          connections.rotation.y += 0.002;
          pulses.rotation.y += 0.002;

          // Pulse nodes
          nodes.children.forEach((node, i) => {
            node.scale.setScalar(1 + Math.sin(elapsedTime * 2 + i) * 0.2);
            node.material.opacity = 0.5 + Math.sin(elapsedTime * 2 + i) * 0.3;
          });

          // Animate connection opacity
          connections.children.forEach((connection, i) => {
            connection.material.opacity = 0.2 + Math.sin(elapsedTime * 2 + i) * 0.1;
          });

          // Move pulses along connections
          pulses.children.forEach(pulse => {
            pulse.userData.progress += pulse.userData.speed * 0.01;
            if(pulse.userData.progress > 1) pulse.userData.progress = 0;

            const t = pulse.userData.progress;
            pulse.position.set(
              pulse.userData.startPoint[0] * (1 - t) + pulse.userData.endPoint[0] * t,
              pulse.userData.startPoint[1] * (1 - t) + pulse.userData.endPoint[1] * t,
              pulse.userData.startPoint[2] * (1 - t) + pulse.userData.endPoint[2] * t
            );
            pulse.material.opacity = Math.sin(t * Math.PI) * 0.8;
          });

          // Calculate fade-out
          let opacity = 1.0;
          if (elapsedTime > FADE_START) {
            opacity = Math.cos((elapsedTime - FADE_START) / (DURATION - FADE_START) * Math.PI * 0.5);
            scene.children.forEach(child => {
              if(child.type === 'Group') {
                child.children.forEach(mesh => {
                  if(mesh.material) {
                    mesh.material.opacity *= opacity;
                  }
                });
              }
            });
          }
          
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
                  className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9D00FF] to-[#FF00FF] font-orbitron mb-6 select-none"
                  style={{
                    textShadow: '0 0 30px rgba(157,0,255,0.8), 0 0 60px rgba(255,0,255,0.8)'
                  }}
                  animate={{
                    textShadow: [
                      '0 0 30px rgba(157,0,255,0.8), 0 0 60px rgba(255,0,255,0.8)',
                      '0 0 50px rgba(157,0,255,1), 0 0 100px rgba(255,0,255,1)',
                      '0 0 30px rgba(157,0,255,0.8), 0 0 60px rgba(255,0,255,0.8)',
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
                  <span className="bg-gradient-to-r from-[#9D00FF] to-[#FF00FF] bg-clip-text text-transparent"
                    style={{
                      textShadow: '0 0 20px rgba(157,0,255,0.8)'
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

NeuralNetworkAchievementEffect.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  achievementTitle: PropTypes.string,
  achievementDescription: PropTypes.string
};

export default NeuralNetworkAchievementEffect; 