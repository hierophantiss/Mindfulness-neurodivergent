import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, BookOpen, ChevronRight, ChevronDown, Info, Download, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
import { CHAPTER_TITLES } from '../data/chapterTitles';
import type { Chapter } from '../data/types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';
import InfoModal from '../components/InfoModal';

import { phraseOfDay } from '../data/affirmations';
import { readRecentCheckinState } from '../data/stateCheckin';
import { MethodMark } from '../components/MethodMark';
import { useInstallApp } from '../hooks/useInstallApp';
import HomeCheckin from '../components/HomeCheckin';
import { getMoreLinks } from '../data/moreLinks';
import { welcomeSeen, markWelcomeSeen, openWelcome } from '../lib/welcome';
import { readingSpot, chaptersRead } from '../lib/readingSpot';


// The full chapters (230 KB of text) load after the page shows. Until then the
// "Continue" card knows each chapter by its title; the page you stopped at
// fills in a moment later.
let chaptersLoaded: Record<string, Chapter[]> | null = null;
function useChapters(lang: 'el' | 'en'): Chapter[] {
  const [data, setData] = useState(chaptersLoaded);
  useEffect(() => {
    if (data) return;
    let alive = true;
    const load = () => import('../data/chapters').then(m => { chaptersLoaded = m.CHAPTERS_DATA; if (alive) setData(m.CHAPTERS_DATA); }).catch(() => {});
    // Once the page is shown and the phone is idle.
    const idle = (window as any).requestIdleCallback as ((cb: () => void, o?: { timeout: number }) => number) | undefined;
    const id = idle ? idle(load, { timeout: 2000 }) : window.setTimeout(load, 300);
    return () => { alive = false; if (idle) (window as any).cancelIdleCallback?.(id); else clearTimeout(id); };
  }, [data]);
  return useMemo(() => data?.[lang]
    || Object.entries(CHAPTER_TITLES[lang]).map(([n, title]) => ({ num: Number(n), title, theorySections: [] }) as unknown as Chapter),
  [data, lang]);
}

const footerLinkClasses = "sky-text flex items-center gap-1.5 py-2 text-[12px] text-ink/60 hover:text-ink/80 transition-colors";
const bookPillClasses = "whitespace-nowrap px-4 py-2 rounded-full border border-[var(--tint-sand-line)] bg-[var(--tint-sand-bg)] text-[11px] text-ink/65 hover:text-ink/80 hover:bg-white/[0.06] transition-colors";

const getDateString =(date: Date): string => {
  return date.toISOString().split('T')[0];
};

