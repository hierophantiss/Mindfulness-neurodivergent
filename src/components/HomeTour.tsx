import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import { useAccessibility } from '../hooks/useAccessibility';

// The cat shows someone new around the home page: four stops, one sentence
// each, at the person's pace (nothing moves on by itself), and "Skip" always
// there. The place it speaks about is lit; the rest of the page dims.
// With reduced motion the cat does not walk: it is simply at the next stop.

type Stop = { target: string; el: string; en: string };

const STOPS: Stop[] = [
  { target: '[aria-labelledby="home-checkin-title"]', el: 'Ξεκίνα από εδώ: πες πώς νιώθεις και θα σου προτείνω κάτι για τώρα.', en: 'Start here: say how you feel and I will suggest something for now.' },
  { target: '[aria-labelledby="home-learn-title"]', el: 'Το βιβλίο της μεθόδου. Το διαβάζεις ή το ακούς, και θυμάμαι πού σταμάτησες.', en: 'The book of the method. Read it or listen to it; I remember where you stopped.' },
  { target: '[aria-labelledby="home-practise-title"]', el: 'Εδώ την κάνεις πράξη: τέσσερις τρόποι, ένας για κάθε άξονα.', en: 'Here you put it into practice: four ways, one for each axis.' },
  { target: '[data-tour="sos"]', el: 'Κι αν είναι πολύ τώρα, εδώ. Πάντα στην ίδια θέση.', en: 'And if it is too much right now, here. Always in the same place.' },
];

const PAD = 8;

export default function HomeTour({ language, onClose }: { language: string; onClose: () => void }) {
  const el = language !== 'en';
  const { reduceMotion } = useAccessibility();
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const stop = STOPS[step];
  const last = step === STOPS.length - 1;

  // Bring the stop into view, then measure it (again when the window changes).
  const measure = useCallback(() => {
    const node = document.querySelector(stop.target);
    setRect(node ? node.getBoundingClientRect() : null);
  }, [stop.target]);

  useLayoutEffect(() => {
    const node = document.querySelector(stop.target);
    node?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    const t = setTimeout(measure, reduceMotion ? 30 : 420);
    return () => clearTimeout(t);
  }, [stop.target, measure, reduceMotion]);

  useEffect(() => {
    window.addEventListener('resize', measure);
    const main = document.getElementById('main-content');
    main?.addEventListener('scroll', measure, { passive: true });
    return () => { window.removeEventListener('resize', measure); main?.removeEventListener('scroll', measure); };
  }, [measure]);

  useEffect(() => { nextRef.current?.focus(); }, [step]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [onClose]);

  const vw = window.innerWidth, vh = window.innerHeight;
  // The cat and its words sit below the lit place, or above it when there is no room below.
  const below = !rect || rect.bottom + 190 < vh;
  const boxTop = rect ? (below ? rect.bottom + PAD + 12 : Math.max(12, rect.top - PAD - 12 - 170)) : vh / 2 - 85;
  const boxWidth = Math.min(360, vw - 24);
  const boxLeft = Math.max(12, Math.min(vw - boxWidth - 12, (rect ? rect.left + rect.width / 2 : vw / 2) - boxWidth / 2));
  const move = reduceMotion ? 'none' : 'top 0.45s ease, left 0.45s ease, width 0.45s ease, height 0.45s ease';

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={el ? 'Ξενάγηση στην αρχική' : 'A tour of the home page'} className="fixed inset-0 z-[9990]">
      {/* The page dims; the place being spoken about stays lit. */}
      {rect ? (
        <div
          aria-hidden="true"
          className="absolute rounded-[22px] border border-[color-mix(in_srgb,var(--color-sign-gold)_55%,transparent)] pointer-events-none"
          style={{
            top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgb(7 9 15 / 0.72)', transition: move,
          }}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-[rgb(7_9_15/0.72)]" />
      )}
      {/* A tap outside the words does nothing: only the buttons move on. */}
      <div className="absolute inset-0" onClick={e => e.stopPropagation()} />

      <div className="absolute flex items-start gap-3" style={{ top: boxTop, left: boxLeft, width: boxWidth, transition: move }}>
        <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--color-surface)] border border-teal-500/25 flex items-center justify-center shadow-lg">
          <CatInfinityAvatar className="w-10 h-10" />
        </div>
        <div className="flex-1 min-w-0 rounded-2xl rounded-tl-md bg-[var(--color-surface)] border border-white/10 shadow-[0_18px_40px_-12px_rgb(0_0_0/0.8)] p-4 flex flex-col gap-3">
          <p aria-live="polite" className="text-[15px] leading-relaxed text-ink/90">{el ? stop.el : stop.en}</p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-ink/60 tabular-nums">{step + 1} / {STOPS.length}</span>
            <div className="flex items-center gap-1">
              {!last && (
                <button onClick={onClose} className="min-h-[44px] px-3 text-[13.5px] text-ink/70 hover:text-ink transition-colors">
                  {el ? 'Παράλειψη' : 'Skip'}
                </button>
              )}
              <button
                ref={nextRef}
                onClick={() => (last ? onClose() : setStep(s => s + 1))}
                className="min-h-[44px] px-5 rounded-full bg-[color-mix(in_srgb,var(--color-sign-gold)_16%,transparent)] border border-[color-mix(in_srgb,var(--color-sign-gold)_45%,transparent)] text-sign-gold text-[14px] font-medium hover:brightness-110 transition-[filter]"
              >
                {last ? (el ? 'Τέλος' : 'Done') : (el ? 'Επόμενο' : 'Next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
