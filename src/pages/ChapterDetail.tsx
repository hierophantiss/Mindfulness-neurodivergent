import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHAPTERS_DATA } from '../data/chapters';
import { CHAPTER_TAKEAWAYS, CHAPTER_MICRO_CAT } from '../data/takeaways';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, Zap, Sparkles } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import GravityThoughts from '../components/animations/GravityThoughts';

export default function ChapterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateChapterProgress, trackActivity } = useCompanion();
  const { language } = useLanguage();
  
  const currentLang = language === 'en' && CHAPTERS_DATA['en'] ? 'en' : 'el';
  const chapter = CHAPTERS_DATA[currentLang].find(c => c.num === Number(id));

  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);
  const [visibleParagraphs, setVisibleParagraphs] = useState(1);

  // Generate pages array dynamically
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
    
    // Track chapter opened
    trackActivity('chapter_start', { id: chapter.num });
  }, [chapter, trackActivity]);

  // Update progress as they change pages
  useEffect(() => {
    if (!chapter || pages.length === 0) return;
    const pct = pages.length > 1 ? page / (pages.length - 1) : 1;
    updateChapterProgress(chapter.num, pct);
  }, [page, chapter, pages.length, updateChapterProgress]);

  if (!chapter) {
    return <div className="p-8 text-center text-pine-400">{language === 'el' ? 'Κεφάλαιο δεν βρέθηκε.' : 'Chapter not found.'}</div>;
  }

  const handleNext = () => {
    if (page < pages.length - 1) {
      setDirection(1);
      setPage(p => p + 1);
      setVisibleParagraphs(1);
    } else {
      // Mark as complete and go back
      updateChapterProgress(chapter.num, 1);
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
    if (diff > 40) {
      handleNext(); // swipe left -> next page
    } else if (diff < -40) {
      handlePrev(); // swipe right -> prev page
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const curPage = pages[page];

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <button 
          onClick={() => navigate('/chapters')} 
          className="w-10 h-10 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-pine-300 hover:bg-pine-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-sm font-semibold tracking-wider text-pine-300">
          {language === 'el' ? 'ΚΕΦΑΛΑΙΟ' : 'CHAPTER'} {chapter.num}
        </span>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-pine-800 rounded-full h-1.5 mb-6 shrink-0 overflow-hidden">
        <motion.div 
          className="h-1.5 rounded-full"
          style={{ backgroundColor: chapter.hex }}
          initial={{ width: 0 }}
          animate={{ width: `${((page + 1) / pages.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Page Content */}
      <div 
        className="flex-1 relative overflow-hidden flex flex-col min-h-0"
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
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex-1 overflow-y-auto w-full pb-4 scrollbar-none relative z-0"
          >
            {curPage.type === 'intro' && (
              <div className="flex flex-col items-center text-center mt-0">
                {(chapter.num >= 1 && chapter.num <= 4) ? (
                  <div className="w-full relative rounded-3xl overflow-hidden mb-6 md:mb-10 aspect-[4/3] md:aspect-[16/9] max-h-[45vh]">
                    <img 
                      src={chapter.num === 5 ? '/hero.webp' : `/chap${chapter.num}.png`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      loading="lazy"
                      alt={chapter.title} 
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-900/60 to-transparent" />
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pb-8 md:pb-12 text-left md:text-center">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-3 md:mb-4 leading-tight drop-shadow-lg">
                        {chapter.title}
                      </h1>
                      <p className="text-lg md:text-xl text-pine-100 font-normal max-w-2xl mx-auto tracking-wide drop-shadow-md">
                        {chapter.sub}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center mt-6 mb-12">
                    <div 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center text-5xl md:text-6xl bg-opacity-20 backdrop-blur-sm mb-6 shrink-0"
                      style={{ backgroundColor: `${chapter.hex}30`, color: chapter.hex }}
                    >
                      {chapter.icon}
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-5 leading-tight">
                      {chapter.title}
                    </h1>
                    <p className="text-lg md:text-xl text-pine-100 font-normal max-w-2xl mx-auto tracking-wide">
                      {chapter.sub}
                    </p>
                  </div>
                )}

                <div className="bg-white/[0.03] shadow-lg border border-white/[0.05] rounded-[2rem] p-8 md:p-10 w-full text-left backdrop-blur-md">
                  <h3 className="text-sm font-medium text-pine-300 uppercase tracking-widest mb-4">
                    {language === 'el' ? 'Περίληψη' : 'Summary'}
                  </h3>
                  <p className="text-pine-50 leading-loose text-lg tracking-wide font-normal">{chapter.summary}</p>
                  
                  {chapter.tldr && (
                    <div className="mt-8 p-6 md:p-8 rounded-[1.5rem] bg-opacity-10 border" style={{ backgroundColor: `${chapter.hex}10`, borderColor: `${chapter.hex}30` }}>
                      <p className="text-[17px] md:text-lg font-medium leading-loose tracking-wide text-white drop-shadow-sm">{chapter.tldr}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {curPage.type === 'theory' && curPage.section && (
              <div className="mt-4 md:mt-8 h-full flex flex-col px-2 md:px-6">
                <h2 className="text-3xl md:text-4xl font-medium text-white mb-8 border-b border-white/[0.08] pb-4 leading-tight">
                  {curPage.section.title}
                </h2>
                <div className="space-y-8 text-pine-50 leading-loose text-lg md:text-[19px] tracking-wide font-normal">
                  <AnimatePresence initial={false}>
                    {curPage.section.paragraphs.slice(0, visibleParagraphs).map((par: string, p_idx: number) => (
                      <motion.p 
                        key={p_idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        dangerouslySetInnerHTML={{ __html: par }} 
                        className="leading-loose" 
                      />
                    ))}
                  </AnimatePresence>
                  
                  {curPage.section.interactive === 'gravity_thoughts' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="mt-10 mb-10"
                    >
                      <GravityThoughts />
                    </motion.div>
                  )}

                  {visibleParagraphs < curPage.section.paragraphs.length && (
                    <div className="pt-4 flex justify-center">
                      <button 
                        onClick={() => setVisibleParagraphs(v => v + 1)}
                        className="px-6 py-3 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-pine-200 hover:text-white transition-all text-sm tracking-wide flex items-center gap-2"
                      >
                        {language === 'el' ? 'Συνέχεια Ανάγνωσης' : 'Continue Reading'}
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {visibleParagraphs >= curPage.section.paragraphs.length && curPage.section.image && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="mt-10 rounded-[2rem] overflow-hidden border border-white/[0.08] shadow-xl"
                    >
                      <img src={curPage.section.image} alt={curPage.section.title} loading="lazy" className="w-full h-auto object-cover max-h-96 opacity-90 hover:opacity-100 transition-opacity" />
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {curPage.type === 'exercise' && (
              <div className="mt-4 md:mt-8 space-y-8 px-2 md:px-6">
                {chapter.exercise && (
                  <div className="bg-white/[0.03] shadow-lg border border-white/[0.05] rounded-[2rem] p-8 md:p-10 backdrop-blur-md">
                    <h2 className="text-2xl md:text-3xl font-medium text-white mb-8 flex flex-col md:flex-row items-start md:items-center gap-3 leading-tight">
                      <span style={{ color: chapter.hex }} className="shrink-0">{language === 'el' ? 'Άσκηση:' : 'Exercise:'}</span> 
                      <span>{chapter.exercise.title}</span>
                    </h2>
                    <ul className="space-y-8">
                      {chapter.exercise.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-5 text-pine-50 text-lg leading-loose tracking-wide items-start">
                          <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm shrink-0 mt-1 text-pine-300 font-medium">
                            {idx + 1}
                          </span>
                          <span className="font-normal">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(chapter.insight || chapter.reflection || CHAPTER_TAKEAWAYS[currentLang]?.[chapter.num]) && (
                  <div className="grid grid-cols-1 gap-4">
                    {CHAPTER_TAKEAWAYS[currentLang]?.[chapter.num] && (
                      <div className="bg-pine-800/60 shadow-md border border-pine-600/50 rounded-3xl p-6">
                        <h3 className="text-xs font-semibold text-pine-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                          <Sparkles size={14} className="opacity-80" /> {language === 'el' ? 'Βασικα Σημεια' : 'Key Takeaways'}
                        </h3>
                        <ul className="space-y-2">
                          {CHAPTER_TAKEAWAYS[currentLang][chapter.num].map((ta, idx) => (
                            <li key={idx} className="flex gap-3 text-pine-100 text-[15px] leading-[1.6]">
                              <span className="text-teal-400 mt-1">•</span>
                              <span>{ta}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {chapter.insight && (
                      <div className="bg-pine-800/60 shadow-md border border-pine-600/50 rounded-3xl p-6">
                        <h3 className="text-xs font-semibold text-pine-400 uppercase tracking-wider mb-3">{language === 'el' ? 'Επίγνωση' : 'Insight'}</h3>
                        <p className="text-pine-100 italic text-[16px] leading-[1.7] tracking-wide">"{chapter.insight}"</p>
                      </div>
                    )}
                    {chapter.reflection && (
                      <div className="bg-pine-800/60 shadow-md border border-pine-600/50 rounded-3xl p-6">
                        <h3 className="text-xs font-semibold text-pine-400 uppercase tracking-wider mb-3">{language === 'el' ? 'Αναστοχασμός' : 'Reflection'}</h3>
                        <p className="text-pine-100 text-[16px] leading-[1.7] tracking-wide">{chapter.reflection}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Invisible Hitboxes with glowing subtle chevrons */}
        <button 
          className="hidden md:flex absolute top-[40%] left-0 w-[10%] h-1/4 z-10 flex-col justify-center items-start pl-2 group outline-none"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          aria-label="Previous page"
          disabled={page === 0}
        >
          {page > 0 && (
            <div className="p-3 rounded-full opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity duration-300">
              <ChevronLeft size={40} className="text-white" />
            </div>
          )}
        </button>
        
        <button 
          className="hidden md:flex absolute top-[40%] right-0 w-[10%] h-1/4 z-10 flex-col justify-center items-end pr-2 group outline-none"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          aria-label="Next page"
          disabled={page === pages.length - 1}
        >
          {page < pages.length - 1 && (
            <div className="p-3 rounded-full opacity-10 md:opacity-20 group-hover:opacity-100 transition-opacity duration-300">
              <ChevronRight size={40} className="text-white" />
            </div>
          )}
        </button>
      </div>

      {/* Navigation Controls */}
      <div className="flex flex-col gap-2 pt-2 shrink-0 border-t border-pine-800/50 mt-auto">
        {page === pages.length - 1 && (
           <button
             onClick={() => {
               const cat = CHAPTER_MICRO_CAT[chapter.num] || 'microdose';
               navigate(`/practice/microdoses?tab=${cat === 'microdose' ? 'all' : cat}`);
             }}
             className="w-full h-10 rounded-2xl bg-teal-900/40 border border-teal-800 flex items-center justify-center gap-2 text-teal-300 hover:bg-teal-800/60 transition-colors font-semibold shadow-sm text-[13px]"
           >
             <Zap size={16} />
             {language === 'el' ? 'Μικρές Δόσεις Ασκήσεων' : 'Microdose Practices'}
           </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="flex-1 h-10 rounded-2xl bg-pine-800/80 border border-pine-700 shadow-sm flex items-center justify-center gap-1.5 text-pine-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-pine-700 hover:text-white transition-all font-medium text-xs"
          >
            <ChevronLeft size={16} />
            {language === 'el' ? 'Πίσω' : 'Back'}
          </button>
          
          <button
            onClick={handleNext}
            className="flex-[2] h-10 rounded-2xl flex items-center justify-center gap-1.5 text-pine-950 transition-colors font-bold shadow-sm text-xs"
            style={{ backgroundColor: chapter.hex, opacity: 0.95 }}
          >
            {page === pages.length - 1 ? (
              <>
                {language === 'el' ? 'Ολοκλήρωση' : 'Complete'}
                <Check size={16} strokeWidth={2.5} className="opacity-80" />
              </>
            ) : (
              <>
                {language === 'el' ? 'Επόμενο' : 'Next'}
                <ChevronRight size={16} strokeWidth={2.5} className="opacity-80" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

