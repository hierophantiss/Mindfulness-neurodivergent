import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Mountain, Wind, Target, Maximize } from 'lucide-react';
import { CHAPTERS_DATA } from '../data/chapters';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';

export default function Chapters() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isChapterComplete } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const currentLang = language === 'en' && CHAPTERS_DATA['en'] ? 'en' : 'el';
  const chapters = CHAPTERS_DATA[currentLang] || [];

  const basisChapters = chapters.filter(c => c.num >= 1 && c.num <= 4);
  const applicationChapters = chapters.filter(c => c.num >= 5 && c.num <= 7);
  const depthChapters = chapters.filter(c => c.num >= 8 && c.num <= 10);

  return (
    <div className="flex flex-col relative w-full min-h-full pt-8">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 px-6 max-w-5xl mx-auto w-full">
        
        {/* Header - Editorial Style */}
        <header className="flex flex-col items-center text-center space-y-6 relative">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn-zen absolute left-0 top-0 !px-3 !py-3 hidden md:flex"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase">
                {language === 'en' ? 'Theory & Practice' : 'Θεωρία & Πρακτική'}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-sans text-white italic leading-none tracking-tight">
              {language === 'en' ? 'Presence Workbook' : 'Εγχειρίδιο Παρουσίας'}
            </h2>
            <p className="text-lg text-white/50 font-serif italic max-w-xl mx-auto leading-relaxed mt-2 flex items-center justify-center gap-2">
              {language === 'el' ? 'Μαθαίνοντας να ιππεύεις τον άνεμο. Ένας οδηγός για την επίγνωση.' : 'Learning to ride the wind. A guide to awareness.'}
              <Link to="/rabbithole" state={{ activeArticle: 'riding-the-wind' }} className="text-teal-400 hover:text-teal-300 transition-colors inline-flex mt-1" title={language === 'en' ? 'Read in Rabbit Hole' : 'Διαβάστε στην Κουνελότρυπα'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star fill-current" ><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
              </Link>
            </p>
          </div>
        </header>

        {/* Section 1: The Quadruple Axis - Atmospheric Cards */}
        <div id="basis" className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-white/10"></span>
            <h3 className="text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase">
              {language === 'el' ? 'Ο Τετραπλος Αξονας' : 'The Quadruple Axis'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="min-h-[300px] shape-cloud-1 bg-white/[0.01] border border-white/5 p-8 flex flex-col justify-end space-y-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))
            ) : (
              basisChapters.map(chapter => (
              <Link 
                to={`/chapters/${chapter.num}`}
                key={chapter.num} 
                className={cn(
"group relative flex flex-col justify-end min-h-[300px] glass-card p-8 transition-all duration-300 active:scale-[0.98] hover:border-white/10 hover:bg-white/[0.02]",
                  `shape-cloud-${(chapter.num % 5) + 1}`
                )}
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle at 70% 30%, ${chapter.hex}, transparent 80%)` }}
                />
                
                <div className="relative z-10 space-y-4">
                   <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/10 relative"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                    {isChapterComplete(chapter.num) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-white border-2 border-[#12141c] animate-in zoom-in-50 duration-300">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl font-heading text-white/90 italic group-hover:text-white transition-colors">{chapter.title}</h3>
                    <p className="text-sm text-white/50 font-sans mt-2 drop-shadow-sm line-clamp-2">{chapter.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
                      style={{ borderColor: `${chapter.hex}40`, color: chapter.hex, backgroundColor: `${chapter.hex}10` }}
                    >
                      {chapter.tag}
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform duration-1000">
                  {chapter.num === 1 && <Mountain size={140} strokeWidth={0.5} />}
                  {chapter.num === 2 && <Wind size={140} strokeWidth={0.5} />}
                  {chapter.num === 3 && <Target size={140} strokeWidth={0.5} />}
                  {chapter.num === 4 && <Maximize size={140} strokeWidth={0.5} />}
                </div>
              </Link>
            )))}
          </div>
        </div>

        {/* Section 2 & 3 Combined Refine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Application */}
          <div id="application" className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/10"></span>
              <h3 className="text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase">
                {language === 'el' ? 'Εφαρμογη' : 'Application'}
              </h3>
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-white/[0.01] border border-white/5">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/2 rounded" />
                      <Skeleton className="h-3 w-1/4 rounded" />
                    </div>
                  </div>
                ))
              ) : (
                applicationChapters.map((chapter) => (
                <Link 
                  to={`/chapters/${chapter.num}`}
                  key={chapter.num} 
 className="group flex items-center gap-6 p-4 shape-cloud-6 glass-card active:scale-[0.98] hover: hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm transition-transform group-hover:scale-110 relative"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                    {isChapterComplete(chapter.num) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center text-white border border-[#12141c]">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-white/90 italic leading-tight group-hover:translate-x-1 transition-transform">{chapter.title}</h3>
                    <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider font-bold">{chapter.sub}</p>
                  </div>
                </Link>
              )))}
            </div>
          </div>

          {/* Depth */}
          <div id="depth" className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/10"></span>
              <h3 className="text-[11px] font-bold text-white/40 tracking-[0.3em] uppercase">
                {language === 'el' ? 'Συνθεση' : 'Depth'}
              </h3>
            </div>
            <div className="space-y-4">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-[1.5rem] bg-white/[0.01] border border-white/5">
                    <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/2 rounded" />
                      <Skeleton className="h-3 w-1/4 rounded" />
                    </div>
                  </div>
                ))
              ) : (
                depthChapters.map((chapter) => (
                <Link 
                  to={`/chapters/${chapter.num}`}
                  key={chapter.num} 
 className="group flex items-center gap-6 p-4 shape-cloud-6 glass-card active:scale-[0.98] hover: hover:bg-white/[0.03] transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm transition-transform group-hover:scale-110 relative"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                    {isChapterComplete(chapter.num) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center text-white border border-[#12141c]">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-white/90 italic leading-tight group-hover:translate-x-1 transition-transform">{chapter.title}</h3>
                    <p className="text-[11px] text-white/40 mt-1 uppercase tracking-wider font-bold">{chapter.sub}</p>
                  </div>
                </Link>
              )))}
            </div>
          </div>
        </div>

        {/* Section 4: 8 Week Program - Epic Style */}
        <div id="program" className="relative group">
          <div className="absolute inset-0 bg-teal-500/10 shape-cloud-3 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <Link
            to="/program"
 className="relative flex flex-col items-center justify-center text-center p-12 md:p-20 shape-cloud-3 glass-card/80 border-teal-500/20 active:scale-[0.98] hover:border-teal-400/40 hover:bg-white/[0.02] transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-8 border border-teal-500/20 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all duration-700">
               <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-white/90 italic mb-5 leading-tight">
              {language === 'el' ? 'Πρόγραμμα 8 Εβδομάδων' : '8 Weeks Program'}
            </h3>
            <p className="text-lg text-white/50 font-sans max-w-md leading-relaxed">
              {language === 'el' 
                ? 'Μια δομημένη πρακτική πορεία για την ενσωμάτωση της επίγνωσης στην καθημερινότητα.' 
                : 'A structured practical journey to integrate awareness into daily life.'}
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
}

