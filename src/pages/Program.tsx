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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Editorial Header */}
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
              {language === 'en' ? '8 Weeks Program' : 'Πρόγραμμα 8 Εβδομάδων'}
            </span>
          </div>
          <h2 className="text-5xl md:text-7xl font-heading text-white italic leading-none tracking-tight">
            {language === 'en' ? 'The Path' : 'Η Διαδρομή'}
          </h2>
          <p className="text-lg text-pine-300 font-light max-w-xl mx-auto leading-relaxed italic">
            {language === 'en' 
              ? 'A 56-day structured journey to master awareness and emotional regulation.'
              : 'Μια δομημένη πορεία 56 ημερών για την εκμάθηση της επίγνωσης.'}
          </p>
        </div>
      </header>
      
      {/* Program Grid */}
      <div className="max-w-4xl mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weeks.map((weekNum) => {
            const week = courseData[weekNum];
            const isCompleted = curW > weekNum;
            const isCurrent = curW === weekNum;
            
            return (
              <Link 
                to={`/program/week/${weekNum}`} 
                key={weekNum} 
                className={cn(
                  "group relative p-8 rounded-[2.5rem] glass-card transition-all duration-500 overflow-hidden",
                  isCurrent && "border-teal-400/40 shadow-[0_0_30px_rgba(45,212,191,0.1)]",
                  isCompleted && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                )}
              >
                <div className="flex flex-col gap-6 relative z-10 h-full">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-heading font-bold border transition-all duration-500",
                      isCurrent 
                        ? "bg-teal-400/20 text-teal-300 border-teal-400/30 shadow-[0_0_20px_rgba(45,212,191,0.2)]" 
                        : "bg-white/5 text-pine-400 border-white/10 group-hover:bg-white/10 group-hover:text-white"
                    )}>
                      {isCompleted ? <CheckCircle2 size={24} /> : weekNum}
                    </div>
                    
                    <div className="text-[10px] font-bold text-pine-500 uppercase tracking-widest pt-2">
                      {isCurrent && curD > 0 
                        ? `${curD}/${week.days.length} ${language === 'en' ? 'DONE' : 'ΗΜΕΡΕΣ'}`
                        : `${week.days.length} ${language === 'en' ? 'DAYS' : 'ΗΜΕΡΕΣ'}`
                      }
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-teal-400 opacity-60 uppercase tracking-[0.2em]">
                      {language === 'en' ? 'Week' : 'Εβδομάδα'} {weekNum}
                    </span>
                    <h3 className={cn(
                      "text-2xl font-heading italic leading-tight transition-colors",
                      isCompleted ? "text-pine-400 font-light" : "text-white"
                    )}>
                      {week.title}
                    </h3>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 p-8 text-white/[0.02] group-hover:text-white/[0.05] transition-all duration-700 select-none pointer-events-none">
                   <span className="text-9xl font-heading font-black italic">W{weekNum}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
