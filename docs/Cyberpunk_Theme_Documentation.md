# Cyberpunk Theme Documentation

## 1. Core Effects

### Video Background
- Circuit board video background with seamless transitions
- Interactive matrix-like data streams
- Mouse-following glow effect
- Keyboard interaction effects with light flashes
- Holographic overlays and scanlines

### Interactive Elements
- Mouse tracking with radial glow
- Data streams that respond to mouse movement
- Keyboard input creates light flashes and glitch effects
- Smooth transitions between states
- Layered effects for depth

### Animations
- Matrix-style data streams
- Glitch effects on state changes
- Hologram scanning effect
- Neon glow pulses
- Scanline overlays
- Interactive keyboard flashes
- Mouse-following effects

## 2. Colors
- Neon Blue (`#00F6FF`)
- Neon Pink (`#FF2E97`)
- Dark Background (`#0A0F1B`)
- Secondary Dark (`#1A0B2E`)
- White (`#FFFFFF`)
- Transparent overlays:
  - Light: `rgba(255, 255, 255, 0.1)`
  - Dark: `rgba(0, 0, 0, 0.4)`

## 3. Typography
- Primary Font (Headings): Orbitron
  - Used for all headings (h1-h6)
  - Bold weights for emphasis
  - Often paired with glitch effects
- Secondary Font (Body): Exo 2
  - Default font for body text
  - Excellent readability
  - Used for forms and general text

## 4. Effects Classes

### Text Effects
```css
.glitch-text
.cyberpunk-title
.cyberpunk-text
```

### Visual Effects
```css
.bg-scanline
.data-stream
.neon-glow
.hologram
```

## 5. Implementation Guidelines

### Background Video
- Should be used on main pages (login, dashboard)
- Transitions smoothly between states
- Includes interactive elements
- Layered with other effects

### Interactive Elements
- Mouse tracking should be smooth
- Keyboard effects should enhance not distract
- Effects should layer without overwhelming
- Performance optimized for smooth animations

### Best Practices
1. Layer effects for depth
2. Use transitions between states
3. Keep performance in mind
4. Ensure accessibility
5. Maintain consistent theme across components

## 6. Component Examples

### Video Background
```jsx
<VideoBackground isLoginScreen={true} />
```

### Interactive Elements
```jsx
<div className="neon-glow">
<h1 className="glitch-text" data-text="Your Text">Your Text</h1>
</div>
```

## 7. Animation Timings
- Video transitions: 1000ms
- Glitch effects: 100ms
- Keyboard flashes: 500ms
- Mouse glow: Instant follow
- Data streams: 4000ms cycle
- Hologram scan: 3000ms cycle

## 8. Performance Considerations
- Use `transform` for animations where possible
- Implement `will-change` for heavy animations
- Throttle mouse move events
- Use `requestAnimationFrame` for smooth animations
- Optimize video playback

## 9. Accessibility
- Ensure sufficient contrast
- Provide reduced motion options
- Maintain readability
- Keep interactive elements obvious
- Support keyboard navigation
