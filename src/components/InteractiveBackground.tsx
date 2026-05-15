import React, { useMemo, useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export function InteractiveBackground() {
  const { theme } = useTheme();
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setIsDay(hour >= 6 && hour < 19);
  }, []);

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
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 ease-out bg-[#02040a]`}>
      
      {/* Deep Space Background (Dawn Gradient) */}
      <div 
        className={`absolute inset-0 transition-all duration-[3000ms] opacity-100`}
        style={{
          background: isDay 
            ? 'linear-gradient(to bottom, #112d4e 0%, #3f72af 40%, #dbe2ef 80%, #f9f7f7 100%)'
            : 'linear-gradient(to bottom, #020308 0%, #070b19 40%, #0c1a2f 80%, #0f2438 100%)'
        }}
      />

      {/* Sun / Moon layer */}
      <div className={`absolute top-[10%] ${isDay ? 'left-[20%]' : 'right-[20%]'} transition-all duration-[3000ms] ease-in-out w-32 h-32 md:w-48 md:h-48 rounded-full blur-[2px]`}>
        <div className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-[3000ms] ${isDay ? 'bg-orange-400/30' : 'bg-indigo-400/20'}`} />
        <div className={`w-full h-full rounded-full transition-all duration-[3000ms] ${isDay ? 'bg-gradient-to-br from-[#FFFDE4] to-[#F1C40F] shadow-[0_0_80px_30px_rgba(241,196,15,0.2)]' : 'bg-gradient-to-br from-[#e2e8f0] to-[#94a3b8] shadow-[0_0_60px_20px_rgba(148,163,184,0.15)] shadow-indigo-500/10'}`} />
      </div>

      {/* Stars Layer */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${isDay ? 'opacity-0' : 'opacity-100'}`}>
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
        className={`absolute bottom-0 left-0 right-0 h-[40vh] mix-blend-screen pointer-events-none transition-all duration-1000 opacity-70`}
        style={{
          background: isDay 
            ? 'linear-gradient(to top, rgba(245, 158, 11, 0.2) 0%, rgba(20, 184, 166, 0.05) 40%, transparent 100%)'
            : 'linear-gradient(to top, rgba(20, 184, 166, 0.08) 0%, rgba(99, 102, 241, 0.03) 40%, transparent 100%)'
        }}
      />
    </div>
  );
}
