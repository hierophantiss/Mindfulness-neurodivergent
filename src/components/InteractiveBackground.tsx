import React, { useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';

export function InteractiveBackground() {
  const { theme } = useTheme();

  // Generate static random stars, avoiding hydration mismatch
  const stars = useMemo(() => {
    return Array.from({ length: 250 }).map(() => {
      // More stars at the top, fewer at the horizon (skewing y using pow)
      const y = Math.pow(Math.random(), 1.2) * 100;
      const x = Math.random() * 100;
      // Size varies, some very tiny
      const size = Math.random() * 1.5 + 0.5;
      const opacity = Math.random() * 0.5 + 0.1;
      const blinkDuration = Math.random() * 4 + 3;
      const blinkDelay = Math.random() * 5;
      
      return { x, y, size, opacity, blinkDuration, blinkDelay };
    });
  }, []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 ease-out ${theme === 'light' ? 'bg-[#cbd5e1]' : 'bg-[#02040a]'}`}>
      
      {/* Deep Space Background (Dawn Gradient) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background: 'linear-gradient(to bottom, #020308 0%, #070b19 40%, #0c1a2f 80%, #0f2438 100%)'
        }}
      />

      {/* Stars Layer */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`}>
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              // Using CSS variables for the animation
              '--twinkle-base': star.opacity.toString(),
              '--twinkle-duration': `${star.blinkDuration}s`,
              '--twinkle-delay': `${star.blinkDelay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Very faint mist/glow at the horizon (bottom) to give the "pre-dawn" look */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[40vh] mix-blend-screen pointer-events-none transition-opacity duration-1000 ${theme === 'light' ? 'opacity-0' : 'opacity-70'}`}
        style={{
          background: 'linear-gradient(to top, rgba(20, 184, 166, 0.08) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 100%)'
        }}
      />
    </div>
  );
}
