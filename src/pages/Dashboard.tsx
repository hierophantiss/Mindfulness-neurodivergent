import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, BookOpen, ChevronDown, Info, Download, X } from 'lucide-react';
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
import HomeCheckin from '../components/HomeCheckin';
import HomeEarth from '../components/HomeEarth';
import { PLACE_PATHS } from '../components/placeIcons';
import BackupReminder from '../components/BackupReminder';
import { welcomeSeen, markWelcomeSeen, openWelcome } from '../lib/welcome';
import { readingSpot, chaptersRead } from '../lib/readingSpot';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { PRACTICE_CATALOG } from '../data/practiceCatalog';

/** The last practice done (in the last month), to take up again with one tap. */
function useLastPractice(lang: 'el' | 'en') {
  const { logs } = useActivityTracker();
  return useMemo(() => {
    const MONTH = 30 * 86400000;
    for (let i = logs.length - 1; i >= 0; i--) {
      const l = logs[i];
      if (!l.itemId || Date.now() - Date.parse(l.timestamp) > MONTH) continue;
      const own: Record<string, { title: { el: string; en: string }; path: string }> = {
        'practice-swaying': { title: { el: 'Λίκνισμα', en: 'Swaying' }, path: '/practice/swaying' },
      };
      const item = own[l.itemId] ?? PRACTICE_CATALOG.find(c => c.id === l.itemId);
      if (!item) continue;
      const days = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(l.timestamp).setHours(0, 0, 0, 0)) / 86400000);
      const when = lang === 'el'
        ? (days <= 0 ? 'σήμερα' : days === 1 ? 'χθες' : `πριν από ${days} μέρες`)
        : (days <= 0 ? 'today' : days === 1 ? 'yesterday' : `${days} days ago`);
      // A movement goes by its own name ("Lifting the Sky"), not by what it does first.
      const title = 'kind' in item && item.kind === 'movement' ? item.title[lang].split(' · ').pop()! : item.title[lang];
      return { title, path: item.path, when };
    }
    return null;
  }, [logs, lang]);
}


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
  const { reduceMotion } = useAccessibility();
  const { progress } = useProgress();

  const lang = language === 'el' ? 'el' : 'en';
  const chapters = useChapters(lang);
  // "Continue": where you stopped (the same answer the cat gives).
  const spot = readingSpot(chapters, progress.completedChapters, companionData.chapterProgress, companionData.lastChapter);
  const midChapter = spot.kind === 'resume' && spot.page > 0;
  // The cat remembers what you read; on the home page it lives in this card.
  const hasRead = chaptersRead(chapters, progress.completedChapters, companionData.chapterProgress).length > 0;
  const el = lang === 'el';
  const lastPractice = useLastPractice(lang);
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
  const affirmationToday = useMemo(
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

  // Practise: four ways in, one for each axis of the method.
  const WAYS = [
    { key: 'movement', to: '/practice?category=movement', title: el ? 'Κίνηση και Τάι Τσι' : 'Movement and Tai Chi', axis: el ? 'Σώμα' : 'Body', ink: 'var(--axis-body-ink)', icon: 'M12 3a2 2 0 1 0 0 4 2 2 0 1 0 0-4M12 8v7M12 15l-3 6M12 15l3 6M5 9l7 2 7-4' },
    { key: 'breath', to: '/practice?category=breath', title: el ? 'Ρυθμοί αναπνοής' : 'Breath rhythms', axis: el ? 'Αναπνοή' : 'Breath', ink: 'var(--axis-breath-ink)', icon: 'M3 9h10a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h6' },
    { key: 'micro', to: '/practice/microdoses', title: el ? 'Μικροδόσεις' : 'Microdoses', axis: el ? 'Προσοχή · λίγα δευτερόλεπτα' : 'Attention · a few seconds', ink: 'var(--axis-attention-ink)', icon: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z' },
    { key: 'vocal', to: '/practice?category=vocal', title: el ? 'Ψάλσιμο και αντήχηση' : 'Chanting and resonance', axis: el ? 'Χώρος' : 'Space', ink: 'var(--axis-space-ink)', icon: 'M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0' },
  ];
  // On a phone the four ways open from one card (on a computer they are always there).
  const [waysOpen, setWaysOpen] = useState(false);
  // Under it, the places for every day and for more (on a computer, in the side bar).
  const PLACES = [
    { to: '/program', title: el ? 'Πρόγραμμα' : 'Program', desc: el ? '8 εβδομάδες, ένα μικρό βήμα τη μέρα' : '8 weeks, one small step a day', ink: 'var(--axis-body-ink)', icon: PLACE_PATHS.sprout },
    { to: '/sanctuary', title: el ? 'Καταφύγιο' : 'Sanctuary', desc: el ? 'Ήσυχοι ήχοι για να ξεκουραστείς' : 'Calm sounds to rest with', ink: 'var(--tint-lav-ink)', icon: PLACE_PATHS.waves },
    { to: '/rabbithole', title: el ? 'Κουνελότρυπα' : 'Rabbit Hole', desc: el ? 'Άρθρα και στοχασμοί, για βαθύτερο διάβασμα' : 'Articles and reflections, for deeper reading', ink: 'var(--axis-attention-ink)', icon: PLACE_PATHS.spiral },
  ];
  const sectionTitle = "sky-text font-display text-[23px] leading-tight text-ink desk:text-[27px]";
  // The book's page: the chapter's name as large as its longest word lets it be.
  const longestWord = Math.max(4, ...guideTitle.split(/\s+/).map(w => w.length));
  // (Never below 18px: a long word then breaks, with a hyphen where the browser knows how.)
  const fit = (100 / (longestWord * 0.56)).toFixed(2);
  const bookTitleSize = `clamp(18px, ${fit}cqw, 26px)`;
  const bookTitleSizeDesk = `clamp(24px, ${fit}cqw, 40px)`;
  const bookLabel = finishedGuide
    ? (el ? `Όλα τα κεφάλαια · ${chapters.length}` : `All chapters · ${chapters.length}`)
    : `${guideAction}: ${el ? 'Κεφάλαιο' : 'Chapter'} ${spot.chapter?.num ?? ''}, ${guideTitle}`;
  // The key line of the chapter you are in (once the chapters have loaded), for the wide guide card.
  const guideLine = !finishedGuide ? (spot.chapter?.insight || '') : '';
  // The phrase of the day, never the same as the chapter's line in the card above (then the next day's).
  const same = (x: string, y: string) => x.replace(/[«»"\s.]/g, '') === y.replace(/[«»"\s.]/g, '');
  const affirmation = guideLine && same(el ? affirmationToday.el : affirmationToday.en, guideLine)
    ? phraseOfDay(getDayOfYear(new Date()) + 1, recentState === 'hypo')
    : affirmationToday;

  return (
    <div className="relative -mx-4 px-4 desk:-mx-14 desk:px-14 min-h-screen bg-transparent overflow-x-hidden text-ink font-sans selection:bg-[#4a9eca]/30 selection:text-ink pb-[calc(240px+env(safe-area-inset-bottom))] -mb-[calc(160px+env(safe-area-inset-bottom))] desk:pb-[260px] desk:-mb-20">
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
          {/* The method in one line: one way, many ways in. */}
          <p className="sky-text mt-3 text-[15px] leading-snug text-ink/75 desk:mt-4 desk:text-[18px]">
            {el ? 'Μία μέθοδος, τέσσερις άξονες. Μάθε τη όπως σου ταιριάζει.' : 'One method, four axes. Learn it the way that suits you.'}
          </p>
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

        {/* First "How do you feel", then the book; on a computer side by side, in the same order. */}
        <div className="desk:grid desk:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] desk:gap-7 desk:mt-10 desk:items-start">
          {/* How do you feel right now? First, and always in the same place. */}
          <motion.section variants={itemVariants} initial="hidden" animate="show" transition={{ delay: 0.4 }} aria-labelledby="home-checkin-title" className="mt-[26px] [@media(max-height:700px)]:mt-5 desk:mt-0">
            <h2 id="home-checkin-title" className={cn(sectionTitle, "mb-3 desk:mb-5")}>
              {el ? 'Πώς νιώθεις τώρα;' : 'How do you feel right now?'}
            </h2>
            <HomeCheckin embedded />
          </motion.section>

          {/* Learn: the book, open where you stopped. */}
          <section aria-labelledby="home-learn-title" className="mt-[30px] desk:mt-0">
            <div className="flex items-baseline justify-between gap-3 mb-3 desk:mb-5">
              <h2 id="home-learn-title" className={sectionTitle}>{el ? 'Μάθε' : 'Learn'}</h2>
              <Link to="/chapters" className="sky-text flex items-center min-h-[36px] text-[13.5px] text-ink/75 hover:text-ink transition-colors">
                {el ? `${chapters.length} κεφάλαια` : `${chapters.length} chapters`}
              </Link>
            </div>
            <Link
              to={spot.href}
              aria-label={bookLabel}
              className="relative block h-[184px] hover:brightness-110 active:scale-[0.99] transition-[filter,transform] desk:h-[272px]"
            >
              {/* The edges of the pages, below. */}
              <span aria-hidden="true" className="home-book-edge absolute left-1.5 right-1.5 bottom-0 h-3 rounded-b-[14px]" />
              <span className="absolute inset-x-0 top-0 bottom-2 grid grid-cols-2">
                <span className="home-book-left rounded-l-[18px] rounded-r-[4px] pl-5 pr-4 pt-[18px] pb-3.5 flex flex-col justify-between desk:rounded-l-[24px] desk:pl-8 desk:pt-7 desk:pb-6">
                  <span className="text-[11px] tracking-[0.16em] uppercase text-ink/65 desk:text-[12px]">{el ? 'Κεφάλαιο' : 'Chapter'}</span>
                  <span className="font-display text-[64px] leading-[0.9] desk:text-[104px]" style={{ color: guideInk }}>
                    {finishedGuide ? chapters.length : spot.chapter?.num}
                  </span>
                  <span className="text-[12px] text-ink/65 desk:text-[13.5px]">{el ? `από ${chapters.length}` : `of ${chapters.length}`}</span>
                </span>
                <span className="home-book-right relative [container-type:inline-size] rounded-r-[18px] rounded-l-[4px] pl-[18px] pr-5 pt-[18px] pb-3.5 flex flex-col justify-between gap-2 desk:rounded-r-[24px] desk:pl-7 desk:pr-8 desk:pt-7 desk:pb-6">
                  {/* The ribbon that keeps your page. */}
                  <span aria-hidden="true" className="home-book-ribbon absolute -top-0.5 right-[22px] w-3 h-11 desk:right-8 desk:w-3.5 desk:h-14" />
                  <span className="flex flex-col gap-1.5 pr-5 min-w-0 desk:gap-2.5 desk:pr-8">
                    <span className="font-display leading-[1.05] text-ink hyphens-auto [overflow-wrap:anywhere] desk:hidden" style={{ fontSize: bookTitleSize }}>{guideTitle}</span>
                    <span className="hidden desk:block font-display leading-[1.05] text-ink hyphens-auto [overflow-wrap:anywhere]" style={{ fontSize: bookTitleSizeDesk }}>{guideTitle}</span>
                    {!finishedGuide && spot.chapter?.sub && (
                      <span className="text-[13px] leading-snug text-ink/75 line-clamp-3 desk:text-[15.5px]">{spot.chapter.sub}</span>
                    )}
                    {guideLine && <span className="hidden desk:block mt-1 text-[15px] leading-relaxed text-ink/70 line-clamp-3">«{guideLine}»</span>}
                  </span>
                  <span className="flex items-end justify-between gap-2 text-[12px] desk:text-[14px]">
                    <span className="text-ink/65">{midChapter ? (el ? `σελ. ${spot.page + 1} από ${spot.pages.length}` : `p. ${spot.page + 1} of ${spot.pages.length}`) : ''}</span>
                    <span className="inline-flex items-center gap-1 shrink-0 text-sign-gold">{guideAction}<ArrowRight size={13} aria-hidden="true" /></span>
                  </span>
                </span>
              </span>
              {/* The spine between the two pages. */}
              <span aria-hidden="true" className="home-book-spine absolute left-1/2 top-0 bottom-2 w-0.5 -ml-px" />
            </Link>
            {/* Below the book: the last practice to take up again (this device only), and what you have read. */}
            {(lastPractice || hasRead) && (
              <div className="mt-3 flex items-center justify-between gap-3 text-[13.5px] desk:mt-4 desk:text-[14.5px]">
                {lastPractice ? (
                  <Link to={lastPractice.path} className="flex items-center gap-1.5 min-w-0 min-h-[40px] text-ink/80 hover:text-ink transition-colors">
                    <span className="shrink-0 text-ink/65">{el ? 'Συνέχισε:' : 'Continue:'}</span>
                    <span className="truncate">{lastPractice.title}</span>
                    <span className="shrink-0 text-ink/65 max-[359px]:hidden">· {lastPractice.when}</span>
                    <ArrowRight size={14} aria-hidden="true" className="shrink-0 opacity-70" />
                  </Link>
                ) : <span />}
                {hasRead && (
                  <button type="button" onClick={() => setSheetVisible(true)} className="shrink-0 min-h-[40px] text-ink/70 hover:text-ink transition-colors underline decoration-white/20 underline-offset-4">
                    {el ? 'Τι έχεις διαβάσει' : 'What you have read'}
                  </button>
                )}
              </div>
            )}
          </section>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col">

          {/* Practise: many ways, one for each axis. */}
          <motion.section variants={itemVariants} aria-labelledby="home-practise-title" className="mt-[30px] desk:mt-12">
            <div className="flex items-baseline justify-between gap-3 mb-3 desk:mb-5">
              <h2 id="home-practise-title" className={sectionTitle}>{el ? 'Εξασκήσου' : 'Practise'}</h2>
              <Link to="/practice" className="sky-text flex items-center min-h-[36px] text-[13.5px] text-ink/75 hover:text-ink transition-colors">
                {el ? 'όλες οι ασκήσεις' : 'all practices'}
              </Link>
            </div>
            {/* One card on a phone: the four ways, in their colours; a tap opens them. */}
            <button
              type="button"
              onClick={() => setWaysOpen(o => !o)}
              aria-expanded={waysOpen}
              aria-controls="home-ways"
              className={cn("glass w-full flex items-center gap-3.5 min-h-[76px] px-4 py-3 text-left hover:brightness-110 active:scale-[0.99] transition-[filter,transform,border-radius] desk:hidden", waysOpen ? 'rounded-[20px]' : 'rounded-[22px]')}
            >
              <span aria-hidden="true" className="shrink-0 grid grid-cols-2 gap-1">
                {WAYS.map(w => (
                  <svg key={w.key} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ color: w.ink }}>
                    <path d={w.icon} />
                  </svg>
                ))}
              </span>
              <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-[15.5px] leading-snug text-ink">{el ? 'Τέσσερις τρόποι εξάσκησης' : 'Four ways to practise'}</span>
                <span className="text-[13px] leading-snug text-ink/70">{el ? 'Κίνηση, αναπνοή, μικροδόσεις, ψάλσιμο' : 'Movement, breath, microdoses, chanting'}</span>
              </span>
              <ChevronDown size={18} aria-hidden="true" className={cn("shrink-0 text-ink/70 transition-transform", waysOpen && "rotate-180")} />
            </button>
            <div id="home-ways" className={cn(waysOpen ? 'grid' : 'hidden', "mt-2.5 grid-cols-2 gap-2.5 desk:mt-0 desk:grid desk:grid-cols-4 desk:gap-3.5")}>
              {WAYS.map(w => (
                <Link key={w.key} to={w.to} className="glass rounded-[20px] p-4 min-h-[108px] flex flex-col justify-between gap-4 hover:brightness-110 active:scale-[0.98] transition-[filter,transform] desk:rounded-[24px] desk:p-5 desk:min-h-[140px]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="desk:w-7 desk:h-7" style={{ color: w.ink, filter: `drop-shadow(0 0 5px color-mix(in srgb, ${w.ink} 50%, transparent))` }}>
                    <path d={w.icon} />
                  </svg>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[15px] leading-snug text-ink desk:text-[16.5px]">{w.title}</span>
                    <span className="text-[12.5px] leading-snug desk:text-[13.5px]" style={{ color: w.ink }}>{w.axis}</span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.section>

          {/* Program, Sanctuary, Rabbit Hole, each with what it is (on a computer, in the side bar). */}
          <motion.nav variants={itemVariants} aria-label={el ? 'Περισσότερα' : 'More'} className="glass mt-3 rounded-[22px] overflow-hidden desk:hidden">
            <ul className="divide-y divide-white/[0.07]">
              {PLACES.map(p => (
                <li key={p.to}>
                  <Link to={p.to} className="flex items-center gap-3.5 min-h-[68px] px-4 py-3 hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors">
                    <span aria-hidden="true" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08]" style={{ color: p.ink }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 5px color-mix(in srgb, ${p.ink} 50%, transparent))` }}>
                        <path d={p.icon} />
                      </svg>
                    </span>
                    <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="text-[15px] leading-snug text-ink">{p.title}</span>
                      <span className="text-[13px] leading-snug text-ink/70">{p.desc}</span>
                    </span>
                    <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-ink/55" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

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
      {/* At the foot of the page, the earth: first the earth, then the sky. */}
      <HomeEarth />
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}


