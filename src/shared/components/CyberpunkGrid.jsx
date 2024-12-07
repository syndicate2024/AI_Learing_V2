import React, { useEffect } from 'react';
import { EnhancedCyberpunkBackground } from './';

const CyberpunkGrid = () => {
  useEffect(() => {
    // Force grid to be visible initially
    const grid = document.querySelector('.cyberpunk-grid');
    if (grid) {
      grid.style.opacity = '1';
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0 cyberpunk-grid">
      <EnhancedCyberpunkBackground />
    </div>
  );
};

export default CyberpunkGrid; 