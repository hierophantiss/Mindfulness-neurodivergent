import { useFocusTrap } from '../hooks/useFocusTrap';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Anchor, BookOpen, Check, ChevronDown, ChevronRight, HelpCircle, X } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { CHAPTER_TAKEAWAYS } from '../data/takeaways';
import { chapterPages, chapterPageLabel } from '../lib/chapterPages';
import { readingSpot, savedPage, chaptersRead } from '../lib/readingSpot';
import { cn } from '../lib/utils';
import { CatInfinityAvatar } from './CatInfinityAvatar';
import HomeCheckin from './HomeCheckin';
import { placeOf, isQuiet, setQuiet } from '../lib/companionTips';
import { welcomeSeen } from '../lib/welcome';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';

/** Takeaways carry concept markers ("text{{id}}") for the chapter page; here only the words. */
const plain = (t: string) => t.replace(/\{\{[^}]*\}\}/g, '');

const dayNumber = (d: Date) => Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 86400000);

function whenLabel(iso: string | undefined, el: boolean): string {
  if (!iso) return '';
  const days = dayNumber(new Date()) - dayNumber(new Date(iso));
  if (days <= 0) return el ? 'σήμερα' : 'today';
  if (days === 1) return el ? 'χθες' : 'yesterday';
  return el ? `πριν από ${days} μέρες` : `${days} days ago`;
}

