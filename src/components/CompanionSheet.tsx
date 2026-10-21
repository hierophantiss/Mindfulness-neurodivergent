import { useFocusTrap } from '../hooks/useFocusTrap';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, Wind, X } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { SOS_PATH } from '../data/stateCheckin';
import { getMoreLinks } from '../data/moreLinks';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import HomeCheckin from './HomeCheckin';

const TOTAL_LESSONS = 56;

// The cat's sheet: a quiet shortcut to the same things the home page offers,
// for when you are somewhere else in the app.
export default function CompanionSheet() {
  const { sheetVisible, setSheetVisible, companionData } = useCompanion();
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

  const week = companionData.programProgress?.week || 0;
  const day = companionData.programProgress?.day || 0;
  const lessons = progress.completedLessons.length;
  const moreLinks = getMoreLinks(lang, lessons > 0 ? `${Math.round((lessons / TOTAL_LESSONS) * 100)}%` : undefined);

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

              {/* Continue */}
              <div className="flex flex-col gap-2">
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

                {week > 0 && (
                  <Link to={`/program/week/${week}`} onClick={close} className={rowClasses}>
                    <Calendar size={18} strokeWidth={1.5} className="shrink-0 text-[#b0c4aa]" />
                    <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#b0c4aa]/70">{el ? 'Πρόγραμμα' : 'Program'}</span>
                      <span className="text-[14px] leading-snug text-white/85">
                        {el ? `Εβδομάδα ${week}, Ημέρα ${day + 1}` : `Week ${week}, Day ${day + 1}`}
                      </span>
                    </span>
                    <ChevronRight size={16} className="text-white/30 shrink-0" />
                  </Link>
                )}

                <Link to={SOS_PATH} onClick={close} className={rowClasses}>
                  <Wind size={18} strokeWidth={1.5} className="shrink-0 text-[#7dd3fc]" />
                  <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                    <span className="text-[14px] leading-tight text-white/85">{el ? 'Αναπνοή SOS' : 'SOS Breath'}</span>
                    <span className="text-[12px] leading-snug text-white/45">{el ? 'Όταν χρειάζεσαι ηρεμία τώρα' : 'When you need calm now'}</span>
                  </span>
                  <ChevronRight size={16} className="text-white/30 shrink-0" />
                </Link>
              </div>

              {/* How do you feel right now? */}
              <HomeCheckin />

              {/* The rest of the app */}
              <div className="flex flex-col gap-2">
                {moreLinks.map(item => (
                  <Link key={item.to} to={item.to} onClick={close} className={rowClasses}>
                    <item.icon size={18} strokeWidth={1.5} className={`shrink-0 opacity-80 ${item.tone}`} />
                    <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                      <span className="flex items-baseline gap-2 text-[14px] leading-tight text-white/85">
                        {item.label}
                        {item.sub && <span className="text-[11px] font-mono text-white/40">{item.sub}</span>}
                      </span>
                      <span className="text-[12px] leading-snug text-white/45">{item.desc}</span>
                    </span>
                    <ChevronRight size={16} className="text-white/30 shrink-0" />
                  </Link>
                ))}
              </div>

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
