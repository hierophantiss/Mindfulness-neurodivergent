import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { Axis } from '../data/types';
import { X } from 'lucide-react';

export interface FourfoldAxisHeroProps {
  activeAxis?: Axis | 'focus' | null;
}

export const FourfoldAxisHero: React.FC<FourfoldAxisHeroProps> = ({ activeAxis = null }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const ariaLabel = language === 'el' ? 'Ο Τετραπλός Άξονας' : 'The Fourfold Axis';

  const [hoveredAxis, setHoveredAxis] = useState<Axis | 'focus' | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const currentAxis = hoveredAxis || activeAxis;

  const axisLabels: Record<string, { en: string; el: string }> = {
    body: { en: 'Gravity • Earth', el: 'Βαρύτητα • Γη' },
    breath: { en: 'Breath • Air', el: 'Αναπνοή • Αέρας' },
    attention: { en: 'Attention • Fire', el: 'Προσοχή • Φωτιά' },
    focus: { en: 'Attention • Fire', el: 'Προσοχή • Φωτιά' },
    space: { en: 'Space • Infinity', el: 'Χώρος • Άπειρο' }
  };

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

  const isSpaceActive = currentAxis === 'space';

  const getOpacity = (axisName: string) => {
    if (!currentAxis) return 0.45;
    return currentAxis === axisName ? 1 : 0.18;
  };

  const getAttentionOpacity = () => {
    if (!currentAxis) return 0.45;
    return (currentAxis === 'focus' || currentAxis === 'attention') ? 1 : 0.18;
  };

  const handleAxisClick = (axis: Axis) => {
    navigate(`/practice?axis=${axis}`);
  };

  return (
    <div className="relative inline-block w-full">
      <svg 
        viewBox="0 0 340 420" 
        width="100%" 
        height="auto" 
        role="img" 
        aria-label={ariaLabel}
        className="block transition-all duration-500"
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

        {/* Glow Filter for Space Rays */}
        <filter id="ray-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>
          {`
            .axis-layer {
              transition: opacity 0.5s ease-in-out;
            }
            @keyframes pulseRays {
              0% { transform: scale(0.92) rotate(0deg); opacity: 0.7; }
              100% { transform: scale(1.05) rotate(2deg); opacity: 1; }
            }
            .space-rays {
              transform-origin: 170px 245px;
            }
            .animate-rays {
              animation: pulseRays 6s ease-in-out infinite alternate;
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

      {/* 2. EARTH AT THE BOTTOM */}
      <g>
        <circle cx="170" cy="565" r="205" fill="#123b45" />
        <g clipPath="url(#earth-clip)" fill="#b3a04b" opacity="0.75">
          <path d="M 50,380 C 100,360 140,380 180,365 C 220,350 260,380 300,370 L 320,400 C 280,410 240,380 200,410 C 160,440 100,400 50,420 Z" />
          <path d="M 80,420 C 130,410 160,430 200,420 C 240,410 270,430 310,420 L 310,450 L 80,450 Z" />
          <path d="M 230,375 C 240,380 250,375 260,385 C 255,395 240,390 230,375 Z" />
        </g>
      </g>

      {/* 4. FIGURE */}
      <g id="figure" transform="translate(0, 52)">
        {/* Back of hood / shoulders */}
        <path d="M 115,180 C 115,100 225,100 225,180" fill="#364157" />
        
        {/* Crossed Legs */}
        <path d="M 80,276 C 80,230 120,240 170,240 C 220,240 260,230 260,276 C 260,310 220,320 170,320 C 120,320 80,310 80,276 Z" fill="#364157" stroke="#2b3447" strokeWidth="2" />
        
        {/* Leg folds */}
        <path d="M 170,260 C 130,270 100,280 90,290" fill="none" stroke="#252d3d" strokeWidth="6" strokeLinecap="round" />
        <path d="M 170,260 C 210,270 240,280 250,290" fill="none" stroke="#252d3d" strokeWidth="6" strokeLinecap="round" />
        
        {/* Torso */}
        <path d="M 125,170 L 115,260 C 140,265 200,265 225,260 L 215,170 Z" fill="#364157" />
        
        {/* Arms */}
        <path d="M 125,170 C 115,220 135,260 170,260" fill="none" stroke="#252d3d" strokeWidth="22" strokeLinecap="round" />
        <path d="M 215,170 C 225,220 205,260 170,260" fill="none" stroke="#252d3d" strokeWidth="22" strokeLinecap="round" />
        
        <path d="M 125,170 C 115,220 135,260 170,260" fill="none" stroke="#364157" strokeWidth="18" strokeLinecap="round" />
        <path d="M 215,170 C 225,220 205,260 170,260" fill="none" stroke="#364157" strokeWidth="18" strokeLinecap="round" />
        
        {/* Hands (Dhyana Mudra) */}
        <ellipse cx="170" cy="264" rx="14" ry="8" fill="#e8c9a0" />
        <path d="M 160,264 C 165,267 175,267 180,264" fill="none" stroke="#d5b085" strokeWidth="1.5" />
        <ellipse cx="170" cy="259" rx="13" ry="7" fill="#e8c9a0" />
        <path d="M 161,259 C 165,262 175,262 179,259" fill="none" stroke="#d5b085" strokeWidth="1.5" />

        {/* Inner hood shadow */}
        <path d="M 135,130 C 135,70 205,70 205,130 C 205,165 190,175 170,180 C 150,175 135,165 135,130 Z" fill="#252d3d" />
        
        {/* Face */}
        <path d="M 151,118 C 151,98 189,98 189,118 C 189,140 178,148 170,148 C 162,148 151,140 151,118 Z" fill="#e8c9a0" />
        
        {/* Eyes (closed) */}
        <path d="M 156,122 Q 160,125 164,122" fill="none" stroke="#8b6c4b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 176,122 Q 180,125 184,122" fill="none" stroke="#8b6c4b" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Smile */}
        <path d="M 166,135 Q 170,138 174,135" fill="none" stroke="#8b6c4b" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* 5. AXIS LAYERS */}
      
      {/* a. BODY/GRAVITY */}
      <g className="axis-layer" style={{ opacity: getOpacity('body'), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        {/* Soft Earth/Sand Halo */}
        <line x1="170" y1="98" x2="170" y2="392" stroke="#d4b37f" strokeWidth="6" opacity="0.5" strokeLinecap="round" />
        <line x1="170" y1="98" x2="170" y2="392" stroke="#f7ecd5" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
        {/* Hit Area */}
        <line 
          x1="170" y1="98" x2="170" y2="392" 
          stroke="transparent" strokeWidth="30" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredAxis('body')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('body')}
        />
      </g>

      {/* b. BREATH */}
      <g className="axis-layer" style={{ opacity: getOpacity('breath'), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        {/* Soft Sky/Slate Halo */}
        <circle cx="170" cy="180" r="145" fill="none" stroke="#7ca7d6" strokeWidth="6" opacity="0.5" />
        <circle cx="170" cy="180" r="145" fill="none" stroke="#c9e2fa" strokeWidth="2" opacity="0.8" />
        {/* Hit Area */}
        <circle 
          cx="170" cy="180" r="145" 
          fill="none" stroke="transparent" strokeWidth="30" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredAxis('breath')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('breath')}
        />
      </g>

      {/* c. FOCUS */}
      <g className="axis-layer" style={{ opacity: getAttentionOpacity(), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        {/* Soft Terracotta Halo */}
        <polygon points="170,118 295,290 45,290" fill="none" stroke="#e89e6f" strokeWidth="6" opacity="0.5" strokeLinejoin="round" />
        {/* Main Triangle Core */}
        <polygon points="170,118 295,290 45,290" fill="none" stroke="#fae3d2" strokeWidth="2" opacity="0.8" strokeLinejoin="round" />
        {/* Main Triangle Hit Area */}
        <polygon 
          points="170,118 295,290 45,290" 
          fill="none" stroke="transparent" strokeWidth="30" strokeLinejoin="round" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredAxis('attention')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('attention')}
        />
      </g>

      {/* d. SPACE RAYS & INFINITY (on chest) */}
      <g className="axis-layer space-rays" style={{ opacity: getOpacity('space'), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        <g className={(!reduceMotion && isSpaceActive) ? 'animate-rays' : ''}>
          {[...Array(32)].map((_, i) => {
            const angle = (i * 11.25) * (Math.PI / 180);
            const rStart = 0;
            const x1 = 170 + Math.cos(angle) * rStart;
            const y1 = 205 + Math.sin(angle) * rStart;
            
            const cp1Dist = 90;
            const cp1x = 170 + Math.cos(angle + 0.35) * cp1Dist;
            const cp1y = 205 + Math.sin(angle + 0.35) * cp1Dist;

            const cp2Dist = 190;
            const cp2x = 170 + Math.cos(angle - 0.35) * cp2Dist;
            const cp2y = 205 + Math.sin(angle - 0.35) * cp2Dist;

            const farDist = 280;
            const x2 = 170 + Math.cos(angle) * farDist;
            const y2 = 205 + Math.sin(angle) * farDist;

            const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];
            const color = colors[i % colors.length];
            return (
              <path 
                key={i} 
                d={`M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`}
                stroke={color} 
                strokeWidth={i % 2 === 0 ? "3" : "1.5"} 
                fill="none"
                opacity={i % 2 === 0 ? "0.6" : "0.4"} 
                filter="url(#ray-glow)"
              />
            );
          })}
        </g>
        
        {/* Infinity Glow */}
        <path 
          d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="10" 
          opacity="0.4"
          filter="url(#ray-glow)"
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Infinity Core */}
        <path 
          d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
          fill="none" 
          stroke="url(#rainbow-grad)" 
          strokeWidth="6.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Infinity Hit Area */}
        <path 
          d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
          fill="transparent" 
          stroke="transparent" 
          strokeWidth="35" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredAxis('space')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('space')}
        />
      </g>
    </svg>

    {/* Hover Label Tooltip */}
    {currentAxis && axisLabels[currentAxis] && (
      <div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium text-white/90 shadow-xl pointer-events-none animate-in fade-in zoom-in-95 duration-200 whitespace-nowrap z-20 flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
        {axisLabels[currentAxis][language]}
      </div>
    )}

    {/* Info Button */}
    <button 
      onClick={() => setShowInfo(true)}
      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-slate-700/80 transition-all z-20"
      aria-label="Info"
    >
      <span className="font-serif text-xl italic">!</span>
    </button>

    {/* Info Modal */}
    {showInfo && (
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-6 rounded-3xl animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
          <button 
            onClick={() => setShowInfo(false)}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h4 className="text-lg font-serif italic text-white/90 mb-6 border-b border-white/10 pb-2">
            {language === 'el' ? 'Οι 4 Άξονες' : 'The 4 Axes'}
          </h4>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#d4b37f]/20 flex items-center justify-center text-[#f7ecd5] font-serif text-lg">Ι</div>
              <div className="text-white/80 text-sm font-medium">{language === 'el' ? 'Σώμα / Βαρύτητα' : 'Body / Gravity'}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#7ca7d6]/20 flex items-center justify-center text-[#c9e2fa] font-serif text-lg">Ο</div>
              <div className="text-white/80 text-sm font-medium">{language === 'el' ? 'Αναπνοή / Νερό' : 'Breath / Water'}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[#e89e6f]/20 flex items-center justify-center text-[#fae3d2] font-serif text-lg">△</div>
              <div className="text-white/80 text-sm font-medium">{language === 'el' ? 'Προσοχή / Φωτιά' : 'Attention / Fire'}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-serif text-lg">∞</div>
              <div className="text-white/80 text-sm font-medium">{language === 'el' ? 'Χώρος / Άπειρο' : 'Space / Infinity'}</div>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
