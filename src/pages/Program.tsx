import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { D as courseDataEl } from '../data/course-el';
import { D as courseDataEn } from '../data/course-en';

export default function Program() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { companionData } = useCompanion();
  const courseData = language === 'en' ? courseDataEn : courseDataEl;
  const weeks = Object.keys(courseData).map(Number).sort((a, b) => a - b);
  
  const curW = companionData.programProgress?.week || 0;
  const curD = companionData.programProgress?.day || 0;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-safe mb-4">
      <div className="flex flex-col items-center justify-center text-center mb-10 pt-6 pb-2 z-20 relative">
        <button 
          onClick={() => navigate('/')} 
          className="absolute left-4 md:left-8 top-2 w-10 h-10 rounded-full bg-pine-800/40 border border-pine-700/50 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-all backdrop-blur-md"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-pine-700/60 to-pine-900/80 border border-pine-600/30 flex items-center justify-center text-teal-400 mb-5 shadow-[0_8px_16px_rgba(0,0,0,0.2)] backdrop-blur-md">
           <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-medium text-white tracking-tight drop-shadow-sm">
          {language === 'en' ? '8 Weeks Program' : 'Πρόγραμμα 8 Εβδομάδων'}
        </h2>
        <p className="text-pine-200/70 font-medium text-sm md:text-base mt-3 max-w-md mx-auto leading-relaxed">
          {language === 'en' 
            ? 'The "Learning to Ride the Wind" program. Follow the path step by step.'
            : 'Το πρόγραμμα "Μαθαίνοντας να Ιππεύεις τον Άνεμο". Ακολούθησε τη διαδρομή βήμα-βήμα.'}
        </p>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {weeks.map((weekNum) => {
            const week = courseData[weekNum];
            const isCompleted = curW > weekNum;
            const isCurrent = curW === weekNum;
            
            return (
              <Link 
                to={`/program/week/${weekNum}`} 
                key={weekNum} 
                className={`group relative hover:to-pine-800/90 border p-6 rounded-[2rem] flex items-center justify-between transition-all duration-500 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(20,184,166,0.1)] active:scale-[0.98] backdrop-blur-md ${
                  isCompleted ? 'bg-gradient-to-b from-pine-900/60 to-pine-950/80 border-pine-800/60' :
                  isCurrent ? 'bg-gradient-to-b from-pine-700/40 to-pine-800/80 border-teal-500/30 ring-1 ring-teal-500/20' :
                  'bg-gradient-to-b from-pine-800/40 to-pine-900/80 hover:from-pine-800/60 border-pine-700/50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto overflow-hidden pr-4 sm:pr-0">
                  <div className={`shrink-0 flex items-center justify-center shadow-inner group-hover:scale-105 transition-all outline outline-1 outline-white/5 duration-500 font-heading text-2xl font-medium backdrop-blur-md rounded-[1.25rem] w-16 h-16 ${
                     isCompleted ? 'bg-teal-950/50 text-teal-600/80' : 
                     isCurrent ? 'bg-teal-900/80 text-teal-300' :
                     'bg-pine-950/80 text-teal-400 group-hover:text-teal-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={28} /> : weekNum}
                  </div>
                  <div className="min-w-0 pr-2">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block mb-1 truncate ${
                      isCurrent ? 'text-teal-400 shadow-teal-500/20' : 'text-teal-500/80'
                    }`}>
                      {language === 'en' ? 'Week' : 'Εβδομάδα'} {weekNum}
                    </span>
                    <h3 className={`text-lg md:text-xl font-heading font-medium transition-colors truncate ${
                      isCompleted ? 'text-pine-400 line-through decoration-pine-500/30' :
                      isCurrent ? 'text-white' : 'text-pine-100 group-hover:text-white'
                    }`}>{week.title}</h3>
                  </div>
                </div>
                
                <div className="hidden sm:flex shrink-0 items-center justify-center text-pine-300/80 bg-pine-950/60 px-4 py-2 rounded-full text-xs font-medium shadow-inner ring-1 ring-white/5 backdrop-blur-sm relative z-10 group-hover:text-pine-200 transition-colors">
                  {isCurrent && curD > 0 
                    ? `${curD}/${week.days.length} ${language === 'en' ? 'done' : 'ημέρες'}`
                    : `${week.days.length} ${language === 'en' ? 'days' : 'ημέρες'}`
                  }
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  );
}
