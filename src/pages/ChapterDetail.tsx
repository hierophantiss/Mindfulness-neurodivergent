import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CHAPTERS_DATA } from '../data/chapters';
import { CHAPTER_TAKEAWAYS, CHAPTER_MICRO_CAT } from '../data/takeaways';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, Zap, Sparkles } from 'lucide-react';
import { useCompanion } from '../hooks/useCompanion';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import InteractiveRenderer from '../components/InteractiveRenderer';

const ExpandableParagraph = ({ text, index, language }: { text: string, index: number, language: "en" | "el" }) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="relative group cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div 
        className={cn(
          "transition-all duration-500 ease-out italic border-l-[3px] md:border-l-4 pl-4 md:pl-6",
          isExpanded ? "border-teal-500/40" : "border-white/5 hover:border-teal-500/20"
        )}
      >
        <div 
          className={cn(
            "relative transition-all duration-500 overflow-hidden",
            !isExpanded ? "max-h-20 text-white/50 opacity-80 line-clamp-2 md:line-clamp-3" : "max-h-[1000px] text-white/70"
          )}
          dangerouslySetInnerHTML={{ __html: text }}
        />
        
        <AnimatePresence>
          {!isExpanded && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#050710] to-transparent pointer-events-none" 
            />
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-4 pl-4 md:pl-6 2xl:pl-8 flex items-center gap-1.5 transition-colors">
        <div className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-teal-400/30 group-hover:text-teal-400/60 transition-colors flex items-center gap-1.5">
          {isExpanded ? (
            <><ChevronUp size={14} /> {language === 'el' ? 'ΣΥΜΠΤΥΞΗ' : 'COLLAPSE'}</>
          ) : (
            <><ChevronDown size={14} /> {language === 'el' ? 'ΠΕΡΙΣΣΟΤΕΡΑ' : 'READ MORE'}</>
          )}
        </div>
      </div>
    </motion.div>
  );
};

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
    return <div className="p-8 text-center text-white/40">{language === 'el' ? 'Κεφάλαιο δεν βρέθηκε.' : 'Chapter not found.'}</div>;
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
      <header className="flex items-center justify-between pt-6 pb-2 shrink-0">
        <button 
          onClick={() => navigate('/chapters')} 
          className="btn-zen !px-3 !py-3"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
              {language === 'el' ? 'Κεφάλαιο' : 'Chapter'} {chapter.num}
            </span>
            {CHAPTER_MICRO_CAT[chapter.num] && (
              <span className="text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/5 uppercase">
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
            <div className="flex-1 flex flex-col justify-start min-h-full pt-4 pb-40 text-center sm:text-left max-w-3xl mx-auto w-full">
            {curPage.type === 'intro' && (
              <div className="space-y-12">
                <div className="space-y-6 text-center">
                   <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-700 shadow-2xl"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-serif text-white/90 italic leading-tight tracking-tight px-4">
                    {chapter.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed italic px-6 font-serif">
                    {chapter.sub}
                  </p>
                </div>

                <div className="bg-[#12141c] border border-white/5 shape-cloud-2 p-10 md:p-14 space-y-8 relative overflow-hidden w-full text-left shadow-2xl">
                  <div className="absolute top-0 right-0 p-10 text-white/[0.03] -rotate-12 scale-125">
                    {chapter.icon}
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/60 uppercase">
                      {language === 'el' ? 'ΣΥΝΟΨΗ' : 'SUMMARY'}
                    </span>
                    <p className="text-2xl md:text-4xl text-white/90 font-serif italic leading-[1.3] tracking-tight">
                      {chapter.summary}
                    </p>
                  </div>
                  
                  {chapter.tldr && (
                    <div className="pt-8 border-t border-white/5 italic text-white/50 text-lg md:text-xl font-sans leading-relaxed">
                      «{chapter.tldr}»
                    </div>
                  )}
                </div>
              </div>
            )}

            {curPage.type === 'theory' && curPage.section && (
              <article className="space-y-10 md:space-y-14 text-left w-full">
                <header className="space-y-3">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/80 uppercase">
                    {language === 'el' ? 'ΘΕΩΡΙΑ' : 'THEORY'}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-serif text-white/90 italic leading-[1.1] tracking-tight">
                    {curPage.section.title}
                  </h2>
                </header>

                <div className="space-y-8 text-white/70 text-xl md:text-2xl font-serif leading-relaxed">
                  {curPage.section.paragraphs.map((par: string, p_idx: number) => (
                    <ExpandableParagraph key={p_idx} text={par} index={p_idx} language={language} />
                  ))}
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="pt-12 space-y-8"
                  >
                      {curPage.section.interactive && (
                        <InteractiveRenderer id={curPage.section.interactive} />
                      )}

                      {curPage.section.image && (
                        <img 
                          src={curPage.section.image} 
                          alt="" 
                          className="w-full shape-cloud-4 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000 shadow-2xl" 
                        />
                      )}

                      {/* Key Takeaways for this section or end of sections */}
                      <div className="bg-[#12141c] shape-cloud-5 p-8 border border-white/5 space-y-6 shadow-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400/80">
                            <Sparkles size={16} />
                          </div>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                            {language === 'el' ? 'ΒΑΣΙΚΑ ΣΗΜΕΙΑ' : 'KEY POINTS'}
                          </span>
                        </div>
                        <ul className="space-y-4">
                          {CHAPTER_TAKEAWAYS[currentLang][chapter.num]?.slice(0, 3).map((take, idx) => (
                            <li key={idx} className="flex gap-4 items-start text-base md:text-lg text-white/60 font-serif italic leading-relaxed">
                              <span className="text-teal-500/50 mt-1.5">•</span>
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
              <div className="space-y-16 text-left w-full">
                {chapter.exercise && (
                  <div className="bg-[#12141c] border border-white/5 shape-cloud-1 p-10 md:p-14 space-y-10 shadow-2xl">
                    <header className="space-y-5">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-[1.25rem] bg-teal-500/5 border border-teal-500/10 flex items-center justify-center text-teal-400/60">
                          <Zap size={24} />
                        </div>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-teal-400/80 uppercase">
                          {language === 'el' ? 'ΠΡΑΚΤΙΚΗ ΑΣΚΗΣΗ' : 'PRACTICE EXERCISE'}
                        </span>
                      </div>
                      <h2 className="text-4xl font-serif text-white/90 italic leading-tight tracking-tight">{chapter.exercise.title}</h2>
                    </header>
                    <ul className="space-y-8">
                      {chapter.exercise.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-8 items-start group">
                          <span className="w-10 h-10 rounded-[1rem] bg-white/[0.03] flex items-center justify-center text-[10px] font-bold text-white/40 group-hover:bg-white/10 group-hover:text-white/90 transition-all duration-700 shrink-0">
                            0{idx + 1}
                          </span>
                          <span className="text-xl md:text-2xl text-white/70 font-sans leading-relaxed group-hover:text-white/90 transition-colors">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {chapter.insight && (
                    <div className="bg-[#12141c] border border-white/5 shape-cloud-3 p-10 space-y-6 shadow-xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-[10px] font-bold text-teal-400/60 uppercase tracking-widest relative z-10 block">{language === 'el' ? 'ΕΠΙΓΝΩΣΗ' : 'INSIGHT'}</span>
                      <p className="text-xl md:text-2xl text-white/80 font-serif italic leading-relaxed relative z-10">"{chapter.insight}"</p>
                    </div>
                  )}
                  {chapter.reflection && (
                    <div className="bg-[#12141c] border border-white/5 shape-cloud-6 p-10 space-y-6 shadow-xl relative overflow-hidden group hover:border-yellow-500/20 transition-all">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/[0.02] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-[10px] font-bold text-yellow-500/50 uppercase tracking-widest relative z-10 block">{language === 'el' ? 'ΑΝΑΣΤΟΧΑΣΜΟΣ' : 'REFLECTION'}</span>
                      <p className="text-xl md:text-2xl text-white/80 font-sans font-light leading-relaxed relative z-10">{chapter.reflection}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 max-w-4xl mx-auto z-20 backdrop-blur-xl bg-[#0f1117]/80 border-t border-white/5">
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
            className="flex-[3] btn-zen bg-white !text-black hover:bg-white/90 flex justify-center items-center gap-3 !py-4"
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

