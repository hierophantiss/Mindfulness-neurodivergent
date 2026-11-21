import { useAccessibility } from '../hooks/useAccessibility';
import { writeText } from '../lib/storage';
import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import { useLocation } from 'react-router-dom';
import { TIPS, placeOf, tipSeen, markTipSeen, unmarkTipSeen, isQuiet, tipsUsedUp, type TipPlace } from '../lib/companionTips';

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

/** What the bubble must never cover: anything you can press, and the headings. */
const KEEP_CLEAR = 'a[href], button, [role="button"], [role="switch"], [role="link"], input, textarea, select, summary, h1, h2, h3';

type Box = { top: number; left: number; width: number; height: number };
const overlaps = (a: Box, b: DOMRect) =>
  a.left < b.right && a.left + a.width > b.left && a.top < b.bottom && a.top + a.height > b.top;

/** The things on the page the bubble must leave in view (not the cat's own). */
function keepClear(own: HTMLElement | null): DOMRect[] {
  const out: DOMRect[] = [];
  document.querySelectorAll<HTMLElement>(KEEP_CLEAR).forEach(el => {
    if (own && own.contains(el)) return;
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight) out.push(r);
  });
  return out;
}

/** Where the bubble goes, relative to the cat: the first place, of a few, that covers nothing. */
type Spot = { top: number; left: number; tail: 'below' | 'side' | null };

/** How big the cat is and how far it may go: 48px on a phone (56px on a computer), never under the bottom bar. */
function catBounds() {
  const desk = window.innerWidth >= 1024;
  const size = desk ? 56 : 48;
  return { desk, size, maxX: window.innerWidth - size - 8, maxY: window.innerHeight - size - (desk ? 101 : 78) };
}

