import React, { useState, useRef, useEffect } from 'react';
import { useCompanion } from '../hooks/useCompanion';
import CompanionSheet from './CompanionSheet';
import { useLanguage } from '../hooks/useLanguage';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const InfinitySVG = ({ size }: { size: number }) => (
  <svg width={size} height={Math.round(size * 0.55)} viewBox="0 0 120 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="inf-svg-glow filter drop-shadow-sm">
    <defs>
      <linearGradient id="inf-grad" x1="0" y1="33" x2="120" y2="33" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ef4444"/>  {/* red-500 */}
        <stop offset="25%" stopColor="#f59e0b"/> {/* amber-500 */}
        <stop offset="50%" stopColor="#10b981"/> {/* emerald-500 */}
        <stop offset="75%" stopColor="#3b82f6"/> {/* blue-500 */}
        <stop offset="100%" stopColor="#a855f7"/> {/* purple-500 */}
      </linearGradient>
    </defs>
    <path d="M60 33 C60 16, 45 4, 30 4 C15 4, 2 16, 2 33 C2 50, 15 62, 30 62 C45 62, 60 50, 60 33 C60 16, 75 4, 90 4 C105 4, 118 16, 118 33 C118 50, 105 62, 90 62 C75 62, 60 50, 60 33Z" stroke="url(#inf-grad)" strokeWidth="7" strokeLinecap="round" fill="none" />
  </svg>
);

export default function Companion() {
  const { companionData, updateCompanionData, setSheetVisible, sheetVisible } = useCompanion();
  const [position, setPosition] = useState({ x: window.innerWidth - 68, y: window.innerHeight / 2 - 26 });
  const [isDragging, setIsDragging] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState<string | null>(null);
  const dragRef = useRef<{ startX: number, startY: number, initX: number, initY: number } | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const hasSeen = localStorage.getItem('N_MINDFULNESS_SEEN_COMPANION_TUTORIAL');
    
    const activeQuote = { 
      el: "Η επίγνωση είναι η γέφυρα ανάμεσα στο χάος και τη γαλήνη.", 
      en: "Awareness is the bridge between chaos and tranquility." 
    };

    const timer = setTimeout(() => {
      if (!hasSeen) {
        setBubbleMessage(language === 'el' ? 'Γεια, είμαι το κουκουκου! Προτείνω να διαβάσεις πρώτα «Η Μέθοδος & Τα Σύμβολα».' : 'Hi, I\'m kukuku! I recommend reading "The Method & Symbols" first.');
      } else {
        if (Math.random() > 0.3) {
          setBubbleMessage(language === 'el' ? activeQuote.el : activeQuote.en);
        }
      }
    }, 3000);

    const autoDismissTimer = setTimeout(() => {
      setBubbleMessage(null);
    }, 12000); // hide after 9 seconds of showing

    return () => {
      clearTimeout(timer);
      clearTimeout(autoDismissTimer);
    };
  }, [language]);

  const dismissBubble = (e?: React.MouseEvent) => {
    if (e) {
       e.preventDefault();
       e.stopPropagation();
    }
    setBubbleMessage(null);
    localStorage.setItem('N_MINDFULNESS_SEEN_COMPANION_TUTORIAL', 'true');
  };

  useEffect(() => {
    if (companionData.fabPos) {
       const maxW = window.innerWidth;
       const maxH = window.innerHeight;
       const clampWidth = 56; 
       const clampHeight = 56;
       
       const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0');
       const bottomLimit = maxH - clampHeight - 85 - (safeBottom || 16); 
       
       const cX = Math.max(8, Math.min(maxW - clampWidth - 8, companionData.fabPos.x));
       const cY = Math.max(60, Math.min(bottomLimit, companionData.fabPos.y));
       setPosition({ x: cX, y: cY });
    }
  }, [companionData.fabPos]);

  useEffect(() => {
    const handleResize = () => {
       const clampWidth = 56; 
       const clampHeight = 56;
       const maxH = window.innerHeight;
       const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0');
       const bottomLimit = maxH - clampHeight - 85 - (safeBottom || 16);

       setPosition(prev => ({
         x: Math.max(8, Math.min(window.innerWidth - clampWidth - 8, prev.x)),
         y: Math.max(60, Math.min(bottomLimit, prev.y))
       }));
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
    
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (!isDragging && Math.sqrt(dx*dx + dy*dy) > 10) {
      setIsDragging(true);
      if (bubbleMessage) dismissBubble();
    }

    if (isDragging) {
      const clampWidth = 56; 
      const clampHeight = 56;
      const maxH = window.innerHeight;
      const safeBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0');
      const bottomLimit = maxH - clampHeight - 85 - (safeBottom || 16);

      const newX = dragRef.current.initX + dx;
      const newY = dragRef.current.initY + dy;
      
      setPosition({
        x: Math.max(8, Math.min(window.innerWidth - clampWidth - 8, newX)),
        y: Math.max(60, Math.min(bottomLimit, newY))
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
    if (bubbleMessage) dismissBubble(e);
    setSheetVisible(true);
  };

  const isRightSide = position.x > window.innerWidth / 2;

  return (
    <>
      <div 
        className={`fixed z-50 flex items-center justify-center w-[56px] h-[56px] rounded-full bg-stone-100/90 dark:bg-stone-900/90 backdrop-blur-md shadow-2xl border border-white/20 dark:border-stone-700/30 cursor-pointer touch-none transition-transform duration-300 ${isDragging ? 'scale-110 opacity-80' : 'hover:scale-110 active:scale-90 shadow-teal-500/10'}`}
        style={{ left: position.x, top: position.y }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleClick}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/5 to-transparent pointer-events-none" />
        <AnimatePresence>
          {bubbleMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, x: isRightSide ? 20 : -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: isRightSide ? 20 : -20 }}
              className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-2 bg-stone-900 text-white p-3 rounded-2xl shadow-2xl border border-stone-700 font-sans pointer-events-auto z-50 ${isRightSide ? 'right-[120%]' : 'left-[120%]'}`}
              style={{ width: 'max-content', maxWidth: '240px' }}
              onClick={dismissBubble}
            >
              <div className="absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent"
                  style={isRightSide 
                    ? { right: '-12px', borderLeftColor: '#44403c' } 
                    : { left: '-12px', borderRightColor: '#44403c' }} />
              <div className="absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent"
                  style={isRightSide 
                    ? { right: '-11px', borderLeftColor: '#1c1917' } 
                    : { left: '-11px', borderRightColor: '#1c1917' }} />      
              <span className="text-[13.5px] font-semibold tracking-wide leading-snug">
                {bubbleMessage}
              </span>
              <button 
                onClick={dismissBubble} 
                className="p-1.5 hover:bg-white/20 rounded-full ml-1 transition-colors flex-shrink-0"
                aria-label="Close message"
              >
                <X size={14} className="text-stone-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative w-10 h-10 bg-stone-200/90 rounded-full overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-300 ring-2 ring-teal-500/20">
          <img 
            src="/genfavicon-256.png" 
            alt="Zen Master Cat Companion" 
            className="w-full h-full object-cover"
          />
        </div>
        {companionData.dailyLogs.length > 0 && <span className="absolute animate-ping top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />}
      </div>
      <CompanionSheet />
    </>
  );
}
