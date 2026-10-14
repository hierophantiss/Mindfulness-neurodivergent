import { useAccessibility } from '../hooks/useAccessibility';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CHAPTERS_DATA } from '../data/chapters';
import { CHAPTER_TAKEAWAYS, CHAPTER_MICRO_CAT } from '../data/takeaways';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, Zap, Sparkles, Music } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { useReward } from '../contexts/RewardContext';
import { useProgress } from '../contexts/ProgressContext';
import { useAudioMixer } from '../contexts/AudioContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import InteractiveRenderer from '../components/InteractiveRenderer';
import ChapterReaderBar from '../components/ChapterReaderBar';
import { buildChapterSegments } from '../lib/chapterReading';
import { useSpeechReader, loadReaderSettings, saveReaderSettings, type ReaderSettings } from '../hooks/useSpeechReader';
import { usePiperVoice } from '../hooks/usePiperVoice';

const READER_POS_KEY = 'n_mindfulness_reader_pos';

function readSavedPositions(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(READER_POS_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

function writeSavedPosition(id: string, key: string | null) {
  try {
    const all = readSavedPositions();
    if (key) all[id] = key;
    else delete all[id];
    localStorage.setItem(READER_POS_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
}

type ReadState = 'active' | 'dim' | undefined;

/** Highlight for the text being read: the current piece lights up, the rest steps back. */
const readClass = (state: ReadState) =>
  cn(
    'rounded-2xl -mx-3 px-3 -my-2 py-2 transition-[opacity,background-color,box-shadow] duration-500',
    state === 'active' && 'bg-teal-400/[0.06] shadow-[inset_0_0_0_1px_rgba(45,212,191,0.15)]',
    state === 'dim' && 'opacity-45'
  );

import { ConceptInfoIcon, ConceptModal } from '../components/ConceptInfoOverlay';

const CHAPTER_CONCEPTS_MAP: Record<number, { id: string; labelEn: string; labelEl: string; icon: string }[]> = {
  1: [
    { id: 'gibson_1979', labelEn: 'Gibson (1979) • Ecological Ground', labelEl: 'Gibson (1979) • Οικολογικό Έδαφος', icon: '🌲' },
    { id: 'gibson_2019', labelEn: 'Gibson (2019) • Interoception', labelEl: 'Μελέτη Gibson (2019) • Δια-αίσθηση', icon: '🔬' },
    { id: 'zylowska_2007', labelEn: 'Zylowska (2008) • ADHD', labelEl: 'Μελέτη Zylowska (2008) • ΔΕΠΥ', icon: '🔬' },
    { id: 'mackrous_2019', labelEn: 'Mackrous (2019) • Gravity Prediction', labelEl: 'Mackrous (2019) • Πρόβλεψη Βαρύτητας', icon: '🔬' },
    { id: 'vater_2022', labelEn: 'Vater (2022) • Peripheral Vision', labelEl: 'Vater (2022) • Περιφερειακή Όραση', icon: '👁️' },
    { id: 'corrigan_2010', labelEn: 'Corrigan (2011) • Window of Tolerance', labelEl: 'Corrigan (2011) • Παράθυρο Ανοχής', icon: '⚖️' },
    { id: 'grounding', labelEn: 'Grounding & Gravity', labelEl: 'Γείωση & Βαρύτητα', icon: '⛰️' },
    { id: 'proprioception', labelEn: 'Proprioception', labelEl: 'Ιδιοδεκτικότητα', icon: '🧠' },
    { id: 'movement_vs_breathwork', labelEn: 'Tai Chi & Movement', labelEl: 'Τάι Τσι & Κίνηση', icon: '🪷' },
  ],
  2: [
    { id: 'corrigan_2010', labelEn: 'Corrigan (2011) • Window of Tolerance', labelEl: 'Μελέτη Corrigan (2011) • Παράθυρο Ανοχής', icon: '⚖️' },
    { id: 'vagus_nerve', labelEn: 'Vagus Nerve Activation', labelEl: 'Ενεργοποίηση Πνευμονογαστρικού', icon: '⚡' },
    { id: 'parasympathetic', labelEn: 'Parasympathetic Response', labelEl: 'Παρασυμπαθητικό Σύστημα', icon: '🌿' },
    { id: 'interoception', labelEn: 'Inner Touch', labelEl: 'Εσωτερική Αφή', icon: '🫁' },
    { id: 'pattern_4261', labelEn: '4-2-6-1 Breath', labelEl: 'Αναπνοή 4-2-6-1', icon: '🌬️' }
  ],
  3: [
    { id: 'farb_2007', labelEn: 'Farb (2007) • Neural Self-Reference', labelEl: 'Μελέτη Farb (2007) • Αυτοαναφορά', icon: '🔬' },
    { id: 'zylowska_2007', labelEn: 'ADHD Cognitive Practice', labelEl: 'ΔΕΠΥ & Γνωστική Πρακτική', icon: '🔬' },
    { id: 'gentle_return', labelEn: 'The Gentle Return', labelEl: 'Η Απαλή Επιστροφή', icon: '🔥' },
    { id: 'attention_modes', labelEn: 'Attentional Flashlight', labelEl: 'Φακός της Προσοχής', icon: '🔦' }
  ],
  4: [
    { id: 'davidson_2004', labelEn: 'Lutz (2004) • Gamma Synchrony', labelEl: 'Μελέτη Lutz (2004) • Κύματα Gamma', icon: '🔬' },
    { id: 'farb_2007', labelEn: 'Farb (2007) • Experiential Focus', labelEl: 'Μελέτη Farb (2007) • Βιωματική Εστίαση', icon: '🔬' },
    { id: 'open_awareness', labelEn: 'Open Awareness', labelEl: 'Ανοιχτή Επίγνωση', icon: '🌌' },
    { id: 'sky_metaphor', labelEn: 'Dzogchen (Rigpa)', labelEl: 'Dzogchen (Ρίγκπα)', icon: '🪷' },
    { id: 'peripheral_vision', labelEn: 'Peripheral Gaze', labelEl: 'Περιφερειακή Όραση', icon: '👁️' }
  ],
  5: [
    { id: 'corrigan_2010', labelEn: 'Corrigan (2011) • Window of Tolerance', labelEl: 'Μελέτη Corrigan (2011) • Παράθυρο Ανοχής', icon: '⚖️' },
    { id: 'brewer_2011', labelEn: 'Brewer (2011) • DMN & Mechanical Mind', labelEl: 'Μελέτη Brewer (2011) • DMN', icon: '🧠' },
    { id: 'kim_2025', labelEn: 'Kim (2025) • Adult ADHD', labelEl: 'Μελέτη Kim (2025) • ΔΕΠΥ', icon: '🔬' },
    { id: 'zylowska_2007', labelEn: 'ADHD Adaptation', labelEl: 'ΔΕΠΥ & Προσαρμογή', icon: '🔬' },
    { id: 'cearns_2022', labelEn: 'Habit & Adherence', labelEl: 'Μελέτη Cearns & Clark (2023) • Δόση', icon: '📊' },
    { id: 'hyperfocus', labelEn: 'Hyperfocus Breakthrough', labelEl: 'Απελευθέρωση Hyperfocus', icon: '🧠' },
    { id: 'amygdala', labelEn: 'Amygdala (No Self-Criticism)', labelEl: 'Αμυγδαλή (Όχι Αυτοκριτική)', icon: '🛡️' }
  ],
  6: [
    { id: 'cearns_2022', labelEn: 'Consistency & Microdosing', labelEl: 'Συνέπεια & Μικροδόσεις', icon: '⚡' },
    { id: 'peripheral_vision', labelEn: 'Peripheral Safety Sign', labelEl: 'Περιφερειακό Σήμα Ασφάλειας', icon: '👁️' },
    { id: 'parasympathetic', labelEn: 'Active Recovery', labelEl: 'Ενεργή Ανάκαμψη', icon: '🌿' }
  ],
  7: [
    { id: 'corrigan_2010', labelEn: 'Corrigan (2011) • Window of Tolerance', labelEl: 'Corrigan (2011) • Παράθυρο Ανοχής', icon: '⚖️' },
    { id: 'gravity', labelEn: 'Gravity', labelEl: 'Βαρύτητα', icon: '⛰️' },
    { id: 'mechanical_mind', labelEn: 'Mechanical Mind', labelEl: 'Μηχανικός Νους', icon: '⚙️' },
    { id: 'self_criticism', labelEn: 'Self-Criticism', labelEl: 'Αυτοκριτική', icon: '🪞' },
    { id: 'kindness', labelEn: 'Kindness', labelEl: 'Καλοσύνη', icon: '🤍' },
    { id: 'trauma', labelEn: 'Trauma-Informed', labelEl: 'Trauma-Informed', icon: '🛡️' }
  ],
  8: [
    { id: 'polyvagal', labelEn: 'Porges (1995) • Polyvagal Theory', labelEl: 'Θεωρία Porges (1995) • Πολυβαγική', icon: '🛡️' },
    { id: 'binaural_beats', labelEn: 'Lane (1998) • Binaural Beats', labelEl: 'Μελέτη Lane (1998) • Διωτικά Κύματα', icon: '🔬' },
    { id: 'sos', labelEn: 'Somatic Crisis Protocol', labelEl: 'Πρωτόκολλο Κρίσης SOS', icon: '🚨' },
    { id: 'vagus_nerve', labelEn: 'Slow Exhale Vagus', labelEl: 'Πνευμονογαστρική Εκπνοή', icon: '🌬️' },
    { id: 'trauma', labelEn: 'Trauma-Informed Anchor', labelEl: 'Trauma-Informed Άγκυρα', icon: '🛡️' }
  ],
  9: [
    { id: 'cearns_2022', labelEn: 'Dose & Practice Adherence', labelEl: 'Δόση & Τήρηση Πρακτικής', icon: '🔬' },
    { id: 'sky_metaphor', labelEn: 'The Spacious Containment', labelEl: 'Ανοιχτός Χώρος', icon: '🌌' },
    { id: 'vagus_nerve', labelEn: 'Physiological Brake', labelEl: 'Φυσιολογικό Φρένο', icon: '⚡' }
  ],
  10: [
    { id: 'gentle_return', labelEn: 'Non-Judgmental Practice', labelEl: 'Μη-επικριτική Επιστροφή', icon: '🔥' },
    { id: 'grounding', labelEn: 'Somatic Stability', labelEl: 'Σωματική Σταθερότητα', icon: '⛰️' },
    { id: 'trauma', labelEn: 'Internal Safe Space', labelEl: 'Εσωτερικός Ασφαλής Χώρος', icon: '🛡️' }
  ],
  11: [
    { id: 'zylowska_2007', labelEn: 'Clinical ADHD Study', labelEl: 'Κλινική Μελέτη ΔΕΠΥ', icon: '🔬' },
    { id: 'farb_2007', labelEn: 'Farb Neural Modes fMRI Study', labelEl: 'Μελέτη fMRI Farb • Νευρικοί Τρόποι', icon: '🔬' },
    { id: 'gibson_2019', labelEn: 'Gibson (2019) • Interoception', labelEl: 'Μελέτη Gibson (2019) • Δια-αίσθηση', icon: '🔬' },
    { id: 'cearns_2022', labelEn: 'Cearns & Clark (2023) • 280,000 Sessions', labelEl: 'Μελέτη Cearns & Clark (2023) • 280.000 Συνεδρίες', icon: '🔬' },
    { id: 'polyvagal', labelEn: 'Porges Vagal Safety Model', labelEl: 'Μοντέλο Vagal Porges (Πολυβαγική)', icon: '🛡️' },
    { id: 'davidson_2004', labelEn: 'Lutz (2004) • Gamma Synchrony', labelEl: 'Μελέτη Lutz (2004) • Κύματα Gamma', icon: '🔬' },
    { id: 'binaural_beats', labelEn: 'Oster (1973) Brainwave Entrainment', labelEl: 'Μελέτη Oster (1973) • Διωτικά Κύματα', icon: '🔬' },
    { id: 'vagus_nerve', labelEn: 'Vagal Regulation', labelEl: 'Πνευμονογαστρική Ρύθμιση', icon: '⚡' },
    { id: 'proprioception', labelEn: 'Proprioception', labelEl: 'Ιδιοδεκτικότητα', icon: '🧠' },
    { id: 'sky_metaphor', labelEn: 'Dzogchen (Rigpa/Mahamudra)', labelEl: 'Dzogchen (Ρίγκπα/Μαχαμούντρα)', icon: '🪷' },
    { id: 'movement_vs_breathwork', labelEn: 'Somatic Movement (Tai Chi)', labelEl: 'Σωματική Κίνηση (Τάι Τσι)', icon: '🪷' }
  ]
};

const ConceptAnnotatedText = ({ text }: { text: string }) => {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/\{\{([^}]+)\}\}/);
        if (match) {
          const conceptId = match[1];
          return (
            <span key={i} className="inline-flex items-center align-middle mx-1.5 -translate-y-[2px]">
              <ConceptInfoIcon conceptId={conceptId} className="w-5 h-5 ml-0" />
            </span>
          );
        }
        
        const strongParts = part.split(/(<strong>.*?<\/strong>|\*\*.*?\*\*|\*[^*]+\*)/g);
        return (
          <React.Fragment key={i}>
            {strongParts.map((sp, j) => {
              if (sp.startsWith('<strong>') && sp.endsWith('</strong>')) {
                return <strong key={j} className="font-semibold text-white/95">{sp.slice(8, -9)}</strong>;
              }
              if (sp.startsWith('**') && sp.endsWith('**')) {
                return <strong key={j} className="font-semibold text-white/95">{sp.slice(2, -2)}</strong>;
              }
              if (sp.startsWith('*') && sp.endsWith('*')) {
                return <strong key={j} className="font-semibold text-white/95">{sp.slice(1, -1)}</strong>;
              }
              return <span key={j}>{sp}</span>;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

const ZenParagraph = ({ text, index, readKey, readState }: { text: string, index: number, readKey?: string, readState?: ReadState }) => {
    const { reduceMotion } = useAccessibility();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={reduceMotion ? { duration: 0.01 } : { delay: index * 0.05, duration: 1.2, ease: "easeOut" }}
      className="relative"
    >
      <div 
        data-read-key={readKey}
        className={cn("font-sans font-light text-white/80 leading-loose whitespace-pre-line", readClass(readState))}
      >
        <ConceptAnnotatedText text={text} />
      </div>
    </motion.div>
  );
};

export default function ChapterDetail() {
    const { reduceMotion } = useAccessibility();
  

  const { id } = useParams();
  const navigate = useNavigate();
  const { updateChapterProgress, trackActivity } = useCompanion();
  const { language } = useLanguage();
  const { markChapterComplete } = useProgress();
  const { triggerReward } = useReward();
  const { masterPlaying, toggleMaster } = useAudioMixer();
  
  const currentLang = language === 'en' && CHAPTERS_DATA['en'] ? 'en' : 'el';
  const chapter = CHAPTERS_DATA[currentLang].find(c => c.num === Number(id));

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const [visibleParagraphs, setVisibleParagraphs] = useState(1);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);

  const pages = [];
  if (chapter) {
    pages.push({ type: 'intro' });
    chapter.theorySections?.forEach((sec, idx) => {
      pages.push({ type: 'theory', section: sec, index: idx });
    });
    if (chapter.exercise || chapter.insight || chapter.reflection) {
      pages.push({ type: 'exercise' });
    }
  }

  useEffect(() => {
    if (!chapter) return;
    trackActivity('chapter_start', { id: chapter.num });
  }, [chapter, trackActivity]);

  useEffect(() => {
    if (!chapter || pages.length === 0) return;
    const pct = pages.length > 1 ? page / (pages.length - 1) : 1;
    updateChapterProgress(chapter.num, pct);
  }, [page, chapter, pages.length, updateChapterProgress]);


  const allParagraphs = [];
  if (chapter) {
    allParagraphs.push(chapter.title);
    allParagraphs.push(chapter.summary);
    if (chapter.tldr) allParagraphs.push(chapter.tldr);
    chapter.theorySections?.forEach(sec => {
      allParagraphs.push(sec.title);
      sec.paragraphs?.forEach(p => allParagraphs.push(p));
    });
  }

  // ── Read aloud ────────────────────────────────────────────────
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(loadReaderSettings);
  const takeaways = chapter ? CHAPTER_TAKEAWAYS[currentLang][chapter.num] : undefined;
  const segments = useMemo(
    () => (chapter ? buildChapterSegments(chapter, takeaways, currentLang) : []),
    [chapter, takeaways, currentLang]
  );
  const piper = usePiperVoice(currentLang);
  const readerMedia = useMemo(
    () => (chapter ? { title: chapter.title, artist: currentLang === 'el' ? `Κεφάλαιο ${chapter.num}` : `Chapter ${chapter.num}` } : undefined),
    [chapter, currentLang]
  );
  const reader = useSpeechReader(segments, currentLang, readerSettings, piper.ready, readerMedia);
  const readerActive = reader.status !== 'idle';
  const activeSeg = readerActive ? segments[reader.index] : undefined;
  const posId = chapter ? `${currentLang}-${chapter.num}` : '';
  const [savedKey, setSavedKey] = useState<string | undefined>(() => readSavedPositions()[posId]);
  const lastIndexRef = useRef(0);

  const rs = (key: string): ReadState =>
    !readerActive ? undefined : activeSeg?.key === key ? 'active' : 'dim';

  const updateReaderSettings = (s: ReaderSettings) => {
    setReaderSettings(s);
    saveReaderSettings(s);
  };

  // Keep the page in step with the reading, and remember where the listener is.
  useEffect(() => {
    if (!activeSeg) return;
    lastIndexRef.current = reader.index;
    if (activeSeg.page !== page) {
      setDirection(activeSeg.page > page ? 1 : -1);
      setPage(activeSeg.page);
      setVisibleParagraphs(1);
    }
    writeSavedPosition(posId, activeSeg.key);
    setSavedKey(activeSeg.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSeg?.key]);

  // Reaching the end clears the saved place; closing the player keeps it.
  useEffect(() => {
    if (reader.status === 'idle' && lastIndexRef.current >= segments.length - 1 && segments.length) {
      writeSavedPosition(posId, null);
      setSavedKey(undefined);
      lastIndexRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader.status]);

  // Bring the text being read into view (after the page transition, if any).
  useEffect(() => {
    if (!activeSeg || !readerSettings.follow) return;
    let tries = 0;
    let timer = 0;
    const find = () => {
      const el = document.querySelector<HTMLElement>(`[data-read-key="${activeSeg.key}"]`);
      if (el) el.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      else if (tries++ < 8) timer = window.setTimeout(find, 120);
    };
    timer = window.setTimeout(find, 80);
    return () => window.clearTimeout(timer);
  }, [activeSeg?.key, readerSettings.follow, reduceMotion]);

  const firstSegmentOfPage = (pg: number) => {
    const i = segments.findIndex((sg) => sg.page >= pg);
    return i === -1 ? 0 : i;
  };

  if (!chapter) {
    return <div className="p-8 text-center text-white/40">{language === 'el' ? 'Κεφάλαιο δεν βρέθηκε.' : 'Chapter not found.'}</div>;
  }

  const scrollToTop = () => {
    document.getElementById('main-content')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (page < pages.length - 1) {
      if (readerActive) reader.jump(firstSegmentOfPage(page + 1));
      setDirection(1);
      setPage(p => p + 1);
      setVisibleParagraphs(1);
      scrollToTop();
    } else {
      reader.stop();
      updateChapterProgress(chapter.num, 1);
      markChapterComplete(chapter.num);
      triggerReward('program');
      navigate('/chapters');
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      if (readerActive) reader.jump(firstSegmentOfPage(page - 1));
      setDirection(-1);
      setPage(p => p - 1);
      setVisibleParagraphs(1);
      scrollToTop();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) handleNext();
    else if (diff < -40) handlePrev();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 20 : -20, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 20 : -20, opacity: 0 })
  };

  const curPage = pages[page];

  return (
    <div className="flex flex-col min-h-full animate-in fade-in duration-700 max-w-4xl mx-auto px-4 sm:px-6 w-full min-w-0">
      
      {/* Header Controls */}
      <header className="flex flex-wrap sm:flex-nowrap items-center justify-between pt-6 pb-2 shrink-0 gap-y-4 w-full">
        <button 
          onClick={() => navigate('/chapters')} 
          className="btn-zen !px-3 !py-3 shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center shrink min-w-0">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase font-sans whitespace-nowrap">
              {language === 'el' ? 'Κεφάλαιο' : 'Chapter'} {chapter.num}
            </span>
            {CHAPTER_MICRO_CAT[chapter.num] && (
              <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5 uppercase font-sans whitespace-nowrap">
                {CHAPTER_MICRO_CAT[chapter.num]}
              </span>
            )}
          </div>
          <div className="flex gap-1 mt-2">
            {pages.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === page ? "w-6" : "w-1 bg-white/10"
                )}
                style={{ backgroundColor: i === page ? chapter.hex : undefined }}
              />
            ))}
          </div>
        </div>
        
        {/* Discret Ambient Audio Toggle */}
        <button 
          onClick={toggleMaster}
          title={language === 'el' ? 'Ηχητικό Τοπίο' : 'Ambient Audio'}
          className={cn(
            "rounded-full px-3 py-2 border flex items-center justify-center gap-2 transition-all duration-700 font-sans text-[10px] sm:text-xs tracking-wider shrink-0 whitespace-nowrap",
            masterPlaying 
              ? "text-teal-300 bg-teal-500/10 border-teal-500/20" 
              : "text-white/40 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:text-white/70"
          )}
        >
          <Music size={14} className={masterPlaying ? "animate-pulse" : ""} />
          <span className="hidden sm:inline">{language === 'el' ? 'Ανάγνωση με Ήχο' : 'Ambient Reading'}</span>
          <span className="sm:hidden">{language === 'el' ? 'Ήχος' : 'Audio'}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main 
        className="relative flex flex-col w-full items-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0.01 } : { duration: 0.4, ease: "easeOut" }}
            className="flex flex-col w-full px-2"
          >
            <div className="flex flex-col justify-start pt-4 pb-32 max-w-[65ch] mx-auto w-full text-center">
            {curPage.type === 'intro' && (
              <div className="space-y-8">
                <div className="space-y-6 text-center">
                   <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto backdrop-blur-md border border-white/5 shadow-inner"
                    style={{ backgroundColor: `${chapter.hex}15`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <div data-read-key="intro-title" className={readClass(rs('intro-title'))}>
                    <h1 className="text-4xl md:text-6xl font-serif text-white/90 italic leading-tight tracking-tight px-4">
                      {chapter.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/50 leading-relaxed font-sans px-6 font-light mt-6">
                      {chapter.sub}
                    </p>
                  </div>
                </div>

                <div className="py-6 space-y-6 relative w-full text-left">
                  <div className="space-y-4 text-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/60 uppercase font-sans">
                      {language === 'el' ? 'ΣΥΝΟΨΗ' : 'SUMMARY'}
                    </span>
                    <p data-read-key="intro-summary" className={cn("text-2xl md:text-3xl text-white/90 font-serif italic leading-[1.6] tracking-tight", readClass(rs('intro-summary')))}>
                      {chapter.summary}
                    </p>
                  </div>
                  
                  {chapter.tldr && (
                    <div className="pt-8 border-t border-white/5 text-center text-white/40 text-sm md:text-base font-sans leading-relaxed block px-8">
                      <div data-read-key="intro-tldr" className={readClass(rs('intro-tldr'))}>«{chapter.tldr}»</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {curPage.type === 'theory' && curPage.section && (
              <article className="space-y-12 md:space-y-16 text-center w-full break-words">
                <header className="space-y-4 text-center mt-8">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/60 uppercase font-sans block">
                    {language === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY'}
                  </span>
                  <h2
                    data-read-key={`s${curPage.index}-title`}
                    className={cn("text-3xl md:text-4xl font-serif text-white/90 italic leading-snug tracking-tight px-2", readClass(rs(`s${curPage.index}-title`)))}
                  >
                    {curPage.section.title}
                  </h2>
                </header>

                <div className="space-y-8 text-lg md:text-xl text-center font-light px-2">
                  {curPage.section.paragraphs.map((par: string, p_idx: number) => (
                    <ZenParagraph key={p_idx} text={par} index={p_idx} readKey={`s${curPage.index}-p${p_idx}`} readState={rs(`s${curPage.index}-p${p_idx}`)} />
                  ))}
                  
                  {curPage.section.actionLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={reduceMotion ? { duration: 0.01 } : { delay: 0.3, duration: 0.8 }}
                      className="pt-6 flex justify-center"
                    >
                      <Link 
                        to={curPage.section.actionLink.url}
                        className="text-white/90 font-medium inline-block p-4 px-6 bg-white/[0.05] hover:bg-white/[0.1] rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                      >
                        {curPage.section.actionLink.label}
                      </Link>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={reduceMotion ? { duration: 0.01 } : { delay: 0.2, duration: 1 }}
                    className="pt-16 space-y-8"
                  >
                      {curPage.section.interactive && (
                        <div className="my-12">
                          <InteractiveRenderer id={curPage.section.interactive} asModal={false} />
                        </div>
                      )}

                      {curPage.section.image && (
                        <img 
                          src={curPage.section.image} 
                          alt="" 
                          className="w-full rounded-2xl opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 my-10" 
                        />
                      )}

                      {/* Key Takeaways for this section or end of sections */}
                      <div
                        data-read-key={`s${curPage.index}-key`}
                        className={cn(
                          "border border-white/[0.03] bg-white/[0.01] rounded-3xl p-8 md:p-10 space-y-8 mt-16 transition-[opacity,background-color,box-shadow] duration-500",
                          rs(`s${curPage.index}-key`) === 'active' && 'bg-teal-400/[0.05] shadow-[inset_0_0_0_1px_rgba(45,212,191,0.15)]',
                          readerActive && activeSeg?.key !== `s${curPage.index}-key` && 'opacity-45'
                        )}
                      >
                        <div className="flex items-center gap-3 justify-center text-center">
                          <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase font-sans">
                            {language === 'el' ? 'ΒΑΣΙΚΑ ΣΗΜΕΙΑ' : 'KEY POINTS'}
                          </span>
                        </div>
                        <ul className="space-y-6">
                          {CHAPTER_TAKEAWAYS[currentLang][chapter.num]?.slice(0, 3).map((take, idx) => (
                            <li key={idx} className="flex gap-4 items-start text-base md:text-lg text-white/60 font-serif italic leading-relaxed">
                              <span className="text-white/20 mt-1.5">—</span>
                              <ConceptAnnotatedText text={take} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                </div>
              </article>
            )}

            {curPage.type === 'exercise' && (
              <div className="space-y-16 text-left w-full mt-10">
                {chapter.exercise && (
                  <div className="border border-white/5 bg-white/[0.01] rounded-[2rem] p-8 md:p-12 space-y-10">
                    <header className="space-y-4 text-center">
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/60 uppercase font-sans">
                          {language === 'el' ? 'ΠΡΑΚΤΙΚΗ ΑΣΚΗΣΗ' : 'PRACTICE EXERCISE'}
                        </span>
                      </div>
                      <h2 data-read-key="ex-title" className={cn("text-3xl font-serif text-white/90 italic leading-tight tracking-tight", readClass(rs('ex-title')))}>{chapter.exercise.title}</h2>
                    </header>
                    <ul className="space-y-8 pl-4">
                      {chapter.exercise.steps.map((step, idx) => (
                        <li key={idx} data-read-key={`ex-step${idx}`} className={cn("flex gap-6 items-start group", readClass(rs(`ex-step${idx}`)))}>
                          <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-sans font-bold text-white/40 shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-lg md:text-xl text-white/70 font-sans font-light leading-relaxed group-hover:text-white/90 transition-colors pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Evidence & Foundations Section */}
                    {CHAPTER_CONCEPTS_MAP[chapter.num] && CHAPTER_CONCEPTS_MAP[chapter.num].length > 0 && (
                      <div className="pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-teal-400">
                          <span className="text-[10px] font-bold tracking-widest uppercase font-mono">
                            {language === 'el' ? '🔬 Επιστημονική & Παραδοσιακή Θεμελίωση' : '🔬 Scientific & Traditional Foundations'}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed font-sans max-w-2xl">
                          {language === 'el'
                            ? 'Αυτή η άσκηση συνδέεται με κλινικές έρευνες, νευρολογικές εξηγήσεις και αρχαίες παραδόσεις. Επίλεξε μια πηγή για να δεις DOIs και περιλήψεις:'
                            : 'This practice is backed by clinical studies, neurobiological evidence, and contemplative lineages. Select a reference to explore DOIs and research summaries:'}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {CHAPTER_CONCEPTS_MAP[chapter.num].map((concept) => (
                            <button
                              key={concept.id}
                              onClick={() => setActiveConceptId(concept.id)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[12px] text-white/60 hover:text-teal-300 hover:bg-teal-500/10 hover:border-teal-500/20 active:scale-95 transition-all duration-300"
                            >
                              <span>{concept.icon}</span>
                              <span className="font-serif italic font-medium">{language === 'el' ? concept.labelEl : concept.labelEn}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {chapter.insight && (
                    <div
                      data-read-key="insight"
                      className={cn(
                        "border border-teal-500/10 p-8 rounded-3xl space-y-6 relative group hover:border-teal-500/20 transition-all duration-500",
                        rs('insight') === 'active' && 'bg-teal-400/[0.05] border-teal-400/25',
                        rs('insight') === 'dim' && 'opacity-45'
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                      <span className="text-[9px] font-bold text-teal-400/60 uppercase tracking-widest relative z-10 block font-sans">{language === 'el' ? 'ΕΠΙΓΝΩΣΗ' : 'INSIGHT'}</span>
                      <p className="text-lg md:text-xl text-white/80 font-serif italic leading-relaxed relative z-10">"{chapter.insight}"</p>
                    </div>
                  )}
                  {chapter.reflection && (
                    <div
                      data-read-key="reflection"
                      className={cn(
                        "border border-white/5 bg-white/[0.02] p-8 rounded-3xl space-y-6 relative group hover:bg-white/[0.04] transition-all duration-500",
                        rs('reflection') === 'active' && 'bg-teal-400/[0.05] border-teal-400/25',
                        rs('reflection') === 'dim' && 'opacity-45'
                      )}
                    >
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest relative z-10 block font-sans">{language === 'el' ? 'ΑΝΑΣΤΟΧΑΣΜΟΣ' : 'REFLECTION'}</span>
                      <p className="text-lg md:text-xl text-white/80 font-sans font-light leading-relaxed relative z-10">{chapter.reflection}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* In-content Navigation Buttons */}
            <div className="mt-8 pb-12 flex flex-col items-center gap-8">
              {page < pages.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="group flex flex-col items-center gap-4 transition-all duration-700"
                >
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-teal-500/50 group-hover:bg-teal-500/5 transition-all duration-700 group-active:scale-90 shadow-lg">
                    <ChevronRight size={28} className="text-white/20 group-hover:text-teal-400 transition-colors ml-1" />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.4em] text-white/30 group-hover:text-teal-400 transition-colors uppercase">
                    {language === 'el' ? 'ΣΥΝΕΧΕΙΑ' : 'CONTINUE'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="w-full max-w-sm py-6 rounded-2xl flex justify-center items-center gap-4 text-black font-bold uppercase tracking-widest transition-all duration-500 active:scale-[0.98] shadow-2xl"
                  style={{ 
                    backgroundColor: chapter.hex,
                    boxShadow: `0 20px 40px -10px ${chapter.hex}50`
                  }}
                >
                  <span className="text-sm">{language === 'el' ? 'Ολοκλήρωση' : 'COMPLETE'}</span>
                  <Check size={20} />
                </button>
              )}

              {page > 0 && (
                <button 
                  onClick={handlePrev}
                  className="text-[10px] font-bold text-white/20 hover:text-white/40 tracking-[0.2em] uppercase transition-colors"
                >
                  {language === 'el' ? 'ΠΡΟΗΓΟΥΜΕΝΟ' : 'PREVIOUS'}
                </button>
              )}
            </div>
            
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {piper.supported && segments.length > 0 && (
        <ChapterReaderBar
          lang={currentLang}
          status={reader.status}
          index={reader.index}
          total={segments.length}
          kind={activeSeg?.kind}
          silence={reader.silence}
          waiting={reader.waiting}
          errorCode={reader.errorCode}
          piper={piper}
          hasResume={!!savedKey && segments.some((sg) => sg.key === savedKey) && segments[0].key !== savedKey}
          settings={readerSettings}
          reduceMotion={reduceMotion}
          onStart={() => reader.playFrom(firstSegmentOfPage(page))}
          onResumeSaved={() => reader.playFrom(Math.max(0, segments.findIndex((sg) => sg.key === savedKey)))}
          onPause={reader.pause}
          onResume={reader.resume}
          onPrev={() => reader.jump(Math.max(0, reader.index - 1))}
          onNext={() => reader.jump(Math.min(segments.length - 1, reader.index + 1))}
          onStop={reader.stop}
          onSettings={updateReaderSettings}
        />
      )}

      <ConceptModal 
        isOpen={!!activeConceptId} 
        conceptId={activeConceptId || ''} 
        onClose={() => setActiveConceptId(null)} 
      />
    </div>
  );
}

