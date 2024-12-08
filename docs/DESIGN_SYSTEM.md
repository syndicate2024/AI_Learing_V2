# Cyberpunk Design System

## 🎨 Color Palette

### Primary Colors
- `#FF2E97` - Neon Pink
- `#00F6FF` - Neon Blue
- `#00FF00` - Matrix Green
- `#9D00FF` - Neon Purple
- `#FF00FF` - Magenta
- `#00FFFF` - Cyan
- `#4169E1` - Royal Blue
- `#FFD700` - Gold

### Background Colors
- `#0A0F1B` - Dark Background
- `#1A0B2E` - Dark Purple Background
- `rgba(0, 0, 0, 0.95)` - Overlay Black

### Gradients
```css
/* Primary Gradient */
background: linear-gradient(to right, #FF2E97, #00F6FF);

/* Matrix Gradient */
background: linear-gradient(to right, #00FF00, #50FF50);

/* Neural Network Gradient */
background: linear-gradient(to right, #9D00FF, #FF00FF);

/* Data Storm Gradient */
background: linear-gradient(to right, #00FFFF, #4169E1);

/* Fireworks Gradient */
background: linear-gradient(to right, #FFD700, #FF2E97);
```

## 🎭 Typography

### Fonts
- **Primary**: Orbitron (Headings)
- **Secondary**: Exo (Body text)

### Text Effects
```css
/* Neon Text Glow */
text-shadow: 0 0 30px rgba(255,46,151,0.8), 0 0 60px rgba(0,246,255,0.8);

/* Matrix Text Glow */
text-shadow: 0 0 30px rgba(0,255,0,0.8), 0 0 60px rgba(0,255,0,0.8);

/* Neural Network Text Glow */
text-shadow: 0 0 30px rgba(157,0,255,0.8), 0 0 60px rgba(255,0,255,0.8);

/* Data Storm Text Glow */
text-shadow: 0 0 30px rgba(0,255,255,0.8), 0 0 60px rgba(65,105,225,0.8);
```

## 🎮 Achievement Effects

