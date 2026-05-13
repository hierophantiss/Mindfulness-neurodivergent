import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Mountain, Wind, Target, Maximize } from 'lucide-react';
import { CHAPTERS_DATA } from '../data/chapters';
import { useLanguage } from '../hooks/useLanguage';

export default function Chapters() {
  const navigate = useNavigate();
  const { language } = useLanguage();
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
            <h2 className="text-5xl md:text-7xl font-heading text-white italic leading-none tracking-tight">
              {language === 'en' ? 'The Library' : 'Η Βιβλιοθήκη'}
            </h2>
            <p className="text-lg text-pine-300 font-light max-w-xl mx-auto leading-relaxed">
              {language === 'el' ? 'Μαθαίνοντας να ιππεύεις τον άνεμο. Ένας οδηγός για την επίγνωση.' : 'Learning to ride the wind. A guide to awareness.'}
            </p>
          </div>
        </header>

        {/* Section 1: The Quadruple Axis - Atmospheric Cards */}
        <div id="basis" className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="w-12 h-[1px] bg-white/10"></span>
            <h3 className="text-[11px] font-bold text-pine-400 tracking-[0.3em] uppercase">
              {language === 'el' ? 'Ο Τετραπλος Αξονας' : 'The Quadruple Axis'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {basisChapters.map(chapter => (
              <Link 
                to={`/chapters/${chapter.num}`}
                key={chapter.num} 
                className="group relative flex flex-col justify-end min-h-[300px] overflow-hidden rounded-[2.5rem] glass-card p-8 transition-all duration-700 hover:border-white/20"
              >
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle at 70% 30%, ${chapter.hex}, transparent 80%)` }}
                />
                
                <div className="relative z-10 space-y-4">
                   <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/10"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <div>
                    <h3 className="text-3xl font-heading text-white italic group-hover:text-white/90 transition-colors">{chapter.title}</h3>
                    <p className="text-sm text-pine-300 font-light mt-1 drop-shadow-sm">{chapter.sub}</p>
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
            ))}
          </div>
        </div>

        {/* Section 2 & 3 Combined Refine */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Application */}
          <div id="application" className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/10"></span>
              <h3 className="text-[11px] font-bold text-pine-400 tracking-[0.3em] uppercase">
                {language === 'el' ? 'Εφαρμογη' : 'Application'}
              </h3>
            </div>
            <div className="space-y-4">
              {applicationChapters.map((chapter) => (
                <Link 
                  to={`/chapters/${chapter.num}`}
                  key={chapter.num} 
                  className="group flex items-center gap-6 p-4 rounded-[1.5rem] glass-card border-none hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading text-white italic leading-tight group-hover:translate-x-1 transition-transform">{chapter.title}</h3>
                    <p className="text-xs text-pine-400 mt-0.5">{chapter.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Depth */}
          <div id="depth" className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-12 h-[1px] bg-white/10"></span>
              <h3 className="text-[11px] font-bold text-pine-400 tracking-[0.3em] uppercase">
                {language === 'el' ? 'Συνθεση' : 'Depth'}
              </h3>
            </div>
            <div className="space-y-4">
              {depthChapters.map((chapter) => (
                <Link 
                  to={`/chapters/${chapter.num}`}
                  key={chapter.num} 
                  className="group flex items-center gap-6 p-4 rounded-[1.5rem] glass-card border-none hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-heading text-white italic leading-tight group-hover:translate-x-1 transition-transform">{chapter.title}</h3>
                    <p className="text-xs text-pine-400 mt-0.5">{chapter.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: 8 Week Program - Epic Style */}
        <div id="program" className="relative group">
          <div className="absolute inset-0 bg-teal-500/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <Link
            to="/program"
            className="relative flex flex-col items-center justify-center text-center p-12 md:p-20 rounded-[3rem] glass-card border-teal-500/10 hover:border-teal-500/30 transition-all duration-700"
          >
            <div className="w-16 h-16 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mb-8 border border-teal-500/20 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] transition-all duration-700">
               <BookOpen size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl md:text-5xl font-heading text-white italic mb-4 leading-tight">
              {language === 'el' ? 'Πρόγραμμα 8 Εβδομάδων' : '8 Weeks Program'}
            </h3>
            <p className="text-lg text-pine-300 font-light max-w-md leading-relaxed">
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

