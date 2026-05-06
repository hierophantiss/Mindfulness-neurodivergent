import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-safe mb-4">
      <div className="flex flex-col items-center justify-center text-center mb-6 sticky top-0 bg-pine-900/80 backdrop-blur-md pt-4 pb-2 z-20 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-pine-800/50">
        <button 
          onClick={() => navigate('/')} 
          className="absolute left-4 md:left-8 w-10 h-10 rounded-full bg-pine-800/50 border border-pine-700 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-12 h-12 rounded-full bg-pine-800 border border-pine-700 flex items-center justify-center text-pine-300 mb-2">
           <BookOpen size={24} />
        </div>
        <h2 className="text-2xl font-semibold text-white tracking-wide">
          {language === 'en' ? 'Theory & Practice' : 'Θεωρία & Πρακτική'}
        </h2>
      </div>

      <div className="w-full lg:max-w-5xl mx-auto">
        {/* Section 1: The Quadruple Axis */}
        <div className="mb-12 mt-2">
          <div className="text-center mb-6">
            <h3 className="text-sm font-bold text-pine-400 tracking-[0.2em] uppercase mb-1">
              {language === 'el' ? 'Ο Τετραπλος Αξονας' : 'The Quadruple Axis'}
            </h3>
            <p className="text-pine-200/80 font-medium text-sm">
              {language === 'el' ? 'Η βάση. Ξεκίνα από εδώ.' : 'The foundation. Start here.'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {basisChapters.map(chapter => (
              <Link 
                to={`/chapters/${chapter.num}`}
                key={chapter.num} 
                className="group relative bg-gradient-to-b from-pine-800/60 to-pine-900/90 border border-t-pine-600/40 border-x-pine-700/40 border-b-pine-900/80 p-5 md:p-6 rounded-[2rem] flex flex-col justify-center items-center transition-all duration-500 overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_rgba(0,0,0,0.3)] active:scale-[0.98] min-h-[170px]"
              >
                {/* Background Subtle Gradient Glow */}
                <div 
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 rounded-[2rem]"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${chapter.hex}, transparent 60%)` }}
                />
                
                {/* The Image as an Icon container */}
                <div className="relative z-10 mb-4 transform group-hover:-translate-y-1 transition-transform duration-500">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] shadow-[0_8px_16px_rgba(0,0,0,0.4)] border-2 border-white/10 overflow-hidden relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(/chap${chapter.num}.${chapter.num === 2 ? 'png' : 'jpg'})` }}
                    />
                    <div className="absolute inset-0 bg-pine-950/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  
                  {/* Emoji Badge */}
                  <div 
                    className="absolute -bottom-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-pine-800 bg-pine-900 flex items-center justify-center text-xs md:text-sm shadow-lg overflow-hidden"
                  >
                    {chapter.icon}
                  </div>
                </div>

                <div className="relative z-10 text-center flex flex-col items-center">
                  <h3 className="text-[17px] md:text-xl font-semibold text-white mb-1.5 leading-tight tracking-wide drop-shadow-sm">{chapter.title}</h3>
                  <span 
                    className="inline-block px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-wider backdrop-blur-md border border-white/5"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    «{chapter.tag}»
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 2: Application */}
        <div className="mb-12">
          <div className="mb-4 pl-3 border-l-2 border-pine-500">
            <h3 className="text-lg font-semibold text-white leading-tight">
              {language === 'el' ? 'Πώς τα χρησιμοποιείς στη ζωή σου' : 'How to use them in your life'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {applicationChapters.map((chapter) => (
              <Link 
                to={`/chapters/${chapter.num}`}
                key={chapter.num} 
                className="group relative bg-pine-800/80 hover:bg-pine-700 border border-t-pine-600/50 border-x-pine-700/50 border-b-pine-800/50 p-4 rounded-3xl flex items-center transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 w-full relative z-10">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm border border-white/5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest block opacity-80 mb-0.5" style={{ color: chapter.hex }}>
                      {language === 'en' ? 'Chapter' : 'Κεφάλαιο'} {chapter.num}
                    </span>
                    <h3 className="text-base font-medium text-white mb-0.5 leading-tight">{chapter.title}</h3>
                    <p className="text-xs text-pine-300/80 line-clamp-1">{chapter.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 3: Synthesis / Practice */}
        <div className="mb-8">
          <div className="mb-4 pl-3 border-l-2 border-pine-500">
            <h3 className="text-lg font-semibold text-white leading-tight">
              {language === 'el' ? 'Σύνθεση / Πρακτική / Επιστήμη' : 'Synthesis / Practice / Science'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {depthChapters.map((chapter) => (
              <Link 
                to={`/chapters/${chapter.num}`}
                key={chapter.num} 
                className="group relative bg-pine-800/80 hover:bg-pine-700 border border-t-pine-600/50 border-x-pine-700/50 border-b-pine-800/50 p-4 rounded-3xl flex items-center transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 w-full relative z-10">
                   <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 backdrop-blur-sm border border-white/5 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${chapter.hex}25`, color: chapter.hex }}
                  >
                    {chapter.icon}
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest block opacity-80 mb-0.5" style={{ color: chapter.hex }}>
                      {language === 'en' ? 'Chapter' : 'Κεφάλαιο'} {chapter.num}
                    </span>
                    <h3 className="text-base font-medium text-white mb-0.5 leading-tight">{chapter.title}</h3>
                    <p className="text-xs text-pine-300/80 line-clamp-1">{chapter.sub}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 4: 8 Week Program */}
        <div className="mb-8 mt-12 relative">
          <div className="absolute inset-0 bg-teal-500/10 rounded-[2rem] blur-xl"></div>
          <Link
            to="/program"
            className="group relative bg-gradient-to-br from-pine-800/90 to-pine-900/90 hover:from-pine-700/90 hover:to-pine-800/90 border border-pine-500/30 p-6 md:p-8 rounded-[2rem] flex flex-col items-center justify-center text-center transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl hover:border-teal-500/50 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.05] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:bg-teal-500/30 ring-1 ring-teal-500/50 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2 tracking-wide">
              {language === 'el' ? 'Πρόγραμμα 8 Εβδομάδων' : '8 Weeks Program'}
            </h3>
            <p className="text-pine-200/80 text-sm max-w-[280px] leading-relaxed">
              {language === 'el' 
                ? 'Μαθαίνοντας να ιππεύεις τον άνεμο. Μια δομημένη πρακτική πορεία 8 εβδομάδων.' 
                : 'Learning to ride the wind. A 8-week structured practical journey.'}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