### 1. Master Hacker (Cyberpunk Effect)
- **Type**: `CyberpunkAchievementEffect`
- **Colors**: Neon Pink (#FF2E97) to Neon Blue (#00F6FF)
- **Particles**: 3000 particles with explosion pattern
- **Duration**: 8 seconds
- **Features**:
  - Explosive particle burst
  - Color transitions
  - Smooth fade-out
  - Rotating particle system

### 2. Boom!!! (Fireworks Effect)
- **Type**: `FireworksAchievementEffect`
- **Colors**: Gold (#FFD700) to Neon Pink (#FF2E97)
- **Particles**: Multiple bursts of 2000 particles
- **Duration**: 8 seconds
- **Features**:
  - Multiple explosion points
  - Timed sequence of bursts
  - Particle color variations
  - Gravity simulation

### 3. Matrix Master (Matrix Rain Effect)
- **Type**: `MatrixRainAchievementEffect`
- **Colors**: Matrix Green variations (#00FF00, #50FF50)
- **Particles**: 5000 falling characters
- **Duration**: 8 seconds
- **Features**:
  - Digital rain simulation
  - Character variations
  - Speed variations
  - Opacity pulsing

### 4. Cyber Vortex (Swirling Effect)
- **Type**: `CyberVortexAchievementEffect`
- **Colors**: Neon Purple (#9D00FF) to Magenta (#FF00FF)
- **Particles**: 3000 particles in spiral formation
- **Duration**: 8 seconds
- **Features**:
  - Spiral particle movement
  - Dynamic radius changes
  - Camera movement
  - Color transitions

### 5. Neural Network (Network Effect)
- **Type**: `NeuralNetworkAchievementEffect`
- **Colors**: Neon Purple (#9D00FF) to Magenta (#FF00FF)
- **Nodes**: 20 interconnected nodes
- **Duration**: 8 seconds
- **Features**:
  - Dynamic node connections
  - Energy pulses
  - Node pulsing
  - Network rotation

### 6. Data Storm (Electric Effect)
- **Type**: `DataStormAchievementEffect`
- **Colors**: Cyan (#00FFFF) to Royal Blue (#4169E1)
- **Particles**: 2000 storm particles + lightning
- **Duration**: 8 seconds
- **Features**:
  - Swirling particle storm
  - Lightning bolts
  - Dynamic camera movement
  - Electric color palette

## 🎴 Achievement Cards

### Card Structure
```jsx
<motion.div
  className="achievement-card"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05, y: -5 }}
>
  {/* Card Content */}
</motion.div>
```

### Card Styling
```css
.achievement-card {
  /* Base Styles */
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.95));
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  overflow: hidden;
  
  /* Shadow */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
  
  /* Transitions */
  transition: all 0.3s ease;
}

/* Hover Effects */
.achievement-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  transform: translateY(-4px) scale(1.05);
}
```

### Progress Bar
```css
.progress-bar {
  width: 100%;
  height: 2.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 9999px;
  padding: 0.125rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(to right, var(--from-color), var(--to-color));
  transition: width 1s ease;
}
```

## 🌟 Animation Timings

### Standard Transitions
- Quick: 0.2s ease
- Normal: 0.3s ease
- Smooth: 0.5s ease-in-out
- Long: 0.8s ease-out

### Achievement Effects
- Total Duration: 8.0s
- Fade Start: 6.0s
- Text Delay: 2.0s
- Exit Duration: 1.5s

### Hover Effects
- Scale: transform 0.3s ease
- Glow: opacity 0.3s ease
- Movement: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)

## 🎮 Usage Examples

### Achievement Card Implementation
```jsx
const AchievementCard = ({ achievement }) => (
  <motion.div
    className={`
      relative overflow-hidden rounded-lg border-2 border-white/20 
      shadow-lg transition-all duration-300 cursor-pointer
      ${achievement.effect === 'none' 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:shadow-xl hover:scale-105 hover:-translate-y-1'
      }
    `}
    style={{
      background: 'linear-gradient(to bottom right, rgba(0, 0, 0, 0.97), rgba(0, 0, 0, 0.95))',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)'
    }}
  >
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10 bg-pattern" />
    
    {/* Glow Effect */}
    <div className={`absolute inset-0 bg-gradient-to-r ${achievement.theme} opacity-30`} />
    
    {/* Content */}
    <div className="relative z-10 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.theme} flex items-center justify-center shadow-lg text-2xl`}>
          {achievement.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{achievement.title}</h3>
          <p className="text-white/80">{achievement.description}</p>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden p-0.5">
        <motion.div 
          className={`h-full rounded-full bg-gradient-to-r ${achievement.theme}`}
          initial={{ width: 0 }}
          animate={{ width: `${achievement.progress}%` }}
        />
      </div>
    </div>
  </motion.div>
);
```

## 🛠 Best Practices

1. **Performance**
   - Use `transform` and `opacity` for animations
   - Implement proper cleanup in effects
   - Dispose of THREE.js resources
   - Use motion.div for simple animations

2. **Accessibility**
   - Maintain proper contrast ratios
   - Include proper ARIA labels
   - Ensure keyboard navigation
   - Provide alternative text

3. **Responsiveness**
   - Use relative units (rem, em)
   - Implement proper breakpoints
   - Test on various screen sizes
   - Optimize effects for mobile

4. **Code Organization**
   - Separate effects into components
   - Reuse color and animation constants
   - Follow consistent naming conventions
   - Document complex animations

## 🔄 Updates and Maintenance

1. **Adding New Effects**
   - Follow existing patterns
   - Document all parameters
   - Include cleanup logic
   - Test performance

2. **Modifying Effects**
   - Update documentation
   - Test all variations
   - Maintain compatibility
   - Version control changes

3. **Performance Monitoring**
   - Track frame rates
   - Monitor memory usage
   - Profile render times
   - Optimize as needed

## 🎬 Animations & Transitions Guide

### Core Animation Principles

1. **Smoothness**
```javascript
// Use cubic-bezier for natural movement
transition: {
  type: "spring",
  stiffness: 260,
  damping: 20
}

// Smooth easing for UI elements
transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
```

2. **Cyberpunk Glitch Effects**
```javascript
const glitchVariants = {
  initial: { x: 0, opacity: 1 },
  glitch: {
    x: [0, -2, 2, -2, 0],
    opacity: [1, 0.8, 0.9, 0.7, 1],
    transition: {
      duration: 0.2,
      times: [0, 0.2, 0.4, 0.6, 1]
    }
  }
}
```

### Motion Variants Library

1. **Fade Animations**
```javascript
// Fade In Up
const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

// Fade Scale
const fadeScale = {
  initial: { scale: 0.95, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
}
```

2. **Hover Effects**
```javascript
// Glow Hover
const glowHover = {
  initial: {
    boxShadow: "0 0 0 rgba(255,46,151,0)"
  },
  hover: {
    boxShadow: [
      "0 0 20px rgba(255,46,151,0.3)",
      "0 0 35px rgba(255,46,151,0.5)",
      "0 0 20px rgba(255,46,151,0.3)"
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
}

// Scale Hover
const scaleHover = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
}
```

### Page Transitions

1. **Route Changes**
```javascript
// Page Transition Wrapper
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  enter: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
}

// Usage
<AnimatePresence mode="wait">
  <motion.div
    key={router.route}
    variants={pageVariants}
    initial="initial"
    animate="enter"
    exit="exit"
  >
    {children}
  </motion.div>
</AnimatePresence>
```

2. **Modal Transitions**
```javascript
const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}
```

### Stagger Animations

1. **List Items**
```javascript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Usage
<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### Loading States

1. **Cyberpunk Spinner**
```javascript
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity
    }
  }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
}
```

### Gesture Animations

1. **Interactive Elements**
```javascript
const buttonVariants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 0 25px rgba(255,46,151,0.5)",
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

// Usage
<motion.button
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
>
  Click Me
</motion.button>
```

### Performance Optimization

1. **Layout Animations**
```javascript
// Use layoutId for smooth transitions between different components
<motion.div
  layoutId="shared-element"
  layout // Animate layout changes
  transition={{
    layout: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }}
>
  {content}
</motion.div>
```

2. **Animation Best Practices**
```javascript
// Use transform instead of left/top
const goodAnimation = {
  animate: {
    transform: "translateX(100px)",
    scale: 1.1
  }
}

// Avoid animating layout properties
const badAnimation = {
  animate: {
    width: "100px", // Avoid
    height: "100px" // Avoid
  }
}
```

### Responsive Animations

```javascript
const responsiveVariants = {
  initial: { scale: 0.9 },
  animate: {
    scale: 1,
    transition: {
      duration: window.innerWidth < 768 ? 0.2 : 0.4
    }
  }
}

// Disable animations on reduced motion preference
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const accessibleVariants = {
  animate: {
    x: prefersReducedMotion.matches ? 0 : 100,
    transition: {
      duration: prefersReducedMotion.matches ? 0 : 0.5
    }
  }
}
```