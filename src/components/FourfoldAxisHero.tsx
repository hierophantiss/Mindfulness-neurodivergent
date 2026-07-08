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
        <ellipse cx="170" cy="320" rx="90" ry="12" fill="#0c121e" opacity="0.5" />
        
        {/* Crossed Legs (Widened) */}
        <path d="M 75,285 C 75,245 115,250 170,250 C 225,250 265,245 265,285 C 265,315 215,325 170,325 C 125,325 75,315 75,285 Z" fill="#2E4034" />
        
        {/* Leg folds */}
        <path d="M 170,270 C 135,280 100,295 85,305" fill="none" stroke="#1d2822" strokeWidth="4" strokeLinecap="round" />
        <path d="M 170,270 C 205,280 240,295 255,305" fill="none" stroke="#1d2822" strokeWidth="4" strokeLinecap="round" />

        {/* Torso (slimmer column) */}
        <path d="M 135,180 L 135,265 C 150,270 190,270 205,265 L 205,180 Z" fill="#2E4034" />
        
        {/* Back of hood / shoulders - natural raised drape */}
        <path d="M 115,190 C 115,120 135,90 170,90 C 205,90 225,120 225,190 Z" fill="#2E4034" />
        
        {/* Neck opening shadow / inner hood */}
        <path d="M 144,135 C 144,170 196,170 196,135 Z" fill="#1d2822" />
        
        {/* Arms folded - natural drape */}
        <path d="M 125,185 C 110,235 140,275 170,270" fill="none" stroke="#1d2822" strokeWidth="20" strokeLinecap="round" />
        <path d="M 215,185 C 230,235 200,275 170,270" fill="none" stroke="#1d2822" strokeWidth="20" strokeLinecap="round" />
        
        <path d="M 125,185 C 110,235 140,275 170,270" fill="none" stroke="#2E4034" strokeWidth="16" strokeLinecap="round" />
        <path d="M 215,185 C 230,235 200,275 170,270" fill="none" stroke="#2E4034" strokeWidth="16" strokeLinecap="round" />

        {/* Hands - Heart Mudra */}
        <path d="M 152,274 C 145,265 155,255 170,265 C 170,270 160,280 152,274 Z" fill="#dfb18b" />
        <path d="M 188,274 C 195,265 185,255 170,265 C 170,270 180,280 188,274 Z" fill="#dfb18b" />
        
        {/* Negative space inside the hands (heart shape) */}
        <path d="M 170,266 C 166,262 162,266 166,270 L 170,274 L 174,270 C 178,266 174,262 170,266 Z" fill="#2E4034" />
        
        {/* Finger lines */}
        <path d="M 155,268 C 158,272 163,274 167,274" fill="none" stroke="#cf9c74" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 185,268 C 182,272 177,274 173,274" fill="none" stroke="#cf9c74" strokeWidth="1.2" strokeLinecap="round" />
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
        {/* Neck */}
        <path d="M 162,145 L 162,165 C 162,170 178,170 178,165 L 178,145 Z" fill="#c3946d" />
        
        {/* Face - short oval under hood */}
        <path d="M 148,130 C 148,115 192,115 192,130 C 192,150 182,156 170,156 C 158,156 148,150 148,130 Z" fill="#dfb18b" />
        
        {/* Hood covering forehead */}
        <path d="M 146,128 C 146,110 194,110 194,128 C 185,118 155,118 146,128 Z" fill="#2E4034" />
        <path d="M 146,128 C 146,152 158,158 170,158 C 182,158 194,152 194,128" fill="none" stroke="#2E4034" strokeWidth="2.5" />
        
        {/* Eyes (closed) - minimal */}
        <path d="M 155,134 Q 159,137 163,134" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 177,134 Q 181,137 185,134" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Smile - minimal calm */}
        <path d="M 166,145 Q 170,148 174,145" fill="none" stroke="#1d2822" strokeWidth="1.5" strokeLinecap="round" />
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
