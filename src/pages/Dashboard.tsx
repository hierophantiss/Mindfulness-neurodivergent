import { AudioEnabler } from '../components/AudioEnabler';
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Moon, ChevronRight, ChevronDown, Telescope, Info, Calendar, Download, RotateCcw, Activity, Compass } from 'lucide-react';
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

import { AFFIRMATIONS } from '../data/affirmations';
import { FourfoldAxisHero } from '../components/FourfoldAxisHero';
import { useInstallApp } from '../hooks/useInstallApp';
import HomeCheckin from '../components/HomeCheckin';

const baseCardClasses = "backdrop-blur-xl border border-white/[0.04] border-t-white/[0.08] border-l-white/[0.06] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-500 rounded-[28px]";
const innerIconClasses = "rounded-2xl bg-gradient-to-b from-white/[0.06] to-transparent border border-white/[0.02] border-t-white/[0.1] shadow-[0_4px_12px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-center text-white/50 transition-colors duration-500";
const actionButtonClasses = "w-8 h-8 rounded-full bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.02] border-t-white/[0.1] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center group-hover:from-white/[0.08] group-hover:border-t-white/[0.15] group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition-all duration-500";

const footerLinkClasses = "flex items-center gap-1.5 py-2 text-[11px] text-white/30 hover:text-white/60 transition-colors";
const bookPillClasses = "whitespace-nowrap px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.03] text-[11px] text-white/55 hover:text-white/80 hover:bg-white/[0.06] transition-colors";

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
  const { companionData, updateCompanionData, setCompanionMessage } = useCompanion();
  const { logs } = useActivityTracker();
  const { hour } = useTime();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const { progress } = useProgress();

  const totalChapters = CHAPTERS_DATA[language === 'el' ? 'el' : 'en']?.length || 10;
  const completedChapters = progress.completedChapters.length;
  const nextChapter = Math.min(completedChapters + 1, totalChapters);
  const isWorkbookDone = completedChapters >= totalChapters;
  
  const lang = language === 'el' ? 'el' : 'en';
  const chapters = CHAPTERS_DATA[lang] || [];
  const isDone = (n: number) => progress.completedChapters.includes(String(n));
  // "Continue": the first chapter not yet completed.
  const nextChapterData = chapters.find(c => !isDone(c.num)) || chapters[0];
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
  const el = lang === 'el';
  const moreLinks = [
    { to: '/practice', icon: Activity, tone: 'text-teal-300',
      label: el ? 'Ασκήσεις' : 'Practices',
      desc: el ? 'Αναπνοές, κίνηση & Τάι Τσι, ψάλσιμο, μικροδόσεις' : 'Breathing, movement & Tai Chi, chanting, microdoses' },
    { to: '/sanctuary', icon: Moon, tone: 'text-[#b4abce]',
      label: el ? 'Καταφύγιο' : 'Sanctuary',
      desc: el ? 'Ήχοι φύσης και binaural για ύπνο, χαλάρωση ή εστίαση' : 'Nature sounds and binaural beats for sleep, rest or focus' },
    { to: '/program', icon: Calendar, tone: 'text-[#b0c4aa]',
      label: el ? 'Πρόγραμμα 8 εβδομάδων' : '8-week Program',
      desc: el ? 'Ένα μικρό βήμα τη μέρα, με σειρά' : 'One small step a day, in order',
      sub: completedLessons > 0 ? `${lessonProgressPct}%` : undefined },
    { to: '/rabbithole', icon: Telescope, tone: 'text-[#a695b0]',
      label: el ? 'Κουνελότρυπα' : 'Rabbit Hole',
      desc: el ? 'Πιο βαθιά κείμενα, όταν η πρακτική σταθεροποιηθεί' : 'Deeper texts, for when your practice feels steady' },
    { to: '/method', icon: Compass, tone: 'text-[#8ba3ba]',
      label: el ? 'Η Μέθοδος' : 'The Method',
      desc: el ? 'Τι είναι ο Τετραπλός Άξονας και πώς δουλεύει' : 'What the Fourfold Axis is and how it works' },
  ];

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

  const affirmation = useMemo(() => {
    // using hour as dependency to re-calculate if day rolls over while app is open
    const _ = hour; 
    const now = new Date();
    const dayOfYear = getDayOfYear(now);
    return AFFIRMATIONS[dayOfYear % AFFIRMATIONS.length];
  }, [hour]);

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
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-md lg:sticky lg:top-24 flex-shrink-0 flex flex-col justify-center items-center px-4 gap-2 lg:gap-6 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] lg:pt-0 lg:pb-[calc(5rem+env(safe-area-inset-bottom))]">
          {/* Top Row: Brand Lockup + SOS */}
          <div className="w-full flex items-start justify-between gap-2 mt-2 px-1 sm:px-2">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col text-left shrink min-w-0"
            >
              <span className="text-[17px] min-[400px]:text-[20px] md:text-[22px] leading-tight tracking-[0.03em] min-[400px]:tracking-[0.05em] uppercase text-teal-300/90 font-medium whitespace-nowrap">
                {language === 'el' ? 'ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ' : 'MINDFULNESS'}
              </span>
              <span className="text-[10px] min-[375px]:text-[11px] md:text-[13px] leading-tight tracking-normal min-[375px]:tracking-[0.05em] md:tracking-[0.1em] uppercase text-white/40 font-medium mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {language === 'el' ? 'ΓΙΑ ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΟΥΣ' : 'FOR NEURODIVERGENT MINDS'}
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
                className="flex items-center justify-center h-[40px] min-[375px]:h-[44px] px-4 min-[375px]:px-5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 active:scale-95 transition-all text-[12px] min-[375px]:text-[13px] font-medium tracking-widest shrink-0"
                title={language === 'el' ? 'Άμεση Ηρέμηση' : 'Immediate Calm'}
              >
                SOS
              </Link>
            </motion.div>
          </div>

          <div className="w-[58%] md:w-[80%] mx-auto flex items-center justify-center"><FourfoldAxisHero activeAxis={null} /></div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-center px-4 mt-1 mb-1"
          >
            <p className="text-sm md:text-[15px] font-sans font-light tracking-wide text-white/60 leading-relaxed italic">
              "{language === 'el' ? affirmation.el : affirmation.en}"
            </p>
          </motion.div>
        </div>

        {/* Dashboard Content */}
        <div className="w-full max-w-lg px-5 flex flex-col gap-6">

        {/* Greeting & Date */}
        <div className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-[32px] md:text-[36px] font-sans font-medium tracking-tight leading-none text-white/95"
          >
            {greeting}
          </motion.h1>
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
          className="flex flex-col gap-3 mt-2"
        >
          <motion.div variants={itemVariants}>
            <Link to={`/chapters/${nextChapterData?.num ?? 1}`} className={cn(baseCardClasses, "bg-[#1a2026]/60 hover:bg-[#1a2026]/80 p-5 flex items-center gap-4 group cursor-pointer active:scale-[0.98] relative overflow-hidden")}>
              <div className="absolute top-[-30%] right-[-10%] w-48 h-48 bg-[#8ba3ba]/5 blur-[50px] rounded-full pointer-events-none" />
              <div className={cn(innerIconClasses, "w-12 h-12 shrink-0 text-[#8ba3ba]/70 group-hover:text-[#8ba3ba]")}>
                <BookOpen size={20} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1 min-w-0 flex-1 relative z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8ba3ba]/60 font-medium">
                  {isWorkbookDone
                    ? (lang === 'el' ? 'Ολοκλήρωσες τον οδηγό' : 'You finished the guide')
                    : completedChapters === 0
                      ? (lang === 'el' ? 'Ξεκίνα' : 'Start')
                      : (lang === 'el' ? 'Συνέχισε' : 'Continue')}
                </span>
                <h3 className="text-[17px] font-medium tracking-tight text-[#9bb8d1] leading-snug">
                  {lang === 'el' ? 'Κεφάλαιο' : 'Chapter'} {nextChapterData?.num} · {nextChapterData?.title}
                </h3>
                {!isNewUser && (
                  <span className="text-[11px] text-[#8ba3ba]/45 font-mono">{completedChapters}/{totalChapters}</span>
                )}
              </div>
              <ChevronRight size={18} className="text-[#8ba3ba]/40 group-hover:text-[#8ba3ba]/80 shrink-0 relative z-10" />
            </Link>
          </motion.div>

          {favouritePractice && (
            <motion.div variants={itemVariants}>
              <Link to={`/practice/breath/${favouritePractice.id}`} className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-[14px] text-white/75 transition-colors active:scale-[0.98]">
                <span className="flex items-center gap-2 min-w-0">
                  <RotateCcw size={14} className="text-white/40 shrink-0" />
                  <span className="truncate">{lang === 'el' ? 'Ξανά' : 'Again'}: {favouritePractice.title[lang]}</span>
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-[13px] text-white/60 hover:text-white/85 hover:bg-white/[0.06] transition-colors active:scale-[0.97]"
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
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors active:scale-[0.98]"
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
          className="mt-6 mb-6 flex flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
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