// The cat's sheet answers "what now?": how you feel (and what fits), where you
// stopped or a first small step, one thing to keep in mind today, what each
// chapter you read was about, and what the page you are on is.
export default function CompanionSheet() {
  const { sheetVisible, setSheetVisible, companionData } = useCompanion();
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'el';
  const el = lang === 'el';
  const { progress } = useProgress();
  const location = useLocation();
  const [openNum, setOpenNum] = useState<number | null>(null);
  const [quiet, setQuietState] = useState(isQuiet);
  const { logs } = useActivityTracker();
  const here = placeOf(location.pathname);
  // The welcome now lives here, with the cat: until it is seen, it comes first.
  const [newcomer] = useState(() => !welcomeSeen());

  const close = () => setSheetVisible(false);
  const modalRef = useFocusTrap(sheetVisible, close);

  // Any link inside the sheet takes you somewhere: the sheet steps aside.
  // (Not when the sheet first appears: it loads only once it is opened.)
  const shownAt = useRef(location.pathname);
  useEffect(() => {
    if (shownAt.current === location.pathname) return;
    shownAt.current = location.pathname;
    setSheetVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const chapters = CHAPTERS_DATA[lang] || [];
  const cp = companionData.chapterProgress || {};
  const isDone = (n: number) => progress.completedChapters.includes(String(n));
  const read = chaptersRead(chapters, progress.completedChapters, cp);

  // Where you stopped — the same answer as the home page's "Continue".
  const spot = readingSpot(chapters, progress.completedChapters, cp, companionData.lastChapter);
  const spotWhen = whenLabel(spot.lastVisit, el);
  const pageOf = (n: number, count: number) => savedPage(cp[n], count);

  // One sentence from a chapter you have read, a different one each day.
  const readKey = read.map(c => c.num).join(',');
  const reminder = useMemo(() => {
    const pool: { num: number; text: string }[] = [];
    for (const c of read) for (const t of CHAPTER_TAKEAWAYS[lang]?.[c.num] || []) pool.push({ num: c.num, text: plain(t) });
    if (pool.length === 0) return null;
    return pool[dayNumber(new Date()) % pool.length];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readKey, lang]);

  // "What is here?": the cat says again what this place is.
  const tipAgain = () => {
    close();
    setTimeout(() => window.dispatchEvent(new Event('companion-tip-again')), 350);
  };
  const toggleQuiet = () => { setQuiet(!quiet); setQuietState(!quiet); };

  const showIntro = () => {
    close();
    window.dispatchEvent(new Event('show-welcome-modal'));
  };

  const cardClasses = "card-relief flex items-center gap-3.5 px-4 py-4 rounded-2xl hover:brightness-110 transition-[filter,transform] active:scale-[0.98]";
  const eyebrow = "text-[13px] text-[#8ba3ba]/70";
  const chapterWord = el ? 'Κεφάλαιο' : 'Chapter';

  const whereCard = () => {
    // Someone new, who has neither read nor practised: one first step that works,
    // fifteen seconds of gravity (first the earth), then the book.
    if (read.length === 0 && logs.length === 0) {
      return (
        <div className="flex flex-col gap-2.5">
          <Link to="/practice/body/gravity-sink" onClick={close} className={cardClasses}>
            <Anchor size={18} strokeWidth={1.5} className="shrink-0 text-[var(--axis-body-ink)]" />
            <span className="flex flex-col min-w-0 flex-1 gap-0.5">
              <span className={eyebrow}>{el ? 'Ένα πρώτο βήμα · 20 δευτερόλεπτα' : 'A first step · 20 seconds'}</span>
              <span className="text-[14px] leading-snug text-[#9bb8d1]">{el ? 'Βύθιση στη Βαρύτητα' : 'Gravity Sink'}</span>
              <span className="text-[12px] leading-snug text-ink/70">{el ? 'Πρώτα η γη: νιώσε το βάρος σου.' : 'First the earth: feel your weight.'}</span>
            </span>
            <ChevronRight size={16} className="text-ink/70 shrink-0" />
          </Link>
          <Link to={spot.href} onClick={close} className={cardClasses}>
            <BookOpen size={18} strokeWidth={1.5} className="shrink-0 text-[#8ba3ba]" />
            <span className="flex flex-col min-w-0 flex-1 gap-0.5">
              <span className={eyebrow}>{el ? 'Μετά, το βιβλίο' : 'Then, the book'}</span>
              <span className="text-[14px] leading-snug text-[#9bb8d1]">{chapterWord} {spot.chapter?.num} · {spot.chapter?.title}</span>
            </span>
            <ChevronRight size={16} className="text-ink/70 shrink-0" />
          </Link>
          <p className="text-[12.5px] leading-relaxed text-ink/60 px-1">
            {el ? 'Όταν ξεκινήσεις να διαβάζεις, θα θυμάμαι πού σταμάτησες.' : 'When you start reading, I will remember where you stopped.'}
          </p>
        </div>
      );
    }
    if (read.length === 0) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-[14px] leading-relaxed text-ink/70 px-1">
            {el ? 'Όταν ξεκινήσεις να διαβάζεις, θα θυμάμαι πού σταμάτησες.' : 'When you start reading, I will remember where you stopped.'}
          </p>
          <Link to={spot.href} onClick={close} className={cardClasses}>
            <BookOpen size={18} strokeWidth={1.5} className="shrink-0 text-[#8ba3ba]" />
            <span className="flex flex-col min-w-0 flex-1 gap-0.5">
              <span className={eyebrow}>{el ? 'Ξεκίνα' : 'Start'}</span>
              <span className="text-[14px] leading-snug text-[#9bb8d1]">{chapterWord} {spot.chapter?.num} · {spot.chapter?.title}</span>
            </span>
            <ChevronRight size={16} className="text-ink/70 shrink-0" />
          </Link>
        </div>
      );
    }
    if (spot.kind === 'resume' || spot.kind === 'start') {
      return (
        <Link to={spot.href} onClick={close} className={cardClasses}>
          <BookOpen size={18} strokeWidth={1.5} className="shrink-0 text-[#8ba3ba]" />
          <span className="flex flex-col min-w-0 flex-1 gap-1">
            <span className={eyebrow}>{el ? 'Σταμάτησες εδώ' : 'You stopped here'}{spotWhen && ` · ${spotWhen}`}</span>
            <span className="text-[14px] leading-snug text-[#9bb8d1]">{chapterWord} {spot.chapter?.num} · {spot.chapter?.title}</span>
            <span className="text-[12px] leading-snug text-ink/70">
              {chapterPageLabel(spot.pages[spot.page], lang)} · {el ? `σελίδα ${spot.page + 1} από ${spot.pages.length}` : `page ${spot.page + 1} of ${spot.pages.length}`}
            </span>
            <span className="text-[12px] text-teal-300/80 mt-1">{el ? 'Συνέχισε από εκεί' : 'Continue from there'}</span>
          </span>
          <ChevronRight size={16} className="text-ink/70 shrink-0" />
        </Link>
      );
    }
    return (
      <Link to={spot.href} onClick={close} className={cardClasses}>
        <BookOpen size={18} strokeWidth={1.5} className="shrink-0 text-[#8ba3ba]" />
        <span className="flex flex-col min-w-0 flex-1 gap-1">
          {spot.finished && (
            <span className={eyebrow}>
              {el ? `Τελείωσες το Κεφάλαιο ${spot.finished.num}` : `You finished Chapter ${spot.finished.num}`}{spotWhen && ` · ${spotWhen}`}
            </span>
          )}
          <span className="text-[14px] leading-snug text-[#9bb8d1]">
            {spot.kind === 'next'
              ? `${el ? 'Επόμενο' : 'Next'}: ${chapterWord} ${spot.chapter?.num} · ${spot.chapter?.title}`
              : (el ? 'Διάβασες όλα τα κεφάλαια' : 'You have read every chapter')}
          </span>
        </span>
        <ChevronRight size={16} className="text-ink/70 shrink-0" />
      </Link>
    );
  };

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
            className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] max-h-[85dvh] bg-[#1a1d27]/98 backdrop-blur-2xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] rounded-t-[2rem] z-[9999] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] text-ink"
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
                  <h2 className="font-display text-[17px] text-ink/90">{el ? 'Συνοδός' : 'Companion'}</h2>
                </div>
                <button
                  onClick={close}
                  aria-label={el ? 'Κλείσιμο' : 'Close'}
                  className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/25 text-ink/70 hover:text-ink/85 hover:bg-white/[0.06] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {newcomer ? (
                // Someone new: one thing to do, then two quieter ways on.
                <div className="flex flex-col gap-4">
                  <p className="px-1 text-[15px] leading-relaxed text-ink/90">
                    <span className="font-medium">{el ? 'Καλώς ήρθες.' : 'Welcome.'}</span>{' '}
                    {el ? 'Ας ξεκινήσουμε με κάτι μικρό.' : 'Let’s start with something small.'}
                  </p>
                  <Link to="/practice/body/gravity-sink" onClick={close} className="flex items-center gap-3.5 rounded-2xl px-4 py-4 bg-[color-mix(in_srgb,var(--axis-body-ink)_12%,transparent)] border border-[color-mix(in_srgb,var(--axis-body-ink)_40%,transparent)] hover:brightness-110 active:scale-[0.98] transition-[filter,transform]">
                    <Anchor size={20} strokeWidth={1.6} className="shrink-0 text-[var(--axis-body-ink)]" aria-hidden="true" />
                    <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                      <span className="text-[15.5px] leading-snug text-ink">{el ? 'Βύθιση στη Βαρύτητα · 20 δευτ.' : 'Gravity Sink · 20 sec'}</span>
                      <span className="text-[13px] leading-snug text-ink/75">{el ? 'Πρώτα η γη: νιώσε το βάρος σου.' : 'First the earth: feel your weight.'}</span>
                    </span>
                    <ChevronRight size={18} className="text-ink/70 shrink-0" aria-hidden="true" />
                  </Link>
                  <div className="flex flex-col gap-1 px-1">
                    <button onClick={showIntro} className="self-start min-h-[44px] text-[14px] text-ink/80 hover:text-ink underline decoration-white/25 underline-offset-4">
                      {el ? 'Ή γνώρισε πρώτα την εφαρμογή · 3 κάρτες' : 'Or get to know the app first · 3 cards'}
                    </button>
                    <Link to={spot.href} onClick={close} className="self-start min-h-[44px] flex items-center text-[14px] text-ink/80 hover:text-ink underline decoration-white/25 underline-offset-4">
                      {el ? 'Ή άνοιξε το βιβλίο · Κεφάλαιο 1' : 'Or open the book · Chapter 1'}
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* How you feel, and what fits now. */}
                  <HomeCheckin />

                  {/* Where you stopped, or a first step */}
                  {whereCard()}
                </>
              )}

              {/* Something to keep in mind today */}
              {reminder && (
                <figure className="px-1">
                  <figcaption className="text-[13px] text-ink/65 mb-2">
                    {el ? `Για σήμερα · από το Κεφάλαιο ${reminder.num}` : `For today · from Chapter ${reminder.num}`}
                  </figcaption>
                  <blockquote className="font-light text-[16px] leading-relaxed text-ink/80">
                    {el ? `«${reminder.text}»` : `“${reminder.text}”`}
                  </blockquote>
                </figure>
              )}

              {/* What you have read */}
              {read.length > 0 && (
                <section className="flex flex-col gap-2">
                  <h3 className="flex items-baseline justify-between px-1 text-[13px] text-ink/70">
                    <span>{el ? 'Τι έχεις διαβάσει' : 'What you have read'}</span>
                    <span className="text-[12px] font-mono text-ink/70">{progress.completedChapters.length}/{chapters.length}</span>
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {read.map(c => {
                      const open = openNum === c.num;
                      const count = chapterPages(c).length;
                      const takeaways = CHAPTER_TAKEAWAYS[lang]?.[c.num] || [];
                      return (
                        <li key={c.num} className="card-relief rounded-2xl overflow-hidden">
                          <button
                            onClick={() => setOpenNum(open ? null : c.num)}
                            aria-expanded={open}
                            className="w-full min-h-[48px] flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-colors"
                          >
                            <span className="w-6 text-[12px] font-mono text-ink/70 shrink-0">{c.num}</span>
                            <span className="flex-1 min-w-0 text-[14px] leading-snug text-ink/80">{c.title}</span>
                            {isDone(c.num)
                              ? <Check size={15} className="text-teal-300/80 shrink-0" aria-label={el ? 'Ολοκληρώθηκε' : 'Finished'} />
                              : <span className="text-[12px] font-mono text-ink/70 shrink-0">{pageOf(c.num, count) + 1}/{count}</span>}
                            <ChevronDown size={15} className={cn("text-ink/70 shrink-0 transition-transform", open && "rotate-180")} />
                          </button>
                          {open && (
                            <div className="px-4 pb-4 pl-[52px] flex flex-col gap-3">
                              <ul className="flex flex-col gap-2">
                                {takeaways.map((t, i) => (
                                  <li key={i} className="text-[13px] leading-relaxed text-ink/65 flex gap-2">
                                    <span className="text-ink/70" aria-hidden="true">·</span>
                                    <span>{plain(t)}</span>
                                  </li>
                                ))}
                              </ul>
                              <Link to={`/chapters/${c.num}`} onClick={close} className="self-start min-h-[36px] flex items-center gap-1 text-[12px] text-teal-300/80 hover:text-teal-200">
                                {el ? 'Άνοιξε το κεφάλαιο' : 'Open the chapter'} <ChevronRight size={14} />
                              </Link>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              {/* What is this page? And a quiet cat, for those who prefer it. */}
              <div className="flex flex-col gap-1.5">
                {here && !newcomer && (
                  <button onClick={tipAgain} className="flex items-center gap-3 min-h-[48px] px-4 rounded-2xl text-left text-[14px] text-ink/80 hover:bg-white/[0.04] transition-colors">
                    <HelpCircle size={17} strokeWidth={1.6} className="shrink-0 text-ink/60" aria-hidden="true" />
                    {el ? 'Τι υπάρχει σε αυτή τη σελίδα;' : 'What is on this page?'}
                  </button>
                )}
                <button
                  role="switch"
                  aria-checked={quiet}
                  onClick={toggleQuiet}
                  className="flex items-center justify-between gap-3 min-h-[48px] px-4 rounded-2xl text-left hover:bg-white/[0.04] transition-colors"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[14px] text-ink/80">{el ? 'Ήσυχη γάτα' : 'Quiet cat'}</span>
                    <span className="text-[12px] text-ink/60">{el ? 'Χωρίς μηνύματα στις σελίδες' : 'No messages on the pages'}</span>
                  </span>
                  <span aria-hidden="true" className={cn("relative shrink-0 w-10 h-6 rounded-full border transition-colors", quiet ? "bg-teal-400/30 border-teal-300/50" : "bg-white/[0.06] border-white/15")}>
                    <span className={cn("absolute top-0.5 w-[18px] h-[18px] rounded-full bg-ink/85 transition-[left]", quiet ? "left-[18px]" : "left-0.5")} />
                  </span>
                </button>
              </div>

              {!newcomer && <button
                onClick={showIntro}
                className="self-center min-h-[44px] px-4 text-[12px] text-ink/70 hover:text-ink/70 transition-colors"
              >
                {el ? 'Δες ξανά την εισαγωγή' : 'See the introduction again'}
              </button>}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
