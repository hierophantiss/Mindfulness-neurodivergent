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
import OpenAwareness from '../components/animations/OpenAwareness';

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
    return <div className="p-8 text-center text-pine-400">{language === 'el' ? 'Κεφάλαιο δεν βρέθηκε.' : 'Chapter not found.'}</div>;
  }

  const handleNext = () => {
    if (page < pages.length - 1) {
      setDirection(1);
      setPage(p => p + 1);
      setVisibleParagraphs(1);
    } else {
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
      <header className="flex items-center justify-between py-8 shrink-0">
        <button 
          onClick={() => navigate('/chapters')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-pine-400 uppercase">
            {language === 'el' ? 'Κεφάλαιο' : 'Chapter'} {chapter.num}
          </span>
          <div className="flex gap-1 mt-2">
            {pages.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  i === page ? "w-6" : "w-2 bg-white/10"
                )}
                style={{ backgroundColor: i === page ? chapter.hex : undefined }}
              />
            ))}
          </div>
        </div>
        <div className="w-10 h-10" />
      </header>

      {/* Main Content Area */}
      <main 
        className="flex-1 relative overflow-hidden flex flex-col mb-24"
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
            className="h-full overflow-y-auto scrollbar-none py-4"
          >
            {curPage.type === 'intro' && (
              <div className="space-y-12 py-8">
                <div className="space-y-6 text-center">
                   <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-heading text-white italic leading-tight tracking-tight">
                    {chapter.title}
                  </h1>
                  <p className="text-xl text-pine-300 font-light max-w-2xl mx-auto leading-relaxed italic">
                    {chapter.sub}
                  </p>
                </div>

                <div className="glass-card rounded-[3rem] p-10 md:p-14 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-white/[0.02] -rotate-12">
                    {chapter.icon}
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-pine-500 uppercase">
                      {language === 'el' ? 'ΣΥΝΟΨΗ' : 'SUMMARY'}
                    </span>
                    <p className="text-2xl text-white font-light leading-relaxed">
                      {chapter.summary}
                    </p>
                  </div>
                  
                  {chapter.tldr && (
                    <div className="pt-8 border-t border-white/5 italic text-pine-400 text-lg font-light leading-relaxed">
                      «{chapter.tldr}»
                    </div>
                  )}
                </div>
              </div>
            )}

            {curPage.type === 'theory' && curPage.section && (
              <article className="space-y-10 py-8">
                <h2 className="text-4xl md:text-5xl font-heading text-white italic leading-tight">
                  {curPage.section.title}
                </h2>
                <div className="space-y-8 text-pine-200 text-lg md:text-xl font-light leading-relaxed">
                  {curPage.section.paragraphs.slice(0, visibleParagraphs).map((par: string, p_idx: number) => (
                    <p 
                      key={p_idx} 
                      className="animate-in fade-in slide-in-from-bottom-2 duration-700"
                      dangerouslySetInnerHTML={{ __html: par }} 
                    />
                  ))}
                  
                  {visibleParagraphs < curPage.section.paragraphs.length && (
                    <button 
                      onClick={() => setVisibleParagraphs(v => v + 1)}
                      className="group flex items-center gap-3 text-pine-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest py-4 border-b border-white/5 w-full"
                    >
                      {language === 'el' ? 'ΣΥΝΕΧΕΙΑ' : 'CONTINUE READING'}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}

                  {curPage.section.interactive === 'gravity_thoughts' && (
                    <div className="py-12"><GravityThoughts /></div>
                  )}
                  {curPage.section.interactive === 'open_awareness' && (
                    <div className="py-12"><OpenAwareness /></div>
                  )}

                  {visibleParagraphs >= curPage.section.paragraphs.length && curPage.section.image && (
                    <img 
                      src={curPage.section.image} 
                      alt="" 
                      className="w-full rounded-[2.5rem] opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 mt-12" 
                    />
                  )}
                </div>
              </article>
            )}

            {curPage.type === 'exercise' && (
              <div className="space-y-12 py-8">
                {chapter.exercise && (
                  <div className="glass-card rounded-[3rem] p-10 md:p-14 space-y-10">
                    <header className="space-y-3">
                      <span className="text-[10px] font-bold tracking-[0.3em] text-pine-500 uppercase">
                        {language === 'el' ? 'ΠΡΑΚΤΙΚΗ ΑΣΚΗΣΗ' : 'PRACTICE EXERCISE'}
                      </span>
                      <h2 className="text-4xl font-heading text-white italic">{chapter.exercise.title}</h2>
                    </header>
                    <ul className="space-y-8">
                      {chapter.exercise.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-6 items-start group">
                          <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-pine-400 group-hover:bg-white group-hover:text-pine-950 transition-all duration-500">
                            0{idx + 1}
                          </span>
                          <span className="text-lg text-pine-200 font-light leading-relaxed group-hover:text-white transition-colors">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {chapter.insight && (
                    <div className="glass-card rounded-[2.5rem] p-8 space-y-4">
                      <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">{language === 'el' ? 'ΕΠΙΓΝΩΣΗ' : 'INSIGHT'}</span>
                      <p className="text-pine-300 italic font-light leading-relaxed">"{chapter.insight}"</p>
                    </div>
                  )}
                  {chapter.reflection && (
                    <div className="glass-card rounded-[2.5rem] p-8 space-y-4">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{language === 'el' ? 'ΑΝΑΣΤΟΧΑΣΜΟΣ' : 'REFLECTION'}</span>
                      <p className="text-pine-300 font-light leading-relaxed">{chapter.reflection}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 max-w-4xl mx-auto z-20 backdrop-blur-xl bg-pine-950/20">
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={page === 0}
            className="btn-zen flex-1 disabled:opacity-20 flex justify-center !py-4"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            className="flex-[3] btn-zen bg-white !text-pine-950 hover:bg-white/90 flex justify-center items-center gap-3 !py-4"
            style={{ 
              backgroundColor: chapter.hex, 
              color: '#000',
              boxShadow: `0 10px 30px -10px ${chapter.hex}60`
            }}
          >
            <span className="text-sm font-bold uppercase tracking-widest">
              {page === pages.length - 1 ? (language === 'el' ? 'Ολοκλήρωση' : 'COMPLETE') : (language === 'el' ? 'Επόμενο' : 'NEXT')}
            </span>
            {page === pages.length - 1 ? <Check size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </footer>
    </div>
  );
}

