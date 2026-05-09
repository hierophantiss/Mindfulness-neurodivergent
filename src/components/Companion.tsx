import React, { useState, useRef, useEffect } from 'react';
import { useCompanion } from '../hooks/useCompanion';
import CompanionSheet from './CompanionSheet';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InfinitySVG = ({ size }: { size: number }) => (
  <svg width={size} height={Math.round(size * 0.55)} viewBox="0 0 120 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="inf-svg-glow filter drop-shadow-md">
    <defs>
      <linearGradient id="inf-grad" x1="0" y1="33" x2="120" y2="33" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E8704A"/>
        <stop offset="20%" stopColor="#E8A030"/>
        <stop offset="40%" stopColor="#C8C040"/>
        <stop offset="55%" stopColor="#50B870"/>
        <stop offset="70%" stopColor="#40A0A8"/>
        <stop offset="85%" stopColor="#6070C0"/>
        <stop offset="100%" stopColor="#9860A8"/>
      </linearGradient>
    </defs>
    <path d="M60 33 C60 16, 45 4, 30 4 C15 4, 2 16, 2 33 C2 50, 15 62, 30 62 C45 62, 60 50, 60 33 C60 16, 75 4, 90 4 C105 4, 118 16, 118 33 C118 50, 105 62, 90 62 C75 62, 60 50, 60 33Z" stroke="url(#inf-grad)" strokeWidth="6.5" strokeLinecap="round" fill="none"/>
  </svg>
);

export default function Companion() {
  const { companionData, updateCompanionData, setSheetVisible, sheetVisible } = useCompanion();
  const [position, setPosition] = useState({ x: window.innerWidth - 68, y: window.innerHeight / 2 - 26 });
  const [isDragging, setIsDragging] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initX: number, initY: number } | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Only show if they haven't seen it
    const hasSeen = localStorage.getItem('N_MINDFULNESS_SEEN_COMPANION_TUTORIAL');
    if (!hasSeen) {
      // Delay it a bit so it doesn't fight with WelcomeModal immediately, or pops nicely after load
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTutorial = (e?: React.MouseEvent) => {
    if (e) {
       e.preventDefault();
       e.stopPropagation();
    }
    setShowTutorial(false);
    localStorage.setItem('N_MINDFULNESS_SEEN_COMPANION_TUTORIAL', 'true');
  };

  useEffect(() => {
    // Sync position with saved state
    if (companionData.fabPos) {
       // clamp coordinates
       const maxW = window.innerWidth;
       const maxH = window.innerHeight;
       const clampWidth = 52; // roughly width of FAB
       const clampHeight = 52;
       
       const cX = Math.max(8, Math.min(maxW - clampWidth - 8, companionData.fabPos.x));
       const cY = Math.max(60, Math.min(maxH - clampHeight - 8, companionData.fabPos.y));
       setPosition({ x: cX, y: cY });
    }
  }, [companionData.fabPos]);

  useEffect(() => {
    const handleResize = () => {
       const clampWidth = 52; 
       const clampHeight = 52;
       setPosition(prev => ({
         x: Math.max(8, Math.min(window.innerWidth - clampWidth - 8, prev.x)),
         y: Math.max(60, Math.min(window.innerHeight - clampHeight - 8, prev.y))
       }));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only capture if it's a left click or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: position.x,
      initY: position.y
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    
    // threshold before dragging begins to allow clicking
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!isDragging && Math.sqrt(dx*dx + dy*dy) > 10) {
      setIsDragging(true);
      if (showTutorial) {
        dismissTutorial();
      }
    }

    if (isDragging) {
      const clampWidth = 52; 
      const clampHeight = 52;
      const newX = dragRef.current.initX + dx;
      const newY = dragRef.current.initY + dy;
      
      setPosition({
        x: Math.max(8, Math.min(window.innerWidth - clampWidth - 8, newX)),
        y: Math.max(60, Math.min(window.innerHeight - clampHeight - 8, newY))
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    
    if (isDragging) {
      updateCompanionData({ fabPos: position });
      setTimeout(() => setIsDragging(false), 100);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (showTutorial) {
      dismissTutorial(e);
    }
    setSheetVisible(true);
  };

  const isRightSide = position.x > window.innerWidth / 2;

  return (
    <>
      <div 
        className={`fixed z-50 flex items-center justify-center w-[52px] h-[52px] rounded-full bg-stone-100 dark:bg-stone-800 shadow-xl border border-stone-200/50 dark:border-stone-700/50 cursor-pointer touch-none transition-transform duration-200 ${isDragging ? 'scale-105 opacity-90' : 'hover:scale-105 active:scale-95'}`}
        style={{ left: position.x, top: position.y }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleClick}
      >
        <AnimatePresence>
          {showTutorial && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: isRightSide ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: isRightSide ? 20 : -20 }}
              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 bg-pine-900/95 backdrop-blur-md text-pine-50 p-3 rounded-2xl shadow-2xl border border-teal-500/30 font-sans pointer-events-auto whitespace-nowrap z-50 ${isRightSide ? 'right-[120%]' : 'left-[120%]'}`}
              onClick={dismissTutorial}
            >
              <div className="absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent"
                  style={isRightSide 
                    ? { right: '-12px', borderLeftColor: 'rgba(20, 184, 166, 0.3)' } 
                    : { left: '-12px', borderRightColor: 'rgba(20, 184, 166, 0.3)' }} />
              <div className="absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent"
                  style={isRightSide 
                    ? { right: '-11px', borderLeftColor: 'rgba(5, 46, 38, 0.95)' } 
                    : { left: '-11px', borderRightColor: 'rgba(5, 46, 38, 0.95)' }} />      
              <span className="text-[13px] font-medium tracking-wide">
                {language === 'el' ? 'Hej, πάτα στο ♾️ για βοήθεια!' : 'Hej, tap on ♾️ for help!'}
              </span>
              <button 
                onClick={dismissTutorial} 
                className="p-1.5 hover:bg-white/10 rounded-full ml-1 transition-colors flex-shrink-0"
                aria-label="Close tutorial"
              >
                <X size={14} className="text-pine-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <InfinitySVG size={36} />
        {companionData.dailyLogs.length > 0 && <span className="absolute animate-ping top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />}
      </div>
      <CompanionSheet />
    </>
  );
}
