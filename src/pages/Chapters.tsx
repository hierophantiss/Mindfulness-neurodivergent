import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Layers, Star } from 'lucide-react';
import { MeditatorFigure } from '../components/MeditatorFigure';
import { axisOfChapter } from '../lib/axisOfChapter';
import { ChapterIcon } from '../components/ChapterIcon';
import { CHAPTERS_DATA } from '../data/chapters';
import { useLanguage } from '../hooks/useLanguage';
import { useProgress } from '../contexts/ProgressContext';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import { Check } from 'lucide-react';
import { OfflineAudioCard } from '../components/OfflineAudioCard';

export default function Chapters() {
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
  // The book's own shape: Part 1 (the four axes), Part 2 (in life), and the background.
  const applicationChapters = chapters.filter(c => c.num >= 5 && c.num <= 10);
  const depthChapters = chapters.filter(c => c.num >= 11);

  return (
    <div className="flex flex-col relative w-full min-h-full pt-2">
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 max-w-5xl mx-auto w-full">
        
        <PageHeader
          back="/dashboard"
          eyebrow={language === 'en' ? 'Presence Workbook' : 'Εγχειρίδιο Παρουσίας'}
          title={language === 'en' ? 'The book' : 'Το βιβλίο'}
          lead={
            <>
              {language === 'el' ? 'Μαθαίνοντας να ιππεύεις τον άνεμο. Ένας οδηγός για την επίγνωση.' : 'Learning to ride the wind. A guide to awareness.'}{' '}
              <Link to="/rabbithole" state={{ activeArticle: 'riding-the-wind' }} className="inline-flex align-[-3px] text-teal-400 hover:text-teal-300 transition-colors" aria-label={language === 'en' ? 'Read in the Rabbit Hole' : 'Διάβασέ το στην Κουνελότρυπα'}>
                <Star size={17} className="fill-current" aria-hidden="true" />
              </Link>
            </>
          }
        />

        {/* The book's four summaries, one tap away. */}
        <Link to="/cards" className="glass flex items-center gap-3.5 min-h-[68px] rounded-[22px] px-4 py-3 hover:brightness-110 active:scale-[0.99] transition-[filter,transform]">
          <span aria-hidden="true" className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08] text-sign-gold">
            <Layers size={19} />
          </span>
          <span className="flex-1 min-w-0 flex flex-col gap-0.5">
            <span className="text-[15px] leading-snug text-ink">{language === 'el' ? 'Κάρτες' : 'Cards'}</span>
            <span className="text-[13px] leading-snug text-ink/70">{language === 'el' ? 'Οι τέσσερις περιλήψεις του βιβλίου, για τη στιγμή που τις χρειάζεσαι' : 'The book\'s four summaries, for the moment you need them'}</span>
          </span>
          <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-ink/55" />
        </Link>

        {/* Section 1: The Quadruple Axis - Atmospheric Cards */}
        <div id="basis" className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-white/10"></span>
            <h2 className="text-[13px] font-medium text-ink/70">
              {language === 'el' ? 'Μέρος 1 · Ο Πυρήνας της Μεθόδου' : 'Part 1 · The Core of the Method'}
            </h2>
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
"group relative flex flex-col justify-end min-h-[300px] glass-card p-8 transition-all duration-300 active:scale-[0.98] hover:border-white/10 ",
                  `shape-cloud-${(chapter.num % 5) + 1}`
                )}
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle at 70% 30%, ${chapter.hex}, transparent 80%)` }}
                />
                
                <div className="relative z-10 space-y-4">
                   <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-[26px] leading-none backdrop-blur-md border border-white/10 relative"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    <ChapterIcon num={chapter.num} color={chapter.hex} size={23} />
                    {isChapterComplete(chapter.num) && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-ink border-2 border-[#12141c] animate-in zoom-in-50 duration-300">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-display text-3xl text-ink/90 group-hover:text-ink transition-colors">{chapter.title}</h2>
                    <p className="text-sm text-ink/65 font-sans mt-2 line-clamp-2">{chapter.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-[12px] font-medium px-3 py-1 rounded-full border"
                      style={{ borderColor: `${chapter.hex}40`, color: chapter.hex, backgroundColor: `${chapter.hex}10` }}
                    >
                      {chapter.tag}
                    </span>
                  </div>
                </div>

                {/* The meditator with this chapter's axis lit, as on the home page. */}
                {axisOfChapter(chapter.num) && (
                  <span aria-hidden="true" className="absolute top-4 right-4 w-[118px] desk:w-[136px] opacity-90 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(closest-side, ${chapter.hex}4d, transparent)` }}>
                    <MeditatorFigure focus={axisOfChapter(chapter.num)!} bare small />
                  </span>
                )}
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
              <h2 className="text-[13px] font-medium text-ink/70">
                {language === 'el' ? 'Μέρος 2 · Εφαρμογές και Μετασχηματισμός' : 'Part 2 · Applications and Transformation'}
              </h2>
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
 className="group flex items-center gap-6 p-4 shape-cloud-6 glass-card active:scale-[0.98] transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm transition-transform group-hover:scale-110 relative"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    <ChapterIcon num={chapter.num} color={chapter.hex} />
                    {isChapterComplete(chapter.num) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center text-ink border border-[#12141c]">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-light text-ink/90 leading-tight group-hover:translate-x-1 transition-transform">{chapter.title}</h2>
                    <p className="text-[13px] text-ink/65 mt-1">{chapter.sub}</p>
                  </div>
                </Link>
              )))}
            </div>
          </div>

          {/* Depth */}
          <div id="depth" className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/10"></span>
              <h2 className="text-[13px] font-medium text-ink/70">
                {language === 'el' ? 'Το Υπόβαθρο' : 'The Background'}
              </h2>
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
 className="group flex items-center gap-6 p-4 shape-cloud-6 glass-card active:scale-[0.98] transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm transition-transform group-hover:scale-110 relative"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    <ChapterIcon num={chapter.num} color={chapter.hex} />
                    {isChapterComplete(chapter.num) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center text-ink border border-[#12141c]">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-light text-ink/90 leading-tight group-hover:translate-x-1 transition-transform">{chapter.title}</h2>
                    <p className="text-[13px] text-ink/65 mt-1">{chapter.sub}</p>
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
 className="relative flex flex-col items-center justify-center text-center p-12 md:p-20 shape-cloud-3 glass-card border-teal-500/20 active:scale-[0.98] hover:border-teal-400/40 transition-all duration-500"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-8 border border-teal-500/20 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(95,143,214,0.3)] transition-all duration-700">
               <BookOpen size={28} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-ink/90 mb-5 leading-tight">
              {language === 'el' ? 'Πρόγραμμα 8 Εβδομάδων' : '8 Weeks Program'}
            </h2>
            <p className="text-lg text-ink/70 font-sans max-w-md leading-relaxed">
              {language === 'el' 
                ? 'Μια δομημένη πρακτική πορεία για την ενσωμάτωση της επίγνωσης στην καθημερινότητα.' 
                : 'A structured practical path to integrate awareness into daily life.'}
            </p>
          </Link>
        </div>

        {/* For listening without a connection: after the chapters, not before them. */}
        <div className="max-w-xl mx-auto w-full">
          <OfflineAudioCard lang={currentLang} />
        </div>

      </div>
    </div>
  );
}

