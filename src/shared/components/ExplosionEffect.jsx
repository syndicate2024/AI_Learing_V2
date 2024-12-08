import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

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
      const particleCount = 3000;
      const positions = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const delays = new Float32Array(particleCount);

      for(let i = 0; i < particleCount; i++) {
        // Initial position (all particles start from center)
        positions[i * 3] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

        // Random velocities in all directions
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = Math.random() * 6 + 3;
        
        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;

        // Random colors between blue and pink with some gold particles
        const colorChoice = Math.random();
        const color = new THREE.Color(
          colorChoice < 0.4 ? '#00F6FF' : 
          colorChoice < 0.8 ? '#FF2E97' : 
          '#FFD700'
        );
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Larger particle sizes for more visibility
        sizes[i] = Math.random() * 0.6 + 0.2;

        // Longer staggered explosion delays
        delays[i] = Math.random() * 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Create a bright particle texture
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.CanvasTexture(canvas);

      const material = new THREE.ShaderMaterial({
        uniforms: {
          pointTexture: { value: texture },
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          uniform float time;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (350.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform sampler2D pointTexture;
          varying vec3 vColor;
          void main() {
            vec4 texColor = texture2D(pointTexture, gl_PointCoord);
            gl_FragColor = vec4(vColor * 2.0, texColor.a);
          }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      camera.position.z = 15;

      // Animation
      const animate = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const DURATION = 4.0;
        
        if (elapsedTime < DURATION) {
          const positions = particles.geometry.attributes.position.array;
          const phase = elapsedTime / DURATION;
          
          // Modified speed curve for longer visible explosion
          const speedCurve = Math.pow(1 - phase, 1.2) * Math.exp(-phase * 1.2);
          const speedFactor = 0.6 * speedCurve;
          
          // Modified opacity curve - slower fade out
          const opacity = Math.min(1, 2 * (1 - Math.pow(phase, 1.5)));
          
          for(let i = 0; i < positions.length; i += 3) {
            const particleDelay = delays[Math.floor(i / 3)];
            if (elapsedTime > particleDelay) {
              const adjustedPhase = (elapsedTime - particleDelay) / DURATION;
              const particleSpeed = speedFactor * (1 + Math.sin(adjustedPhase * Math.PI * 0.8));
              
              positions[i] += velocities[i] * particleSpeed;
              positions[i + 1] += velocities[i + 1] * particleSpeed;
              positions[i + 2] += velocities[i + 2] * particleSpeed;
            }
          }
          
          particles.geometry.attributes.position.needsUpdate = true;
          particles.material.opacity = opacity;
          particles.material.uniforms.time.value = elapsedTime;
          
          // Slower rotation for better visibility
          particles.rotation.y += 0.001 * (1 - phase);
          particles.rotation.x += 0.0005 * (1 - phase);
          
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
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none" />
  );
};

ExplosionEffect.propTypes = {
  onComplete: PropTypes.func
};

export default ExplosionEffect;