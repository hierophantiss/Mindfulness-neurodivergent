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
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-1000 ease-out ${theme === 'light' ? 'bg-[#F0EBE1]' : 'bg-pine-900'}`}>
      
      {/* Zen Garden Raked Sand Pattern - SVG Topography / Rings */}
      <svg className={`absolute inset-0 w-full h-full opacity-100 ${theme === 'light' ? 'mix-blend-multiply' : ''}`} preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="sandBump" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor={theme === 'light' ? '#000000' : '#000000'} floodOpacity={theme === 'light' ? '0.15' : '0.4'} />
          </filter>
          <pattern id="sandTrack" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <path d="M 0 20 Q 30 10, 60 20 T 120 20" stroke={sandLineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#sandBump)" />
            <path d="M 0 40 Q 30 30, 60 40 T 120 40" stroke={sandLineColor} strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sandBump)" />
            <path d="M 0 60 Q 30 50, 60 60 T 120 60" stroke={sandLineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#sandBump)" />
            <path d="M 0 80 Q 30 70, 60 80 T 120 80" stroke={sandLineColor} strokeWidth="2" fill="none" strokeLinecap="round" filter="url(#sandBump)" />
            <path d="M 0 100 Q 30 90, 60 100 T 120 100" stroke={sandLineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" filter="url(#sandBump)" />
            <path d="M 0 120 Q 30 110, 60 120 T 120 120" stroke={sandLineColor} strokeWidth="2.5" fill="none" strokeLinecap="round" filter="url(#sandBump)" />
          </pattern>
        </defs>
        
        {/* Animated pattern container */}
        <g className="animate-sand-drift origin-center">
          <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#sandTrack)" />
          
          {/* Large Sand Ripples around "Oases" */}
          <g className="animate-ripples" style={{ transformOrigin: '20% 30%' }}>
            <circle cx="20%" cy="30%" r="20%" stroke={sandLineColor} strokeWidth="1.5" fill="none" strokeDasharray="15 30" filter="url(#sandBump)" />
            <circle cx="20%" cy="30%" r="25%" stroke={sandLineColor} strokeWidth="2.5" fill="none" strokeDasharray="20 40" strokeDashoffset="10" filter="url(#sandBump)" />
            <circle cx="20%" cy="30%" r="30%" stroke={sandLineColor} strokeWidth="1.5" fill="none" strokeDasharray="25 50" strokeDashoffset="20" filter="url(#sandBump)" />
          </g>

          <g className="animate-ripples" style={{ transformOrigin: '80% 60%', animationDelay: '-15s' }}>
            <circle cx="80%" cy="60%" r="15%" stroke={sandLineColor} strokeWidth="1.5" fill="none" strokeDasharray="15 30" filter="url(#sandBump)" />
            <circle cx="80%" cy="60%" r="20%" stroke={sandLineColor} strokeWidth="2" fill="none" strokeDasharray="20 40" strokeDashoffset="10" filter="url(#sandBump)" />
            <circle cx="80%" cy="60%" r="25%" stroke={sandLineColor} strokeWidth="2.5" fill="none" strokeDasharray="25 50" strokeDashoffset="20" filter="url(#sandBump)" />
          </g>
        </g>
      </svg>

      {/* Reactive Orbs - Simulating soft sunlight or moonlight over the garden */}
      <div 
        className={`absolute w-[80vw] h-[80vw] rounded-full blur-[100px] transition-transform duration-1000 ease-out will-change-transform ${theme === 'light' ? 'bg-orange-100/40 mix-blend-multiply' : 'bg-[#e6a15c]/10 mix-blend-screen'}`}
        style={{
          transform: `translate(${mousePosition.x * 20 - 10}vw, ${mousePosition.y * 20 - 10}vh)`,
          left: '-10%',
          top: '-10%',
        }}
      ></div>

      <div 
        className={`absolute w-[60vw] h-[60vw] rounded-full blur-[100px] transition-transform duration-1000 ease-out will-change-transform delay-75 ${theme === 'light' ? 'bg-stone-200/50 mix-blend-multiply' : 'bg-[#788276]/15 mix-blend-screen'}`}
        style={{
          transform: `translate(${mousePosition.x * -20 + 10}vw, ${mousePosition.y * -15 + 7}vh)`,
          right: '-10%',
          bottom: '-10%',
        }}
      ></div>

      {/* Intense sand texturing using procedural fractal noise */}
      <div 
        className={`absolute inset-0 mix-blend-overlay ${theme === 'light' ? 'opacity-40' : 'opacity-[0.15]'}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      ></div>
    </div>
  );
}
