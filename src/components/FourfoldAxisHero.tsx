import React, { useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Axis } from '../data/types';

export interface FourfoldAxisHeroProps {
  activeAxis?: Axis | 'focus' | null;
}

export const FourfoldAxisHero: React.FC<FourfoldAxisHeroProps> = ({ activeAxis = null }) => {
  const { language } = useLanguage();
  const ariaLabel = language === 'el' ? 'Ο Τετραπλός Άξονας' : 'The Fourfold Axis';

  // Read reduce-motion preference
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const checkMotion = () => {
      const stored = localStorage.getItem('n_mindfulness_reduce_motion');
      if (stored !== null) {
        setReduceMotion(stored === 'true');
        return;
      }
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReduceMotion(mediaQuery.matches);
    };
    checkMotion();
    window.addEventListener('storage', checkMotion);
    return () => window.removeEventListener('storage', checkMotion);
  }, []);

  const isSpaceActive = activeAxis === 'space';

  const getOpacity = (axisName: string) => {
    if (!activeAxis) return 0.45;
    return activeAxis === axisName ? 1 : 0.18;
  };

  const getAttentionOpacity = () => {
    if (!activeAxis) return 0.45;
    return (activeAxis === 'focus' || activeAxis === 'attention') ? 1 : 0.18;
  };

  return (
    <svg 
      viewBox="0 0 340 420" 
      width="100%" 
      height="auto" 
      role="img" 
      aria-label={ariaLabel}
      className="block"
    >
      <defs>
        <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="20%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="60%" stopColor="#14b8a6" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <clipPath id="earth-clip">
          <circle cx="170" cy="565" r="205" />
        </clipPath>

        <style>
          {`
            .axis-layer {
              transition: opacity 0.5s ease-in-out;
            }
            @keyframes pulseRays {
              0% { transform: scale(0.92); opacity: 0.6; }
              100% { transform: scale(1.07); opacity: 1; }
            }
            .space-rays {
              transform-origin: 170px 205px;
            }
            .animate-rays {
              animation: pulseRays 5s ease-in-out infinite alternate;
            }
          `}
        </style>
      </defs>

      {/* 1. Background stars */}
      <circle cx="45" cy="80" r="1.5" fill="#cdd6f4" opacity="0.6" />
      <circle cx="290" cy="120" r="1.2" fill="#cdd6f4" opacity="0.5" />
      <circle cx="80" cy="240" r="1.5" fill="#cdd6f4" opacity="0.7" />
      <circle cx="260" cy="300" r="1.2" fill="#cdd6f4" opacity="0.5" />
      <circle cx="140" cy="40" r="1" fill="#cdd6f4" opacity="0.6" />

      {/* 2. SPACE RAYS BEHIND FIGURE */}
      <g 
        className="axis-layer space-rays" 
        style={{ opacity: getOpacity('space') }}
      >
        <g className={(!reduceMotion && isSpaceActive) ? 'animate-rays' : ''}>
          {[...Array(10)].map((_, i) => {
            const angle = (i * 36) * (Math.PI / 180);
            const x2 = 170 + Math.cos(angle) * 150;
            const y2 = 205 + Math.sin(angle) * 150;
            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];
            return (
              <line 
                key={i} 
                x1="170" 
                y1="205" 
                x2={x2} 
                y2={y2} 
                stroke={colors[i % colors.length]} 
                strokeWidth="2" 
                opacity="0.3" 
              />
            );
          })}
        </g>
      </g>

      {/* 3. EARTH AT THE BOTTOM */}
      <g>
        <circle cx="170" cy="565" r="205" fill="#123b45" />
        <g clipPath="url(#earth-clip)" fill="#b3a04b" opacity="0.75">
          <path d="M 50,380 C 100,360 140,380 180,365 C 220,350 260,380 300,370 L 320,400 C 280,410 240,380 200,410 C 160,440 100,400 50,420 Z" />
          <path d="M 80,420 C 130,410 160,430 200,420 C 240,410 270,430 310,420 L 310,450 L 80,450 Z" />
          <path d="M 230,375 C 240,380 250,375 260,385 C 255,395 240,390 230,375 Z" />
        </g>
      </g>

      {/* 4. FIGURE */}
      <g id="figure">
        {/* Back of hood / shoulders */}
        <path d="M 115,180 C 115,100 225,100 225,180" fill="#232b3d" />
        
        {/* Crossed Legs */}
        <path d="M 80,276 C 80,230 120,240 170,240 C 220,240 260,230 260,276 C 260,310 220,320 170,320 C 120,320 80,310 80,276 Z" fill="#232b3d" stroke="#1d2331" strokeWidth="2" />
        
        {/* Leg folds */}
        <path d="M 170,260 C 130,270 100,280 90,290" fill="none" stroke="#181e2b" strokeWidth="6" strokeLinecap="round" />
        <path d="M 170,260 C 210,270 240,280 250,290" fill="none" stroke="#181e2b" strokeWidth="6" strokeLinecap="round" />
        
        {/* Torso */}
        <path d="M 125,170 L 115,260 C 140,265 200,265 225,260 L 215,170 Z" fill="#232b3d" />
        
        {/* Arms */}
        <path d="M 125,170 C 115,220 135,260 170,260" fill="none" stroke="#181e2b" strokeWidth="22" strokeLinecap="round" />
        <path d="M 215,170 C 225,220 205,260 170,260" fill="none" stroke="#181e2b" strokeWidth="22" strokeLinecap="round" />
        
        <path d="M 125,170 C 115,220 135,260 170,260" fill="none" stroke="#232b3d" strokeWidth="18" strokeLinecap="round" />
        <path d="M 215,170 C 225,220 205,260 170,260" fill="none" stroke="#232b3d" strokeWidth="18" strokeLinecap="round" />
        
        {/* Hands (Dhyana Mudra) */}
        <ellipse cx="170" cy="264" rx="14" ry="8" fill="#e8c9a0" />
        <path d="M 160,264 C 165,267 175,267 180,264" fill="none" stroke="#d5b085" strokeWidth="1.5" />
        <ellipse cx="170" cy="259" rx="13" ry="7" fill="#e8c9a0" />
        <path d="M 161,259 C 165,262 175,262 179,259" fill="none" stroke="#d5b085" strokeWidth="1.5" />

        {/* Inner hood shadow */}
        <path d="M 135,130 C 135,70 205,70 205,130 C 205,165 190,175 170,180 C 150,175 135,165 135,130 Z" fill="#181e2b" />
        
        {/* Face */}
        <path d="M 148,115 C 148,90 192,90 192,115 C 192,142 178,155 170,155 C 162,155 148,142 148,115 Z" fill="#e8c9a0" />
        
        {/* Eyes (closed) */}
        <path d="M 156,120 Q 160,123 164,120" fill="none" stroke="#8b6c4b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 176,120 Q 180,123 184,120" fill="none" stroke="#8b6c4b" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Smile */}
        <path d="M 165,138 Q 170,141 175,138" fill="none" stroke="#8b6c4b" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 5. AXIS LAYERS */}
      
      {/* a. BODY/GRAVITY */}
      <g className="axis-layer" style={{ opacity: getOpacity('body') }}>
        <line x1="170" y1="0" x2="170" y2="392" stroke="#e8c34a" strokeWidth="7" opacity="0.25" strokeLinecap="round" />
        <line x1="170" y1="0" x2="170" y2="392" stroke="#e8c34a" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* b. BREATH */}
      <g className="axis-layer" style={{ opacity: getOpacity('breath') }}>
        <circle cx="170" cy="195" r="152" fill="none" stroke="#4aa8e8" strokeWidth="8" opacity="0.25" />
        <circle cx="170" cy="195" r="152" fill="none" stroke="#4aa8e8" strokeWidth="3.5" />
      </g>

      {/* c. FOCUS */}
      <g className="axis-layer" style={{ opacity: getAttentionOpacity() }}>
        {/* Base line echo */}
        <line x1="58" y1="308" x2="282" y2="308" stroke="#f07820" strokeWidth="4.5" strokeLinecap="round" />
        {/* Main Triangle */}
        <polygon points="170,92 288,298 52,298" fill="none" stroke="#f07820" strokeWidth="4.5" strokeLinejoin="round" />
      </g>

      {/* d. SPACE INFINITY (on chest) */}
      <g className="axis-layer" style={{ opacity: getOpacity('space') }}>
        <path 
          d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
          fill="none" 
          stroke="url(#rainbow-grad)" 
          strokeWidth="6.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </g>
    </svg>
  );
};
