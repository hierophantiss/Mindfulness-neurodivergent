import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, ChevronRight, ChevronDown, Info, Download, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useTime } from '../contexts/TimeContext';
import { useProgress } from '../contexts/ProgressContext';
import { CHAPTERS_DATA } from '../data/chapters';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAccessibility } from '../hooks/useAccessibility';
import { BREATH_PATTERNS } from '../data/breathPatterns';
import InfoModal from '../components/InfoModal';

import { phraseOfDay } from '../data/affirmations';
import { readRecentCheckinState } from '../data/stateCheckin';
import { MethodMark } from '../components/MethodMark';
import { useInstallApp } from '../hooks/useInstallApp';
import HomeCheckin from '../components/HomeCheckin';
import { CatInfinityAvatar } from '../components/CatInfinityAvatar';
import { getMoreLinks } from '../data/moreLinks';
import { readingSpot, chaptersRead } from '../lib/readingSpot';
import { chapterPageLabel } from '../lib/chapterPages';

const baseCardClasses = "backdrop-blur-xl border border-white/[0.04] border-t-white/[0.08] border-l-white/[0.06] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-500 rounded-[28px]";
const innerIconClasses = "rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/[0.02] border-t-white/[0.1] shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-center text-white/50 transition-colors duration-500";
const actionButtonClasses = "w-8 h-8 rounded-full bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.02] border-t-white/[0.1] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center group-hover:from-white/[0.08] group-hover:border-t-white/[0.15] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-500";

