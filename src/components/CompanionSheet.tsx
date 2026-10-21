import { useFocusTrap } from '../hooks/useFocusTrap';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, ChevronRight, X } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import HomeCheckin from './HomeCheckin';

// The cat's sheet: only two things, from anywhere in the app —
// "how do you feel right now?" and the next chapter.
export default function CompanionSheet() {
  const { sheetVisible, setSheetVisible } = useCompanion();
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const { progress } = useProgress();
  const location = useLocation();

  const close = () => setSheetVisible(false);
  const modalRef = useFocusTrap(sheetVisible, close);

  // Any link inside the sheet takes you somewhere: the sheet steps aside.
  useEffect(() => {
    setSheetVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // The same next chapter as the home page.
  const chapters = CHAPTERS_DATA[lang] || [];
  const done = progress.completedChapters;
  const nextChapter = chapters.find(c => !done.includes(String(c.num))) || chapters[0];
  const allDone = chapters.length > 0 && done.length >= chapters.length;
  const chapterLabel = allDone
    ? (el ? 'Ολοκλήρωσες τον οδηγό' : 'You finished the guide')
    : done.length === 0 ? (el ? 'Ξεκίνα' : 'Start') : (el ? 'Συνέχισε' : 'Continue');

  const showIntro = () => {
    close();
    window.dispatchEvent(new Event('show-welcome-modal'));
  };

  const rowClasses = "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors active:scale-[0.98]";

  return (
    <AnimatePresence>
      {sheetVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0f1117]/70 backdrop-blur-sm z-[9998]"
            onClick={close}
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label={el ? 'Συνοδός' : 'Companion'}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            data-nosnippet
            className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] max-h-[85dvh] bg-[#1a1d27]/98 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] rounded-t-[2rem] z-[9999] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] text-white"
          >
            <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
              <div className="w-10 h-1.5 bg-white/15 rounded-full" />
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#0f1117] flex items-center justify-center">
                    <CatInfinityAvatar className="w-9 h-9" />
                  </div>
                  <h2 className="font-display text-[17px] text-white/90">{el ? 'Συνοδός' : 'Companion'}</h2>
                </div>
                <button
                  onClick={close}
                  aria-label={el ? 'Κλείσιμο' : 'Close'}
                  className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/25 text-white/50 hover:text-white/85 hover:bg-white/[0.06] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* How do you feel right now? */}
              <HomeCheckin />

              {/* Continue */}
              <Link to={`/chapters/${nextChapter?.num ?? 1}`} onClick={close} className={rowClasses}>
                <BookOpen size={18} strokeWidth={1.5} className="shrink-0 text-[#8ba3ba]" />
                <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#8ba3ba]/70">{chapterLabel}</span>
                  <span className="text-[14px] leading-snug text-[#9bb8d1]">
                    {el ? 'Κεφάλαιο' : 'Chapter'} {nextChapter?.num} · {nextChapter?.title}
                  </span>
                </span>
                <ChevronRight size={16} className="text-white/30 shrink-0" />
              </Link>

              <button
                onClick={showIntro}
                className="self-center min-h-[44px] px-4 text-[12px] text-white/40 hover:text-white/70 transition-colors"
              >
                {el ? 'Δες ξανά την εισαγωγή' : 'See the introduction again'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
