import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, BookOpen, ChevronRight, Headphones, Info, Download, X } from 'lucide-react';
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
import InfoModal from '../components/InfoModalLazy';

import { phraseOfDay } from '../data/affirmations';
import { readRecentCheckinState } from '../data/stateCheckin';
import { MethodMark } from '../components/MethodMark';
import { useInstallApp } from '../hooks/useInstallApp';
import { PLACE_PATHS } from '../components/placeIcons';
import HomeCheckin from '../components/HomeCheckin';
import BackupReminder from '../components/BackupReminder';
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

const footerLinkClasses = "sky-text flex items-center gap-1.5 min-h-[44px] text-[14px] text-ink/75 hover:text-ink transition-colors";
const bookPillClasses = "whitespace-nowrap px-4 py-2 rounded-full border border-[var(--tint-sand-line)] bg-[var(--tint-sand-bg)] text-[12px] text-ink/65 hover:text-ink/80 hover:bg-white/[0.06] transition-colors";

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
  // The chapter's title in the colour of its axis (the first four chapters), else the Breath's blue.
  const AXIS_INK = ['--axis-body-ink', '--axis-breath-ink', '--axis-attention-ink', '--axis-space-ink'];
  const guideInk = spot.chapter && spot.chapter.num <= 4 && !finishedGuide ? `var(${AXIS_INK[spot.chapter.num - 1]})` : 'var(--tint-blue-ink)';

  // At night the lines of the sign step back a little (the infinity keeps its colours).
  const nightDim = hour >= 21 || hour < 5;

  const completedLessons = progress.completedLessons.length;
  const totalLessons = 56;
  const lessonProgressPct = Math.round((completedLessons / totalLessons) * 100);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const { installed } = useInstallApp(language);

  // The welcome card, until the welcome is seen or put away.
  const [showWelcome, setShowWelcome] = useState(() => !welcomeSeen());
  useEffect(() => {
    const hide = () => setShowWelcome(false);
    window.addEventListener('welcome-seen', hide);
    return () => window.removeEventListener('welcome-seen', hide);
  }, []);


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

  // "Listen": the same place, with the narration starting (ChapterDetail reads ?listen=1).
  const listenHref = finishedGuide ? '' : `${spot.href}${spot.href.includes('?') ? '&' : '?'}listen=1`;
  // Everything else, on one shelf that scrolls sideways (the next card always peeks).
  const evening = hour >= 18 || hour < 5;
  /** phoneOnly: on a computer the side bar already has it. */
  type ShelfItem = { key: string; to?: string; onClick?: () => void; title: string; sub: string; ink: string; icon: string; phoneOnly?: boolean };
  const ICONS = {
    drop: PLACE_PATHS.drop,
    moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
    sprout: PLACE_PATHS.sprout,
    waves: PLACE_PATHS.waves,
    book: 'M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z',
    spiral: PLACE_PATHS.spiral,
    quill: PLACE_PATHS.quill,
    // The sign's own figure: the vertical axis through a circle.
    axis: 'M12 2.5v19M3.5 12a8.5 8.5 0 1 0 17 0 8.5 8.5 0 1 0-17 0',
    bookmark: 'M6 3h12v18l-6-4-6 4z',
  };
  const shelf: ShelfItem[] = [
    ...(evening ? [{ key: 'close', to: '/journal', title: el ? 'Κλείσιμο της μέρας' : 'Closing the day', sub: el ? 'Τι κουβαλάς ακόμα από σήμερα;' : 'What are you still carrying from today?', ink: 'var(--tint-lav-ink)', icon: ICONS.moon }] : []),
    { key: 'micro', to: '/practice/microdoses', title: el ? 'Μικροδόσεις' : 'Microdoses', sub: el ? 'Ασκήσεις λίγων δευτερολέπτων, που δεν φαίνονται' : 'Practices of a few seconds, unseen by others', ink: 'var(--axis-attention-ink)', icon: ICONS.drop },
    { key: 'sanctuary', to: '/sanctuary', title: el ? 'Καταφύγιο' : 'Sanctuary', sub: el ? 'Βροχή, ωκεανός, ήχοι για ύπνο και ηρεμία' : 'Rain, ocean, sounds for sleep and calm', ink: 'var(--tint-lav-ink)', icon: ICONS.waves },
    { key: 'program', to: '/program', title: el ? 'Πρόγραμμα 8 εβδομάδων' : '8-week Program', sub: completedLessons > 0 ? (el ? `Μία μικρή πρακτική τη μέρα · ${lessonProgressPct}%` : `One small practice a day · ${lessonProgressPct}%`) : (el ? 'Μία μικρή πρακτική τη μέρα' : 'One small practice a day'), ink: 'var(--axis-body-ink)', icon: ICONS.sprout },
    { key: 'book', onClick: () => { setBookOpen(true); window.setTimeout(() => document.getElementById('home-book')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' }), 50); }, title: el ? 'Το βιβλίο' : 'The book', sub: el ? 'PDF, EPUB και ακουστικό, δωρεάν' : 'PDF, EPUB and audiobook, free', ink: 'var(--axis-breath-ink)', icon: ICONS.book },
    { key: 'rabbit', to: '/rabbithole', title: el ? 'Κουνελότρυπα' : 'Rabbit Hole', sub: el ? 'Κείμενα και βίντεο για όσους θέλουν βάθος' : 'Texts and videos for those who want depth', ink: 'var(--axis-attention-ink)', icon: ICONS.spiral },
    // The four axes were a section of their own; for someone new they were four figures to decode. The method is one place here, and the axes are a way into the practices on the Practice page.
    { key: 'method', to: '/method', title: el ? 'Η Μέθοδος' : 'The Method', sub: el ? 'Οι τέσσερις άξονες: Σώμα, Αναπνοή, Προσοχή, Χώρος' : 'The four axes: Body, Breath, Attention, Space', ink: 'var(--color-sign-gold)', icon: ICONS.axis, phoneOnly: true },
    ...(!evening ? [{ key: 'journal', to: '/journal', title: el ? 'Ημερολόγιο' : 'Journal', sub: el ? 'Δυο γραμμές για σήμερα' : 'Two lines for today', ink: 'var(--tint-rose-ink)', icon: ICONS.quill }] : []),
    ...(hasRead ? [{ key: 'read', onClick: () => setSheetVisible(true), title: el ? 'Τι έχεις διαβάσει' : 'What you have read', sub: el ? 'Τα κεφάλαια και οι σελίδες σου' : 'Your chapters and pages', ink: 'var(--axis-breath-ink)', icon: ICONS.bookmark }] : []),
  ];
  const shelfCard = "flex items-center gap-3.5 min-h-[64px] px-4 py-3 text-left hover:bg-white/[0.04] transition-colors active:bg-white/[0.06] desk:min-h-[96px] desk:items-start desk:gap-4 desk:p-5 desk:rounded-[24px] desk:hover:bg-transparent desk:hover:brightness-110 desk:transition-[filter,transform] desk:hover:-translate-y-0.5";
  const sectionTitle = "sky-text text-[15px] font-normal text-ink/90 desk:font-display desk:text-[27px] desk:text-ink";
  // The key line of the chapter you are in (once the chapters have loaded), for the wide guide card.
  const guideLine = !finishedGuide ? (spot.chapter?.insight || '') : '';

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-ink font-sans selection:bg-[#4a9eca]/30 selection:text-ink pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <div className="relative z-10 w-full max-w-lg mx-auto px-1.5 flex flex-col pt-[calc(env(safe-area-inset-top,0px)+0.875rem)] desk:max-w-none desk:px-0 desk:pt-4">

        {/* Top row: the sign with the name, and SOS (there from the first second). */}
        <div className="w-full flex items-center justify-between gap-3 mt-2 desk:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/method"
              aria-label={el ? 'Ο Τετραπλός Άξονας: τι σημαίνει το σήμα' : 'The Fourfold Axis: what the sign means'}
              className="shrink-0 rounded-full active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tint-blue-mark)]"
            >
              <MethodMark small breathe dim={nightDim} className="w-[30px] h-[30px]" />
            </Link>
            <span className="flex flex-col min-w-0 gap-0.5">
              <span className="keep-font sky-text font-display text-[18px] leading-none text-sign-gold whitespace-nowrap">
                {el ? 'Ενσυνειδητότητα' : 'Mindfulness'}
              </span>{' '}
              <span className="sky-text text-[13px] leading-tight text-ink/70 whitespace-nowrap">
                {el ? 'Για νευροδιαφορετικούς' : 'For neurodivergents'}
              </span>
            </span>
          </div>
          <Link
            to="/practice/breath/sos-breath"
            className="keep-font flex items-center justify-center min-w-[52px] min-h-[44px] pl-1 shrink-0"
            title={el ? 'Άμεση Ηρέμηση' : 'Immediate Calm'}
          >
            {/* "SOS" alone could read as an emergency call: it says it is a way to calm down now. */}
            <span className="flex items-center justify-center gap-1 h-9 px-3 rounded-full bg-[rgb(240_194_200/0.08)] border border-[rgb(240_194_200/0.36)] text-[var(--tint-rose-ink)] text-[13px] font-medium whitespace-nowrap">
              <span className="tracking-[0.08em]">SOS</span>
              <span className="font-normal max-[339px]:hidden">{el ? 'ηρεμία' : 'calm'}</span>
            </span>
          </Link>
        </div>

        {/* The greeting is there at once (no fade): it is the first word you read,
            and the page counts as shown only when it is. */}
        <div className="mt-6 [@media(max-height:700px)]:mt-4 desk:mt-2">
          <h1 className="font-display sky-text text-[38px] max-[359px]:text-[34px] leading-[1.05] text-ink desk:text-[60px] desk:leading-none">
            {greeting}
          </h1>
        </div>

        {/* First visit only: a small welcome, high up where a newcomer looks. Once seen or put away, it is gone. */}
        {showWelcome && (
          <div className="glass mt-5 flex items-start gap-3 rounded-[24px] desk:rounded-[28px] desk:max-w-[760px] pl-[18px] pr-2 pt-3.5 pb-4 desk:mt-7 desk:pl-7 desk:pr-4 desk:py-5">
          <div className="flex-1 min-w-0">
            <p className="text-[15px] leading-snug text-ink/90">
              <span className="font-medium">{el ? 'Καλώς ήρθες.' : 'Welcome.'}</span>{' '}
              {el ? 'Το μυαλό σου δεν είναι χαλασμένο, απλώς λειτουργεί αλλιώς.' : 'Your mind isn’t broken, it just works differently.'}
            </p>
            <button
              onClick={openWelcome}
              aria-label={el ? 'Γνώρισε την εφαρμογή · 3 κάρτες' : 'Get to know the app · 3 cards'}
              className="btn-soft mt-3 !min-h-[44px] !text-[14px]"
            >
              {el ? 'Γνώρισε την εφαρμογή' : 'Get to know the app'}
              <span className="text-ink/70 max-[359px]:hidden">· {el ? '3 κάρτες' : '3 cards'}</span>
            </button>
          </div>
          <button
            onClick={markWelcomeSeen}
            aria-label={el ? 'Κλείσιμο καλωσορίσματος' : 'Close the welcome'}
            className="shrink-0 w-11 h-11 -mt-1.5 rounded-full flex items-center justify-center text-ink/70 hover:text-ink/80 transition-colors"
          >
            <X size={16} />
          </button>
          </div>
        )}

        {/* First "How do you feel", then the guide; on a computer side by side, in the same order. */}
        <div className="desk:grid desk:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] wide:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] desk:gap-5 desk:mt-9 desk:items-start">
          {/* How do you feel right now? First, and always in the same place. */}
          <motion.section variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.4 }} aria-labelledby="home-checkin-title" className="mt-[26px] [@media(max-height:700px)]:mt-5 desk:mt-0">
            <h2 id="home-checkin-title" className={cn(sectionTitle, "mb-3 desk:mb-5")}>
              {el ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?'}
            </h2>
            <HomeCheckin embedded />
          </motion.section>
        {/* The guide: where you are in the book; go on reading, or listen. */}
        <section aria-labelledby="home-guide-title" className="glass glass-gold rounded-[24px] mt-[26px] [@media(max-height:700px)]:mt-4 px-[18px] pt-[18px] pb-4 desk:mt-0 desk:rounded-[28px] desk:px-8 desk:pt-[30px] desk:pb-7 desk:flex desk:flex-col desk:min-h-[300px]">
          <div className="flex items-baseline justify-between gap-3 text-[12.5px] text-ink/70 desk:text-[14px]">
            {/* Named as in the bottom bar ("Read"), with the chapter of how many: a newcomer sees it is the book, read in the app. */}
            <span className="min-w-0 truncate">{finishedGuide ? (el ? 'Διάβασμα' : 'Reading') : el ? `Διάβασμα · Κεφάλαιο ${spot.chapter?.num ?? ''} από ${chapters.length}` : `Reading · Chapter ${spot.chapter?.num ?? ''} of ${chapters.length}`}</span>
            {midChapter && <span className="shrink-0">{el ? `σελ. ${spot.page + 1} από ${spot.pages.length}` : `p. ${spot.page + 1} of ${spot.pages.length}`}</span>}
          </div>
          <h2 id="home-guide-title" className="font-display mt-1 text-[28px] leading-[1.15] desk:mt-2.5 desk:text-[52px] desk:leading-[1.05]" style={{ color: guideInk }}>
            {guideTitle}
          </h2>
          {/* The chapter's own name under its axis ("Body" alone reads like the axis below). */}
          {!finishedGuide && spot.chapter?.sub && (
            <p className="mt-1 text-[15px] leading-snug text-ink/80 desk:mt-2 desk:text-[18px]">{spot.chapter.sub}</p>
          )}
          {guideLine && (
            <p className="hidden desk:block mt-3.5 max-w-[560px] text-[18px] leading-[1.6] text-ink/85">«{guideLine}»</p>
          )}
          <div className="hidden desk:block flex-1 min-h-5" aria-hidden="true" />
          {midChapter && (
            <div className="mt-3 desk:mt-0 h-[2px] desk:h-[3px] rounded-full bg-black/30 overflow-hidden" aria-hidden="true">
              <div className="h-full rounded-full bg-[var(--tint-blue-ink)] shadow-[0_0_6px_rgb(127_169_228/0.6)]" style={{ width: `${Math.round(((spot.page + 1) / spot.pages.length) * 100)}%` }} />
            </div>
          )}
          <div className="mt-3.5 flex items-center gap-2 desk:mt-5 desk:gap-2.5">
            <Link
              to={spot.href}
              className="btn-gold inline-flex items-center gap-[7px] h-11 px-[18px] rounded-full whitespace-nowrap text-[14px] font-medium hover:brightness-105 transition-[filter,transform] active:scale-[0.98] desk:h-12 desk:px-6 desk:text-[16px]"
            >
              {guideAction}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            {listenHref && (
              <Link
                to={listenHref}
                className="inline-flex items-center gap-[7px] h-11 px-4 rounded-full whitespace-nowrap text-[14px] text-ink/90 bg-white/[0.05] border border-white/[0.12] hover:bg-white/[0.08] transition-[background-color,transform] active:scale-[0.98] desk:h-12 desk:px-5 desk:text-[16px]"
              >
                <Headphones size={16} strokeWidth={1.8} aria-hidden="true" />
                {el ? 'Άκουσε' : 'Listen'}
              </Link>
            )}
          </div>
        </section>

        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">

          {/* More: everything else in the app. */}
          <motion.section variants={itemVariants} aria-labelledby="home-more-title" className="mt-[26px] desk:mt-11">
            <h2 id="home-more-title" className={sectionTitle}>{el ? 'Περισσότερα' : 'More'}</h2>
            <div className="glass shelf-list mt-3 flex flex-col desk:mt-4 desk:grid desk:grid-cols-3 desk:gap-3.5">
              {shelf.map(item => {
                const body = (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 desk:w-[26px] desk:h-[26px] desk:mt-0.5" style={{ color: item.ink, filter: `drop-shadow(0 0 5px color-mix(in srgb, ${item.ink} 50%, transparent))` }}>
                      <path d={item.icon} />
                    </svg>
                    <span className="flex-1 flex flex-col gap-0.5 min-w-0 desk:gap-1">
                      <span className="text-[15.5px] leading-[1.3] text-ink desk:text-[16.5px]">{item.title}</span>
                      <span className="text-[13.5px] leading-[1.4] text-ink/70 desk:leading-[1.45]">{item.sub}</span>
                    </span>
                    <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-ink/70 desk:hidden" />
                  </>
                );
                return item.to
                  ? <Link key={item.key} to={item.to} className={cn(shelfCard, item.phoneOnly && 'desk:hidden')}>{body}</Link>
                  : <button key={item.key} type="button" onClick={item.onClick} className={cn(shelfCard, item.phoneOnly && 'desk:hidden')}>{body}</button>;
              })}
            </div>
          </motion.section>

        </motion.div>

        {/* The phrase of the day, as a quiet close at the foot of the page. */}
        <motion.figure
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-11 desk:mt-16 mx-auto max-w-[330px] desk:max-w-[620px] text-center"
        >
          <figcaption className="sky-text text-[12px] desk:text-[13px] text-ink/70">{el ? 'Για σήμερα' : 'For today'}</figcaption>
          <blockquote className="sky-text mt-2 font-display text-[19px] desk:text-[24px] leading-[1.45] text-ink/80">
            «{el ? affirmation.el : affirmation.en}»
          </blockquote>
        </motion.figure>

        {/* About once a month: a copy of what lives only on this device. */}
        <BackupReminder lang={lang} />

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6 mb-6 flex flex-col items-center justify-center gap-3 text-center desk:mt-12"
        >
          <div className="flex items-center justify-center gap-x-3 gap-y-2 flex-wrap">
            <button
              onClick={() => setBookOpen(o => !o)}
              aria-expanded={bookOpen}
              className={cn(footerLinkClasses, bookOpen && "text-ink")}
            >
              <BookOpen size={12} />
              <span>{language === 'el' ? 'Το βιβλίο' : 'The book'}</span>
            </button>
            <button onClick={() => setIsInfoOpen(true)} className={footerLinkClasses}>
              <Info size={12} />
              <span>{language === 'el' ? 'Σχετικά' : 'About'}</span>
            </button>
            <Link to="/privacy" className={footerLinkClasses}>
              <span>{language === 'el' ? 'Απόρρητο' : 'Privacy'}</span>
            </Link>
            <Link to="/accessibility" className={footerLinkClasses}>
              <span>{language === 'el' ? 'Προσβασιμότητα' : 'Accessibility'}</span>
            </Link>
            {!installed && (
              <Link to="/install" className={footerLinkClasses}>
                <Download size={12} />
                <span>{language === 'el' ? 'Εγκατάσταση' : 'Install'}</span>
              </Link>
            )}
          </div>

          {bookOpen && (
            <motion.div
              id="home-book"
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
              <span className="text-[12px] text-ink/70">
                {language === 'el' ? 'Δωρεάν · CC BY-NC-ND 4.0' : 'Free · CC BY-NC-ND 4.0'}
              </span>
            </motion.div>
          )}
        </motion.div>

      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}


