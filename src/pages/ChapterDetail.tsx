import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHAPTERS_DATA } from '../data/chapters';
import { CHAPTER_TAKEAWAYS, CHAPTER_MICRO_CAT } from '../data/takeaways';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, Zap, Sparkles, Music } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { useReward } from '../contexts/RewardContext';
import { useProgress } from '../contexts/ProgressContext';
import { useAudioMixer } from '../contexts/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import InteractiveRenderer from '../components/InteractiveRenderer';

const ZenParagraph = ({ text, index }: { text: string, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.05, duration: 1.2, ease: "easeOut" }}
      className="relative"
    >
      <div 
        className="font-sans font-light text-white/80 leading-loose prose-a:text-teal-400/80 hover:prose-a:text-teal-400 transition-colors duration-700"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </motion.div>
  );
};

export default function ChapterDetail() {
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

  if (!chapter) {
    return <div className="p-8 text-center text-white/40">{language === 'el' ? 'Κεφάλαιο δεν βρέθηκε.' : 'Chapter not found.'}</div>;
  }

  const handleNext = () => {
    if (page < pages.length - 1) {
      setDirection(1);
      setPage(p => p + 1);
      setVisibleParagraphs(1);
    } else {
      updateChapterProgress(chapter.num, 1);
      markChapterComplete(chapter.num);
      triggerReward('program');
      navigate('/chapters');
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setDirection(-1);
      setPage(p => p - 1);
      setVisibleParagraphs(1);
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
    <div className="flex flex-col h-full animate-in fade-in duration-700 max-w-4xl mx-auto px-6">
      
      {/* Header Controls */}
      <header className="flex items-center justify-between pt-6 pb-2 shrink-0">
        <button 
          onClick={() => navigate('/chapters')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase font-sans">
              {language === 'el' ? 'Κεφάλαιο' : 'Chapter'} {chapter.num}
            </span>
            {CHAPTER_MICRO_CAT[chapter.num] && (
              <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5 uppercase font-sans">
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
            "rounded-full px-4 py-2 border flex items-center gap-2.5 transition-all duration-700 font-sans text-xs tracking-wider",
            masterPlaying 
              ? "text-teal-300 bg-teal-500/10 border-teal-500/20" 
              : "text-white/40 bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:text-white/70"
          )}
        >
          <Music size={14} className={masterPlaying ? "animate-pulse" : ""} />
          <span>{language === 'el' ? 'Ανάγνωση με Ήχο' : 'Ambient Reading'}</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main 
        className="flex-1 relative overflow-hidden flex flex-col"
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
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 overflow-y-auto scrollbar-none flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-start min-h-full pt-4 pb-20 max-w-[65ch] mx-auto w-full">
            {curPage.type === 'intro' && (
              <div className="space-y-12">
                <div className="space-y-6 text-center">
                   <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto backdrop-blur-md border border-white/5 shadow-inner"
                    style={{ backgroundColor: `${chapter.hex}15`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <h1 className="text-4xl md:text-6xl font-serif text-white/90 italic leading-tight tracking-tight px-4">
                    {chapter.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/50 leading-relaxed font-sans px-6 font-light">
                    {chapter.sub}
                  </p>
                </div>

                <div className="py-12 space-y-6 relative w-full text-left">
                  <div className="space-y-4 text-center">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/60 uppercase font-sans">
                      {language === 'el' ? 'ΣΥΝΟΨΗ' : 'SUMMARY'}
                    </span>
                    <p className="text-2xl md:text-3xl text-white/90 font-serif italic leading-[1.6] tracking-tight">
                      {chapter.summary}
                    </p>
                  </div>
                  
                  {chapter.tldr && (
                    <div className="pt-8 border-t border-white/5 text-center text-white/40 text-sm md:text-base font-sans leading-relaxed block px-8">
                      «{chapter.tldr}»
                    </div>
                  )}
                </div>
              </div>
            )}

            {curPage.type === 'theory' && curPage.section && (
              <article className="space-y-12 md:space-y-16 text-left w-full">
                <header className="space-y-4 text-center mt-8">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/60 uppercase font-sans block">
                    {language === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY'}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif text-white/90 italic leading-snug tracking-tight">
                    {curPage.section.title}
                  </h2>
                </header>

                <div className="space-y-8 text-base md:text-lg">
                  {curPage.section.paragraphs.map((par: string, p_idx: number) => (
                    <ZenParagraph key={p_idx} text={par} index={p_idx} />
                  ))}
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="pt-16 space-y-8"
                  >
                      {curPage.section.interactive && (
                        <div className="my-12">
                          <InteractiveRenderer id={curPage.section.interactive} asModal={true} />
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
                      <div className="border border-white/[0.03] bg-white/[0.01] rounded-3xl p-8 md:p-10 space-y-8 mt-16">
                        <div className="flex items-center gap-3 justify-center text-center">
                          <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase font-sans">
                            {language === 'el' ? 'ΒΑΣΙΚΑ ΣΗΜΕΙΑ' : 'KEY POINTS'}
                          </span>
                        </div>
                        <ul className="space-y-6">
                          {CHAPTER_TAKEAWAYS[currentLang][chapter.num]?.slice(0, 3).map((take, idx) => (
                            <li key={idx} className="flex gap-4 items-start text-base md:text-lg text-white/60 font-serif italic leading-relaxed">
                              <span className="text-white/20 mt-1.5">—</span>
                              {take}
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
                      <h2 className="text-3xl font-serif text-white/90 italic leading-tight tracking-tight">{chapter.exercise.title}</h2>
                    </header>
                    <ul className="space-y-8 pl-4">
                      {chapter.exercise.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-6 items-start group">
                          <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-sans font-bold text-white/40 shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-lg md:text-xl text-white/70 font-sans font-light leading-relaxed group-hover:text-white/90 transition-colors pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {chapter.insight && (
                    <div className="border border-teal-500/10 p-8 rounded-3xl space-y-6 relative group hover:border-teal-500/20 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                      <span className="text-[9px] font-bold text-teal-400/60 uppercase tracking-widest relative z-10 block font-sans">{language === 'el' ? 'ΕΠΙΓΝΩΣΗ' : 'INSIGHT'}</span>
                      <p className="text-lg md:text-xl text-white/80 font-serif italic leading-relaxed relative z-10">"{chapter.insight}"</p>
                    </div>
                  )}
                  {chapter.reflection && (
                    <div className="border border-white/5 bg-white/[0.02] p-8 rounded-3xl space-y-6 relative group hover:bg-white/[0.04] transition-all">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest relative z-10 block font-sans">{language === 'el' ? 'ΑΝΑΣΤΟΧΑΣΜΟΣ' : 'REFLECTION'}</span>
                      <p className="text-lg md:text-xl text-white/80 font-sans font-light leading-relaxed relative z-10">{chapter.reflection}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* In-content Navigation Buttons */}
            <div className="mt-24 pb-12 flex flex-col items-center gap-8">
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

    </div>
  );
}