export default function Companion() {
    const { reduceMotion } = useAccessibility();
  

  const { companionData, updateCompanionData, setSheetVisible, sheetVisible, companionMessage, setCompanionMessage } = useCompanion();
  // The cat starts at the bottom right, right above the bottom bar, a little
  // smaller on a phone: on the left it sat on the first words of every line.
  // Its sentence opens upwards, so it does not cover what is beside it.
  // On a computer: in the bottom right corner, beside the content.
  // Once moved, it stays where it was put.
  const [position, setPosition] = useState(() => { const b = catBounds(); return { x: b.desk ? window.innerWidth - 84 : b.maxX, y: b.desk ? window.innerHeight - 56 - 85 - 16 : b.maxY }; });
  const { size, desk } = catBounds();
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initX: number, initY: number } | null>(null);
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  /** The place whose first tip is showing (to give it back if it cannot be shown). */
  const tipPlaceRef = useRef<TipPlace | null>(null);

  // The first time you open a place, the cat says in one sentence what it is,
  // a moment after the page has settled; then never again there. Not if the
  // welcome is still open, and not at all with "quiet cat".
  useEffect(() => {
    const place = placeOf(pathname);
    if (!place || isQuiet() || tipSeen(place) || tipsUsedUp()) return;
    const t = setTimeout(() => {
      if (document.querySelector('[aria-labelledby="onboarding-title"]')) return;
      markTipSeen(place);
      tipPlaceRef.current = place;
      setCompanionMessage(TIPS[place][language === 'en' ? 'en' : 'el']);
    }, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, language]);

  // Auto-dismiss logic for any message
  useEffect(() => {
    if (!companionMessage) return;
    
    const autoDismissTimer = setTimeout(() => {
      setCompanionMessage(null);
    }, 8000);
    // Scrolling means you are reading the page: the bubble steps out of the way.
    const main = document.getElementById('main-content');
    const away = () => setCompanionMessage(null);
    // The first tap anywhere on the page closes it too (the tap still does what it does).
    const armed = setTimeout(() => {
      main?.addEventListener('scroll', away, { passive: true, once: true });
      window.addEventListener('pointerdown', away, { capture: true, once: true });
    }, 400);

    return () => {
      clearTimeout(autoDismissTimer); clearTimeout(armed);
      main?.removeEventListener('scroll', away);
      window.removeEventListener('pointerdown', away, { capture: true });
    };
  }, [companionMessage]);

  // The bubble never covers a button, a link or a heading: of a few places
  // round the cat it takes the first that covers nothing; if there is none, it
  // does not show (a first tip then waits for another visit). Checked again
  // whenever the page changes under it (a suggestion opening, for example).
  const place = useCallback((): boolean => {
    const root = rootRef.current, bubble = bubbleRef.current;
    if (!root || !bubble) return true;
    const cat = root.getBoundingClientRect();
    const w = bubble.offsetWidth, h = bubble.offsetHeight;
    const vw = window.innerWidth;
    const right = cat.left + cat.width / 2 > vw / 2;
    const gap = 10;
    const candidates: Spot[] = [];
    const sideLeft = right ? -gap - w : cat.width + gap;
    const aboveLeft = right ? cat.width - w : 0;
    if (desk) candidates.push({ top: (cat.height - h) / 2, left: sideLeft, tail: 'side' });
    candidates.push({ top: -gap - h, left: aboveLeft, tail: 'below' });
    if (!desk) candidates.push({ top: cat.height - h, left: sideLeft, tail: 'side' });
    for (let k = 1; k <= 12; k++) candidates.push({ top: -gap - h - k * 24, left: aboveLeft, tail: null });
    const clear = keepClear(root);
    const fits = (c: Spot) => {
      const box = { top: cat.top + c.top, left: cat.left + c.left, width: w, height: h };
      if (box.left < 4 || box.left + w > vw - 4 || box.top < 8) return false;
      return !clear.some(r => overlaps(box, r));
    };
    const found = candidates.find(fits);
    if (!found) return false;
    setSpot(prev => (prev && prev.top === found.top && prev.left === found.left ? prev : found));
    return true;
  }, [desk]);

  useLayoutEffect(() => {
    if (!companionMessage) { setSpot(null); return; }
    const check = () => {
      if (place()) return;
      // Nowhere to say it without covering the page: not now.
      if (tipPlaceRef.current) unmarkTipSeen(tipPlaceRef.current);
      tipPlaceRef.current = null;
      setCompanionMessage(null);
    };
    check();
    const observer = new MutationObserver(() => requestAnimationFrame(check));
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-expanded', 'hidden'] });
    window.addEventListener('resize', check);
    const shown = setTimeout(() => { tipPlaceRef.current = null; }, 600);
    return () => { observer.disconnect(); window.removeEventListener('resize', check); clearTimeout(shown); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionMessage, place]);

  const dismissBubble = (e?: React.MouseEvent) => {
    if (e) {
       e.preventDefault();
       e.stopPropagation();
    }
    setCompanionMessage(null);
    writeText('N_MINDFULNESS_SEEN_COMPANION_TUTORIAL', 'true');
  };

  useEffect(() => {
    if (companionData.fabPos) {
       const b = catBounds();
       const cX = Math.max(8, Math.min(b.maxX, companionData.fabPos.x));
       const cY = Math.max(60, Math.min(b.maxY, companionData.fabPos.y));
       setPosition({ x: cX, y: cY });
    }
  }, [companionData.fabPos]);

  useEffect(() => {
    const handleResize = () => {
       const b = catBounds();
       setPosition(prev => ({
         x: Math.max(8, Math.min(b.maxX, prev.x)),
         y: Math.max(60, Math.min(b.maxY, prev.y))
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
      if (companionMessage) dismissBubble();
    }

    if (isDragging) {
      const b = catBounds();

      const newX = dragRef.current.initX + dx;
      const newY = dragRef.current.initY + dy;
      
      setPosition({
        x: Math.max(8, Math.min(b.maxX, newX)),
        y: Math.max(60, Math.min(b.maxY, newY))
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
    if (companionMessage) dismissBubble(e);
    setSheetVisible(true);
  };

  const isRightSide = position.x > window.innerWidth / 2;

  return (
    <>
      {/* The cat and its speech bubble side by side (a button may not hold another button). */}
      <div ref={rootRef} data-nosnippet className="fixed z-50" style={{ left: position.x, top: position.y, width: size, height: size }}>
        <div
          className={`relative flex items-center justify-center w-full h-full rounded-full bg-[#0d0e12]/80 backdrop-blur-md border-2 border-teal-400/40 shadow-[0_0_25px_rgba(95,143,214,0.25)] cursor-pointer touch-none transition-transform duration-300 ${isDragging ? 'scale-110 opacity-80' : 'hover:scale-110 active:scale-90'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label={language === 'en' ? 'Companion: what now?' : 'Συνοδός: τι κάνω τώρα;'}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSheetVisible(true); } }}
        >
          <div className="absolute inset-0 rounded-full bg-teal-500/10 pointer-events-none" />
          <motion.div 
            className="relative w-full h-full flex items-center justify-center transition-transform duration-300"
            animate={{ y: [0, -3, 0] }}
            transition={reduceMotion ? { duration: 0.01 } : { 
              repeat: Infinity, 
              duration: 4, 
              ease: "easeInOut" 
            }}
          >
            <CatInfinityAvatar className="w-[79%] h-[79%]" />
          </motion.div>
        </div>
        <AnimatePresence>
          {companionMessage && (
            <motion.div
              key={companionMessage}
              ref={bubbleRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: spot ? 1 : 0 }}
              exit={{ opacity: 0 }}
              role="status"
              data-testid="companion-bubble"
              className="absolute flex items-center gap-2 bg-stone-900 text-ink p-3 rounded-2xl shadow-2xl border border-stone-700 font-sans pointer-events-auto z-50 cursor-default"
              style={{ width: 'max-content', maxWidth: desk ? '240px' : 'min(270px, calc(100vw - 24px))', top: spot?.top ?? 0, left: spot?.left ?? 0, visibility: spot ? 'visible' : 'hidden' }}
              onClick={dismissBubble}
            >
              {spot?.tail === 'side' && (
                <>
                  <div className="absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent"
                      style={isRightSide ? { right: '-12px', borderLeftColor: '#44403c' } : { left: '-12px', borderRightColor: '#44403c' }} />
                  <div className="absolute top-1/2 -translate-y-1/2 border-[6px] border-transparent"
                      style={isRightSide ? { right: '-11px', borderLeftColor: '#1c1917' } : { left: '-11px', borderRightColor: '#1c1917' }} />
                </>
              )}
              {spot?.tail === 'below' && (
                <>
                  <div className="absolute border-[6px] border-transparent"
                      style={{ bottom: '-12px', borderTopColor: '#44403c', ...(isRightSide ? { right: '18px' } : { left: '18px' }) }} />
                  <div className="absolute border-[6px] border-transparent"
                      style={{ bottom: '-11px', borderTopColor: '#1c1917', ...(isRightSide ? { right: '18px' } : { left: '18px' }) }} />
                </>
              )}
              <span className="text-[13.5px] font-semibold tracking-wide leading-snug">
                {companionMessage}
              </span>
              <button 
                onClick={dismissBubble} 
                className="hit-44 p-1.5 hover:bg-white/20 rounded-full ml-1 transition-colors flex-shrink-0"
                aria-label={language === 'el' ? 'Κλείσιμο μηνύματος' : 'Close message'}
              >
                <X size={14} className="text-stone-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}