const footerLinkClasses = "sky-text flex items-center gap-1.5 py-2 text-[12px] text-white/60 hover:text-white/80 transition-colors";
const bookPillClasses = "whitespace-nowrap px-4 py-2 rounded-full border border-[var(--tint-sand-line)] bg-[var(--tint-sand-bg)] text-[11px] text-white/65 hover:text-white/80 hover:bg-white/[0.06] transition-colors";

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
  const { logs } = useActivityTracker();
  const { hour } = useTime();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const { progress } = useProgress();

  const totalChapters = CHAPTERS_DATA[language === 'el' ? 'el' : 'en']?.length || 10;
  const completedChapters = progress.completedChapters.length;
  
  const lang = language === 'el' ? 'el' : 'en';
  const chapters = CHAPTERS_DATA[lang] || [];
  // "Continue": where you stopped (the same answer the cat gives).
  const spot = readingSpot(chapters, progress.completedChapters, companionData.chapterProgress, companionData.lastChapter);
  const midChapter = spot.kind === 'resume' && spot.page > 0;
  // The cat remembers what you read; on the home page it lives in this card.
  const hasRead = chaptersRead(chapters, progress.completedChapters, companionData.chapterProgress).length > 0;
  const el = lang === 'el';
  const isNewUser = completedChapters === 0 && logs.length === 0;
  // Your most used practice, to come back to it in one tap.
  const favouritePractice = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const l of logs) {
      if (l.itemId && ['breath', 'movement', 'grounding', 'vocal'].includes(l.category)) counts[l.itemId] = (counts[l.itemId] || 0) + 1;
    }
    const best = Object.entries(counts).sort((x, y) => y[1] - x[1])[0];
    return best ? BREATH_PATTERNS.find(p => p.id === best[0]) : undefined;
  }, [logs]);

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

  const [greeting, setGreeting] = useState('');
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);
  const [installHint, setInstallHint] = useState<string | null>(null);
  const { installed, install } = useInstallApp(language);

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

  useEffect(() => {
    // Greeting
    if (hour >= 6 && hour < 12) {
      setGreeting(language === 'el' ? `Καλημέρα` : `Good Morning`);
    } else if (hour >= 12 && hour < 18) {
      setGreeting(language === 'el' ? `Καλό απόγευμα` : `Good Afternoon`);
    } else {
      setGreeting(language === 'el' ? `Καλό βράδυ` : `Good Evening`);
    }
  }, [language, hour]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative w-full min-h-screen bg-transparent overflow-x-hidden text-white font-sans selection:bg-[#4a9eca]/30 selection:text-white pb-[calc(5rem+env(safe-area-inset-bottom))]">
      
      {/* Ambient background glow for the grid */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Responsive Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-2 lg:gap-16 pt-1 lg:pt-12">

        {/* Hero Section */}
        <div className="w-full max-w-sm lg:sticky lg:top-24 flex-shrink-0 flex flex-col justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0 lg:pb-[calc(5rem+env(safe-area-inset-bottom))]">
          {/* Top Row: Brand Lockup + SOS */}
          <div className="w-full flex items-start justify-between gap-2 mt-2 px-1 sm:px-2">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-2 min-[360px]:gap-3 text-left shrink min-w-0"
            >
              <Link
                to="/method"
                aria-label={language === 'en' ? 'The Fourfold Axis: what the sign means' : 'Ο Τετραπλός Άξονας: τι σημαίνει το σήμα'}
                className="shrink-0 rounded-full active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
              >
                <MethodMark small breathe dim={nightDim} className="w-10 h-10 min-[360px]:w-12 min-[360px]:h-12" />
              </Link>
              <span className="flex flex-col min-w-0">
              <span className="sky-text text-[15px] max-[359px]:text-[13px] max-[359px]:tracking-normal min-[400px]:text-[17px] leading-tight tracking-[0.02em] min-[400px]:tracking-[0.04em] uppercase text-teal-300/90 font-medium whitespace-nowrap">
                {language === 'el' ? 'ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ' : 'MINDFULNESS'}
              </span>{' '}
              <span className="sky-text text-[12px] min-[375px]:text-[13px] leading-tight text-white/65 mt-1">
                {language === 'el' ? 'Για νευροδιαφορετικούς' : 'For neurodivergents'}
              </span>
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex flex-col items-end shrink-0 ml-auto"
            >
              <Link
                to="/practice/breath/sos-breath"
                className="flex items-center justify-center h-[40px] min-[375px]:h-[44px] px-4 min-[375px]:px-5 rounded-full bg-[#2a1820] border border-rose-500/25 text-rose-300 hover:bg-[#351d28] active:scale-95 transition-all text-[12px] min-[375px]:text-[13px] font-medium tracking-widest shrink-0"
                title={language === 'el' ? 'Άμεση Ηρέμηση' : 'Immediate Calm'}
              >
                SOS
              </Link>
            </motion.div>
          </div>

        </div>

        {/* Dashboard Content */}
        <div className="w-full max-w-lg px-5 flex flex-col gap-5 mt-2">

        {/* Greeting & Date */}
        <div className="flex flex-col gap-2 mt-3">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="sky-text text-[24px] font-sans font-medium tracking-tight leading-none text-white/90"
          >
            {greeting}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="sky-text text-[13px] font-light italic leading-snug text-white/60"
          >
            {language === 'el' ? affirmation.el : affirmation.en}
          </motion.p>
        </div>

        {/* How do you feel right now? */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <HomeCheckin />
        </motion.div>

        {/* Continue: one next step */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3"
        >
          <motion.div variants={itemVariants}>
            <div className={cn(baseCardClasses, "bg-[var(--tint-blue-bg)] !border-[var(--tint-blue-line)] relative overflow-hidden")}>
              <div className="absolute top-[-30%] right-[-10%] w-48 h-48 bg-[#8ba3ba]/5 blur-[50px] rounded-full pointer-events-none" />
              <Link to={spot.href} className="flex items-center gap-3 pl-5 pr-3 py-4 group active:scale-[0.99] transition-transform">
              <div className="flex flex-col gap-1 min-w-0 flex-1 relative z-10">
                <span className="text-[12px] text-[#8ba3ba] font-medium">
                  {spot.kind === 'done'
                    ? (el ? 'Ολοκλήρωσες τον οδηγό' : 'You finished the guide')
                    : spot.kind === 'start'
                      ? (el ? 'Ξεκίνα' : 'Start')
                      : spot.kind === 'next'
                        ? (el ? 'Επόμενο κεφάλαιο' : 'Next chapter')
                        : (el ? 'Συνέχισε' : 'Continue')}
                </span>
                <h3 className="text-[16px] font-medium tracking-tight text-[#9bb8d1] leading-snug">
                  {spot.kind === 'done'
                    ? (el ? 'Όλα τα κεφάλαια' : 'All chapters')
                    : <>{el ? 'Κεφάλαιο' : 'Chapter'} {spot.chapter?.num} · {spot.chapter?.title}</>}
                </h3>
                {midChapter ? (
                  <>
                    <span className="text-[12px] leading-snug text-white/65">
                      {chapterPageLabel(spot.pages[spot.page], lang)} · {el ? `σελίδα ${spot.page + 1} από ${spot.pages.length}` : `page ${spot.page + 1} of ${spot.pages.length}`}
                    </span>
                    <span className="mt-1 h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
                      <span className="block h-full rounded-full bg-[#8ba3ba]/50" style={{ width: `${Math.round(((spot.page + 1) / spot.pages.length) * 100)}%` }} />
                    </span>
                  </>
                ) : !isNewUser && (
                  <>
                    <span className="mt-1 h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
                      <span className="block h-full rounded-full bg-[#8ba3ba]/50" style={{ width: `${Math.round((completedChapters / totalChapters) * 100)}%` }} />
                    </span>
                    <span className="text-[12px] text-white/65">
                      {el ? `${completedChapters} από ${totalChapters} ολοκληρώθηκαν` : `${completedChapters} of ${totalChapters} completed`}
                    </span>
                  </>
                )}
              </div>
              <ChevronRight size={18} className="text-[#8ba3ba]/40 group-hover:text-[#8ba3ba]/80 shrink-0 relative z-10" />
              </Link>
              {hasRead && (
                <button
                  onClick={() => setSheetVisible(true)}
                  className="relative z-10 w-full min-h-[44px] flex items-center gap-2.5 pl-5 pr-4 py-2 border-t border-white/[0.05] text-[13px] text-white/55 hover:text-white/80 hover:bg-white/[0.03] transition-colors"
                >
                  <CatInfinityAvatar className="w-6 h-6 rounded-full" />
                  <span className="flex-1 text-left">{el ? 'Τι έχεις διαβάσει' : 'What you have read'}</span>
                  <ChevronRight size={15} className="text-white/30" />
                </button>
              )}
            </div>
          </motion.div>

          {favouritePractice && (
            <motion.div variants={itemVariants}>
              <Link to={`/practice/breath/${favouritePractice.id}`} className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[var(--tint-sage-bg)] border border-[var(--tint-sage-line)] hover:brightness-110 text-[14px] text-white/75 transition-colors active:scale-[0.98]">
                <span className="flex items-center gap-2 min-w-0">
                  <RotateCcw size={14} className="text-white/40 shrink-0" />
                  <span className="truncate">{lang === 'el' ? 'Ξανά' : 'Again'}: {/^[\d-]+$/.test(favouritePractice.title[lang]) ? `${lang === 'el' ? 'Αναπνοή' : 'Breath'} ${favouritePractice.title[lang]}` : favouritePractice.title[lang]}</span>
                </span>
                <ChevronRight size={16} className="text-white/35 shrink-0" />
              </Link>
            </motion.div>
          )}

          {/* More: one small button that opens the whole app, for those who want to explore first */}
          <motion.div variants={itemVariants} className="flex flex-col items-start gap-3 mt-1">
            <button
              onClick={toggleMore}
              aria-expanded={moreOpen}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--tint-sand-bg)] border border-[var(--tint-sand-line)] text-[13px] text-white/75 hover:text-white/90 hover:brightness-110 transition-colors active:scale-[0.97]"
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
                {moreLinks.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-[var(--tint-blue-bg)] border border-[var(--tint-blue-line)] hover:brightness-110 transition-colors active:scale-[0.98]"
                  >
                    <item.icon size={18} strokeWidth={1.5} className={cn("shrink-0 opacity-80", item.tone)} />
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
              className={cn(footerLinkClasses, bookOpen && "text-white/60")}
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
              <span className="text-[10px] text-white/25">
                {language === 'el' ? 'Δωρεάν · CC BY-NC-ND 4.0' : 'Free · CC BY-NC-ND 4.0'}
              </span>
            </motion.div>
          )}

          {installHint && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-[280px] text-[11px] leading-relaxed text-white/45"
            >
              {installHint}
            </motion.p>
          )}
        </motion.div>
        
      </div>
      </div>
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </div>
  );
}


