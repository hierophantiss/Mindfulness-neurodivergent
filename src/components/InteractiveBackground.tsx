import React, { useEffect, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

export function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to a percentage of window size from 0 to 1
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

    // Initial setting based on arbitrary center point if no mouse
    setMousePosition({ x: 0.5, y: 0.5 });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 ease-out ${theme === 'light' ? 'bg-[#F4F1EA]' : 'bg-[#0d222b]'}`}>
      {/* Base radial gradient */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${theme === 'light' ? 'opacity-0' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a3641] via-[#0d222b] to-[#051014] opacity-100'}`}></div>
      
      {/* Reactive Orbs - Light theme orbs are softer/different colors */}
      <div 
        className={`absolute w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[120px] transition-transform duration-1000 ease-out will-change-transform ${theme === 'light' ? 'bg-teal-200/40 mix-blend-multiply' : 'bg-teal-400/10 mix-blend-lighten'}`}
        style={{
          transform: `translate(${mousePosition.x * 20 - 10}vw, ${mousePosition.y * 20 - 10}vh)`,
          left: '-20%',
          top: '-10%',
        }}
      ></div>

      <div 
        className={`absolute w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] rounded-full blur-[120px] transition-transform duration-1000 ease-out will-change-transform delay-75 ${theme === 'light' ? 'bg-emerald-200/30 mix-blend-multiply' : 'bg-emerald-500/15 mix-blend-lighten'}`}
        style={{
          transform: `translate(${mousePosition.x * -25 + 12}vw, ${mousePosition.y * -15 + 7}vh)`,
          right: '-20%',
          bottom: '-10%',
        }}
      ></div>

      <div 
        className={`absolute w-[50vw] h-[50vw] rounded-full blur-[100px] transition-transform duration-1000 ease-out will-change-transform delay-150 ${theme === 'light' ? 'bg-amber-100/50 mix-blend-multiply' : 'bg-amber-500/10 mix-blend-lighten'}`}
        style={{
          transform: `translate(${mousePosition.x * 30 - 15}vw, ${mousePosition.y * 30 - 15}vh) scale(${isHovering ? 1.05 : 1})`,
          left: '50%',
          top: '40%',
        }}
      ></div>
      
      {/* Subtle noise texture */}
      <div className={`absolute inset-0 mix-blend-overlay ${theme === 'light' ? 'opacity-[0.03]' : 'opacity-[0.06]'} bg-[url('https://grainy-gradients.vercel.app/noise.svg')]`}></div>
    </div>
  );
}
