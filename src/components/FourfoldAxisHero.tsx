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

  const tokens = {
    body: '#d4b37f',
    breath: '#7ca7d6',
    attention: '#e89e6f',
    space: '#a78bfa'
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
        <linearGradient id="body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
          <stop offset="20%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="45%" stopColor="#f97316" stopOpacity="1" />
          <stop offset="55%" stopColor="#ef4444" stopOpacity="1" />
          <stop offset="70%" stopColor="#fef08a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="20%" stopColor="#f97316" />
          <stop offset="40%" stopColor="#22c55e" />
          <stop offset="60%" stopColor="#14b8a6" />
          <stop offset="80%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        <linearGradient id="attention-grad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={tokens.attention} stopOpacity="1" />
          <stop offset="100%" stopColor={tokens.attention} stopOpacity="0.15" />
        </linearGradient>

        <clipPath id="earth-clip">
          <circle cx="170" cy="565" r="205" />
        </clipPath>

        <filter id="symbol-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
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
            @keyframes pulseBreath {
              0% { transform: scale(1); }
              50% { transform: scale(1.03); }
              100% { transform: scale(1); }
            }
            .animate-breath {
              animation: pulseBreath 9s ease-in-out infinite;
              transform-origin: 170px 180px;
            }
            @keyframes slowRotateRays {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .space-rays {
              transform-origin: 170px 205px;
            }
            .animate-rays {
              animation: slowRotateRays 30s linear infinite;
            }
            @keyframes hueShift {
              0% { filter: hue-rotate(0deg); }
              100% { filter: hue-rotate(360deg); }
            }
            .animate-space {
              animation: hueShift 30s linear infinite;
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
        {/* Soft shadow under figure */}
        <ellipse cx="170" cy="320" rx="100" ry="12" fill="#0c121e" opacity="0.5" />

        {/* Back of hood / shoulders - lowered and relaxed */}
        <path d="M 115,190 C 115,110 225,110 225,190" fill="#2a3a30" />
        
        {/* Crossed Legs (Widened) */}
        <path d="M 65,285 C 65,240 110,245 170,245 C 230,245 275,240 275,285 C 275,320 220,330 170,330 C 120,330 65,320 65,285 Z" fill="#2a3a30" />
        
        {/* Leg folds - soft */}
        <path d="M 170,265 C 130,275 90,295 75,305" fill="none" stroke="#1d2822" strokeWidth="5" strokeLinecap="round" />
        <path d="M 170,265 C 210,275 250,295 265,305" fill="none" stroke="#1d2822" strokeWidth="5" strokeLinecap="round" />
        
        {/* Torso */}
        <path d="M 120,180 L 110,260 C 140,265 200,265 230,260 L 220,180 Z" fill="#2a3a30" />
        
        {/* Arms folded - natural drape */}
        <path d="M 120,180 C 100,240 130,285 170,275" fill="none" stroke="#1d2822" strokeWidth="22" strokeLinecap="round" />
        <path d="M 220,180 C 240,240 210,285 170,275" fill="none" stroke="#1d2822" strokeWidth="22" strokeLinecap="round" />
        
        <path d="M 120,180 C 100,240 130,285 170,275" fill="none" stroke="#2a3a30" strokeWidth="18" strokeLinecap="round" />
        <path d="M 220,180 C 240,240 210,285 170,275" fill="none" stroke="#2a3a30" strokeWidth="18" strokeLinecap="round" />
        
        {/* Hands - Heart Mudra */}
        <path d="M 148,272 C 158,266 168,266 170,275 C 160,282 148,280 148,272 Z" fill="#dfb18b" />
        <path d="M 192,272 C 182,266 172,266 170,275 C 180,282 192,280 192,272 Z" fill="#dfb18b" />
        <path d="M 148,272 C 158,278 170,275 170,275" fill="none" stroke="#cf9c74" strokeWidth="1.5" />
        <path d="M 192,272 C 182,278 170,275 170,275" fill="none" stroke="#cf9c74" strokeWidth="1.5" />
        
        {/* Inner hood shadow - deeper drape */}
        <path d="M 135,135 C 135,80 205,80 205,135 C 205,175 190,185 170,190 C 150,185 135,175 135,135 Z" fill="#1d2822" />
      </g>

      {/* 5. AXIS LAYERS */}
      
      {/* a. BODY/GRAVITY (behind face, over body) */}
      <g className="axis-layer" style={{ opacity: getOpacity('body'), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        {/* Glow halo */}
        <line x1="170" y1="30" x2="170" y2="440" stroke="url(#body-grad)" strokeWidth="6" strokeLinecap="round" filter="url(#symbol-glow)" />
        {/* Solid core */}
        <line x1="170" y1="30" x2="170" y2="440" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        {/* Hit Area */}
        <line 
          x1="170" y1="30" x2="170" y2="440" 
          stroke="transparent" strokeWidth="30" 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredAxis('body')}
          onMouseLeave={() => setHoveredAxis(null)}
          onClick={() => handleAxisClick('body')}
        />
      </g>

      {/* 4.b FACE (over body line) */}
      <g id="figure-face" transform="translate(0, 52)">
        {/* Face - warm skin tone */}
        <path d="M 148,118 C 148,90 192,90 192,118 C 192,142 180,152 170,152 C 160,152 148,142 148,118 Z" fill="#dfb18b" />
        
        {/* Eyes (closed) - minimal */}
        <path d="M 154,124 Q 159,127 164,124" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 176,124 Q 181,127 186,124" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Smile - minimal calm */}
        <path d="M 166,138 Q 170,141 174,138" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* b. BREATH */}
      <g className="axis-layer" style={{ opacity: getOpacity('breath'), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        <g className={!reduceMotion ? 'animate-breath' : ''}>
          {/* Two concentric rings */}
          <circle cx="170" cy="180" r="145" fill="none" stroke={tokens.breath} strokeWidth="3" opacity="0.65" filter="url(#symbol-glow)" />
          <circle cx="170" cy="180" r="135" fill="none" stroke={tokens.breath} strokeWidth="1.5" opacity="0.3" />
        </g>
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

      {/* c. FOCUS / ATTENTION */}
      <g className="axis-layer" style={{ opacity: getAttentionOpacity(), transition: 'opacity 0.4s ease' }} transform="translate(0, 52)">
        {/* Apex at third eye: cy = 118. Base corners down. */}
        <polygon points="170,118 295,290 45,290" fill="none" stroke="url(#attention-grad)" strokeWidth="3" strokeLinejoin="round" filter="url(#symbol-glow)" />
        <circle cx="170" cy="118" r="4" fill={tokens.attention} filter="url(#symbol-glow)" />
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
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
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

            const colors = [tokens.body, tokens.breath, tokens.attention, tokens.space];
            const color = colors[i % colors.length];
            return (
              <path 
                key={i} 
                d={`M ${x1},${y1} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`}
                stroke={color} 
                strokeWidth="2" 
                fill="none"
                opacity="0.2" 
              />
            );
          })}
        </g>
        
        {/* Infinity Core */}
        <g style={{ transformOrigin: '170px 205px' }}>
          <path 
            d="M148,205 C148,192 165,192 170,205 C175,218 192,218 192,205 C192,192 175,192 170,205 C165,218 148,218 148,205 Z" 
            fill="none" 
            stroke="url(#rainbow-grad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#symbol-glow)"
          />
        </g>

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
              <div className="w-8 h-8 rounded-full bg-[#a78bfa]/20 flex items-center justify-center text-[#c4b5fd] font-serif text-lg">∞</div>
              <div className="text-white/80 text-sm font-medium">{language === 'el' ? 'Χώρος / Άπειρο' : 'Space / Infinity'}</div>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};
