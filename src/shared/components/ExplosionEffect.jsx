import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ExplosionEffect = ({ onComplete }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, particles;
    let startTime = Date.now();

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Create explosion particles
      const geometry = new THREE.BufferGeometry();
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for(let i = 0; i < particleCount; i++) {
        // Initial position (all particles start from center)
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Random velocities in all directions
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 4 + 2; // Increased base speed
        
        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;

        // Alternate between blue and pink particles
        const color = new THREE.Color(i % 2 === 0 ? '#00F6FF' : '#FF2E97');
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.25, // Increased particle size
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      camera.position.z = 5;

      // Animation
      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const DURATION = 3.0; // 3 seconds duration
        
        if (elapsedTime < DURATION) {
          const positions = particles.geometry.attributes.position.array;
          const phase = elapsedTime / DURATION;
          
          // Initial burst followed by gradual slowdown
          const speedFactor = 0.35 * (1 - Math.pow(phase, 1.2));
          
          // Keep full opacity for first 60% then fade
          const opacity = phase < 0.6 ? 1 : Math.cos((phase - 0.6) * (Math.PI / 0.8));
          
          for(let i = 0; i < positions.length; i += 3) {
            positions[i] += velocities[i] * speedFactor;
            positions[i + 1] += velocities[i + 1] * speedFactor;
            positions[i + 2] += velocities[i + 2] * speedFactor;
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          material.opacity = opacity;
          
          renderer.render(scene, camera);
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure cleanup before calling onComplete
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          if (onComplete) {
            onComplete();
          }
        }
      };

      // Start animation
      animate();
    };

    init();

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none" />
  );
};

// Also add default export to maintain compatibility
export default ExplosionEffect;