function getDayOfYear(date: Date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export default function Dashboard() {
  const { language } = useLanguage();
  const { companionData, updateCompanionData, setCompanionMessage, setSheetVisible } = useCompanion();
  const { hour } = useTime();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const { progress } = useProgress();

  const lang = language === 'el' ? 'el' : 'en';
  const chapters = useChapters(lang);
  // "Continue": where you stopped (the same answer the cat gives).
  const spot = readingSpot(chapters, progress.completedChapters, companionData.chapterProgress, companionData.lastChapter);
  const midChapter = spot.kind === 'resume' && spot.page > 0;
  // The cat remembers what you read; on the home page it lives in this card.
  const hasRead = chaptersRead(chapters, progress.completedChapters, companionData.chapterProgress).length > 0;
  const el = lang === 'el';
  const finishedGuide = spot.kind === 'done';
  const guideAction = finishedGuide
    ? (el ? 'Όλα τα κεφάλαια' : 'All chapters')
    : spot.kind === 'resume'
      ? (el ? 'Συνέχισε' : 'Continue')
      : (el ? 'Ξεκίνα' : 'Start');
  // The guide card: the line above the title, and the title.
  const guideTitle = finishedGuide ? (el ? 'Τον ολοκλήρωσες' : 'You finished it') : (spot.chapter?.title || '');
  const guideSub = finishedGuide
    ? (el ? 'Ο οδηγός σου' : 'Your guide')
    : `${el ? 'Κεφάλαιο' : 'Chapter'} ${spot.chapter?.num ?? ''}`;
  // Beside the button: the page you are on, or the chapter's subtitle.
  const guideNote = finishedGuide
    ? ''
    : midChapter
      ? (el ? `σελίδα ${spot.page + 1} από ${spot.pages.length}` : `page ${spot.page + 1} of ${spot.pages.length}`)
      : (spot.chapter?.sub || '');
  // The chapter's title in the colour of its axis (the first four chapters), else the Breath's blue.
  const AXIS_INK = ['--axis-body-ink', '--axis-breath-ink', '--axis-attention-ink', '--axis-space-ink'];
  const guideInk = spot.chapter && spot.chapter.num <= 4 && !finishedGuide ? `var(${AXIS_INK[spot.chapter.num - 1]})` : 'var(--tint-blue-ink)';

  // At night the lines of the sign step back a little (the infinity keeps its colours).
  const nightDim = hour >= 21 || hour < 5;

  const completedLessons = progress.completedLessons.length;
  const totalLessons = 56;
  const lessonProgressPct = Math.round((completedLessons / totalLessons) * 100);

  // "More": closed by default, remembered per device.
  const [moreOpen, setMoreOpen] = useState(() => {
    try { return localStorage.getItem('home_more_open') === '1'; } catch { return false; }
  });
  const toggleMore = () => setMoreOpen(o => {
    try { localStorage.setItem('home_more_open', o ? '0' : '1'); } catch { /* ignore */ }
    return !o;
  });
  const moreLinks = getMoreLinks(lang, completedLessons > 0 ? `${lessonProgressPct}%` : undefined);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [installHint, setInstallHint] = useState<string | null>(null);
  const { installed, install } = useInstallApp(language);

  // The welcome card, until the welcome is seen or put away.
  const [showWelcome, setShowWelcome] = useState(() => !welcomeSeen());
  useEffect(() => {
    const hide = () => setShowWelcome(false);
    window.addEventListener('welcome-seen', hide);
    return () => window.removeEventListener('welcome-seen', hide);
  }, []);

  useEffect(() => {
    if (!installHint) return;
    const t = setTimeout(() => setInstallHint(null), 8000);
    return () => clearTimeout(t);
  }, [installHint]);

  // The answer to "How do you feel" (last 90 minutes): after "Numbness" the
  // phrase of the day comes only from the body and contact lines.
  const [recentState, setRecentState] = useState(readRecentCheckinState);
  useEffect(() => {
    const onChange = () => setRecentState(readRecentCheckinState());
    window.addEventListener('storage', onChange);
    return () => window.removeEventListener('storage', onChange);
  }, []);
  // `hour` in the list so a new day brings a new phrase while the app stays open.
  const affirmation = useMemo(
    () => phraseOfDay(getDayOfYear(new Date()), recentState === 'hypo'),
    [hour, recentState]
  );

  const greeting = hour >= 6 && hour < 12
    ? (language === 'el' ? 'Καλημέρα' : 'Good morning')
    : hour >= 12 && hour < 18
      ? (language === 'el' ? 'Καλό απόγευμα' : 'Good afternoon')
      : (language === 'el' ? 'Καλό βράδυ' : 'Good evening');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  };

  const itemVariants: any = {
    // (no blur: blurring whole cards while they move is heavy for a phone)
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-ink font-sans selection:bg-[#4a9eca]/30 selection:text-ink pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <div className="relative z-10 w-full max-w-lg mx-auto px-2 flex flex-col pt-[calc(env(safe-area-inset-top,0px)+0.875rem)]">

        {/* Top row: the sign with the name, and SOS (there from the first second). */}
        <div className="w-full flex items-center justify-between gap-3 mt-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/method"
              aria-label={el ? 'Ο Τετραπλός Άξονας: τι σημαίνει το σήμα' : 'The Fourfold Axis: what the sign means'}
              className="shrink-0 rounded-full active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tint-blue-mark)]"
            >
              <MethodMark small breathe dim={nightDim} className="w-[34px] h-[34px]" />
            </Link>
            <span className="flex flex-col min-w-0 gap-[3px]">
              <span className="keep-font sky-text text-[13px] max-[359px]:text-[12px] leading-tight tracking-[0.14em] max-[374px]:tracking-[0.08em] uppercase text-sign-gold font-medium whitespace-nowrap">
                {el ? 'ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ' : 'MINDFULNESS'}
              </span>{' '}
              <span className="sky-text text-[12.5px] leading-tight text-ink/70">
                {el ? 'Για νευροδιαφορετικούς' : 'For neurodivergents'}
              </span>
            </span>
          </div>
          <Link
            to="/practice/breath/sos-breath"
            className="keep-font flex items-center justify-center h-10 px-4 rounded-full bg-[linear-gradient(160deg,rgb(240_194_200/0.16),rgb(240_194_200/0.05))] border border-[rgb(240_194_200/0.38)] shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] text-[var(--tint-rose-ink)] hover:brightness-110 active:scale-95 transition-all text-[13px] font-medium tracking-[0.1em] shrink-0"
            title={el ? 'Άμεση Ηρέμηση' : 'Immediate Calm'}
          >
            SOS
          </Link>
        </div>

        {/* The greeting and the phrase are there at once (no fade): they are the first
            words you read, and the page counts as shown only when they are. */}
        <div className="mt-10 [@media(max-height:700px)]:mt-6 flex flex-col gap-2.5">
          <h1 className="font-display sky-text text-[42px] max-[359px]:text-[36px] leading-[1.05] text-ink">
            {greeting}
          </h1>
          <p className="sky-text max-w-[300px] text-[16px] leading-[1.6] text-ink/80">
            {el ? affirmation.el : affirmation.en}
          </p>
        </div>

        {/* One card: where you are in the book, and one button to go on. */}
        <section aria-labelledby="home-guide-title" className="glass glass-gold rounded-[26px] mt-7 [@media(max-height:700px)]:mt-5 p-[22px]">
          <p className="text-[13px] text-ink/70">{guideSub}</p>
          <h2 id="home-guide-title" className="font-display mt-1 text-[34px] max-[359px]:text-[30px] leading-[1.1]" style={{ color: guideInk }}>
            {guideTitle}
          </h2>
          {midChapter && (
            <div className="mt-[18px] h-[3px] rounded-full bg-black/30 overflow-hidden" aria-hidden="true">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#5f8fd6,var(--tint-blue-ink))] shadow-[0_0_8px_rgb(127_169_228/0.6)]" style={{ width: `${Math.round(((spot.page + 1) / spot.pages.length) * 100)}%` }} />
            </div>
          )}
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-[14px] text-ink/70">{guideNote}</span>
            <Link
              to={spot.href}
              className="btn-gold shrink-0 inline-flex items-center gap-2 h-11 px-5 rounded-full whitespace-nowrap text-[15px] font-medium hover:brightness-105 transition-[filter,transform] active:scale-[0.98]"
            >
              {guideAction}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* How do you feel right now? A question on the sky, always in the same place. */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">
          <motion.section variants={itemVariants} aria-labelledby="home-checkin-title" className="mt-9 [@media(max-height:700px)]:mt-6">
            <h2 id="home-checkin-title" className="font-display sky-text mb-3.5 text-[24px] leading-tight text-ink">
              {el ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?'}
            </h2>
            <HomeCheckin embedded />
          </motion.section>

          {/* First visit: a small welcome that invites, never blocks or moves anything above. */}
          {showWelcome && (
            <motion.div variants={itemVariants} className="mt-4 flex items-start gap-3 rounded-2xl bg-[var(--tint-sage-bg)] border border-[var(--tint-sage-line)] pl-4 pr-2 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] leading-snug text-ink/90">
                  <span className="font-medium">{el ? 'Καλώς ήρθες.' : 'Welcome.'}</span>{' '}
                  {el ? 'Το μυαλό σου δεν είναι χαλασμένο, απλώς λειτουργεί αλλιώς.' : 'Your mind isn’t broken, it just works differently.'}
                </p>
                <button
                  onClick={openWelcome}
                  aria-label={el ? 'Γνώρισε την εφαρμογή · 3 κάρτες' : 'Get to know the app · 3 cards'}
                  className="mt-2 min-h-[36px] inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 bg-[var(--tint-sage-hi)] border border-[var(--tint-sage-line)] text-[13px] text-ink/85 hover:text-ink transition-colors"
                >
                  {el ? 'Γνώρισε την εφαρμογή' : 'Get to know the app'}
                  <span className="text-ink/70 max-[359px]:hidden">· {el ? '3 κάρτες' : '3 cards'}</span>
                </button>
              </div>
              <button
                onClick={markWelcomeSeen}
                aria-label={el ? 'Κλείσιμο καλωσορίσματος' : 'Close the welcome'}
                className="shrink-0 w-10 h-10 -mt-1 rounded-full flex items-center justify-center text-ink/50 hover:text-ink/80 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          {/* More: one small button that opens the whole app, for those who want to explore first */}
          <motion.div variants={itemVariants} className="flex flex-col items-start gap-3 mt-6">
            <button
              onClick={toggleMore}
              aria-expanded={moreOpen}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--tint-sand-bg)] border border-[var(--tint-sand-line)] text-[13px] text-ink/75 hover:text-ink/90 hover:brightness-110 transition-colors active:scale-[0.97]"
            >
              {lang === 'el' ? 'Περισσότερα' : 'More'}
              <ChevronDown size={15} className={cn("transition-transform duration-300", moreOpen && "rotate-180")} />
            </button>
            {moreOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full flex flex-col gap-2"
              >
                {hasRead && (
                  <button
                    onClick={() => setSheetVisible(true)}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--tint-blue-bg)] border border-[var(--tint-blue-line)] hover:brightness-110 transition-colors active:scale-[0.98] text-left"
                  >
                    <BookOpen size={18} strokeWidth={1.5} className="shrink-0 opacity-80 text-[var(--tint-blue-mark)]" aria-hidden="true" />
                    <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                      <span className="text-[14px] leading-tight text-ink/85">{el ? 'Τι έχεις διαβάσει' : 'What you have read'}</span>
                      <span className="text-[12px] leading-snug text-ink/45">{el ? 'Τα κεφάλαια και οι σελίδες σου' : 'Your chapters and pages'}</span>
                    </span>
                    <ChevronRight size={16} className="text-ink/30 shrink-0" />
                  </button>
                )}
                {moreLinks.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--tint-blue-bg)] border border-[var(--tint-blue-line)] hover:brightness-110 transition-colors active:scale-[0.98]"
                  >
                    <item.icon size={18} strokeWidth={1.5} className={cn("shrink-0 opacity-80", item.tone)} />
                    <span className="flex flex-col min-w-0 flex-1 gap-0.5">
                      <span className="flex items-baseline gap-2 text-[14px] leading-tight text-ink/85">
                        {item.label}
                        {item.sub && <span className="text-[11px] font-mono text-ink/40">{item.sub}</span>}
                      </span>
                      <span className="text-[12px] leading-snug text-ink/45">{item.desc}</span>
                    </span>
                    <ChevronRight size={16} className="text-ink/30 shrink-0" />
                  </Link>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 mb-6 flex flex-col items-center justify-center gap-3 text-center"
        >
          <div className="flex items-center justify-center gap-x-3 gap-y-2 flex-wrap">
            <button
              onClick={() => { setBookOpen(o => !o); setInstallHint(null); }}
              aria-expanded={bookOpen}
              className={cn(footerLinkClasses, bookOpen && "text-ink/60")}
            >
              <BookOpen size={12} />
              <span>{language === 'el' ? 'Το βιβλίο' : 'The book'}</span>
            </button>
            <button onClick={() => setIsInfoOpen(true)} className={footerLinkClasses}>
              <Info size={12} />
              <span>{language === 'el' ? 'Σχετικά' : 'About'}</span>
            </button>
            {!installed && (
              <button
                onClick={async () => { setBookOpen(false); setInstallHint(await install()); }}
                className={footerLinkClasses}
              >
                <Download size={12} />
                <span>{language === 'el' ? 'Εγκατάσταση' : 'Install'}</span>
              </button>
            )}
          </div>

          {bookOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex flex-wrap justify-center gap-2">
                <a href={`/workbook_${language}.pdf`} download className={bookPillClasses}>
                  {language === 'el' ? 'PDF · εκτύπωση' : 'PDF · print'}
                </a>
                <a href={`/workbook_${language}.epub`} download className={bookPillClasses}>
                  EPUB · e-reader
                </a>
                <a href={`/audio/mindfulness-guide-${language}.mp3`} download={`mindfulness-guide-${language}.mp3`} className={bookPillClasses}>
                  {language === 'el' ? 'MP3 · ακουστικό' : 'MP3 · audiobook'}
                </a>
              </div>
              <span className="text-[10px] text-ink/25">
                {language === 'el' ? 'Δωρεάν · CC BY-NC-ND 4.0' : 'Free · CC BY-NC-ND 4.0'}
              </span>
            </motion.div>
          )}

          {installHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-[280px] text-[11px] leading-relaxed text-ink/45"
            >
              {installHint}
            </motion.p>
          )}
        </motion.div>

      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}


