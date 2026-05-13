import React, { useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseenter', handleMouseEnter);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    setMousePosition({ x: 0.5, y: 0.5 });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Make the lines pop more depending on theme
  const sandLineColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 ease-out ${theme === 'light' ? 'bg-[#F0EBE1]' : 'bg-transparent'}`}>
      
      {/* Simplified Soft Orbs - Only gradients, no distracting patterns */}
      <div 
        className={`absolute w-[100vw] h-[100vw] rounded-full blur-[120px] transition-transform duration-[3000ms] ease-out will-change-transform ${theme === 'light' ? 'bg-orange-100/30' : 'bg-[#e6a15c]/05'}`}
        style={{
          transform: `translate(${mousePosition.x * 15 - 7}vw, ${mousePosition.y * 15 - 7}vh)`,
          left: '-20%',
          top: '-20%',
        }}
      ></div>

      <div 
        className={`absolute w-[80vw] h-[80vw] rounded-full blur-[120px] transition-transform duration-[3000ms] ease-out will-change-transform delay-150 ${theme === 'light' ? 'bg-stone-200/40' : 'bg-[#788276]/10'}`}
        style={{
          transform: `translate(${mousePosition.x * -15 + 7}vw, ${mousePosition.y * -10 + 5}vh)`,
          right: '-15%',
          bottom: '-15%',
        }}
      ></div>

      {/* Subtle Dust / Dust Particles for ambient calm breathing */}
      <div className="absolute inset-0 mix-blend-screen opacity-40">
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white blur-[2px] animate-particle-float"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * -20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      {/* Intense sand texturing using procedural fractal noise */}
      <div 
        className={`absolute inset-0 mix-blend-overlay ${theme === 'light' ? 'opacity-40' : 'opacity-[0.12]'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      ></div>
    </div>
  );
}
