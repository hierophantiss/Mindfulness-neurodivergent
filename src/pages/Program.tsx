import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useProgress } from '../contexts/ProgressContext';
import { Skeleton } from '../components/ui/Skeleton';
import { D as courseDataEl } from '../data/course-el';
import { D as courseDataEn } from '../data/course-en';

export default function Program() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { companionData } = useCompanion();
  const { isLessonComplete } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

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
          <h2 className="text-5xl md:text-7xl font-serif text-white/90 italic leading-none tracking-tight">
            {language === 'en' ? 'The Path' : 'Η Διαδρομή'}
          </h2>
          <p className="text-lg text-white/50 font-sans max-w-xl mx-auto leading-relaxed">
            {language === 'en' 
              ? 'A 56-day structured journey to master awareness and emotional regulation.'
              : 'Μια δομημένη πορεία 56 ημερών για την εκμάθηση της επίγνωσης.'}
          </p>
        </div>
      </header>
      
      {/* Program Grid */}
      <div className="max-w-4xl mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 space-y-6">
                <div className="flex justify-between items-start">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-3 w-1/4 rounded" />
                  <Skeleton className="h-8 w-3/4 rounded-lg" />
                </div>
              </div>
            ))
          ) : (
            weeks.map((weekNum) => {
            const week = courseData[weekNum];
            const isCompleted = week.days.every((_, i) => isLessonComplete(weekNum, i + 1));
            const isCurrent = curW === weekNum;
            
            return (
              <Link 
                to={`/program/week/${weekNum}`} 
                key={weekNum} 
                className={cn(
                  "group relative p-8 bg-[#12141c] border border-white/5 transition-all duration-300 active:scale-[0.98] overflow-hidden hover:bg-white/[0.04]",
                  isCurrent && "border-teal-400/40 shadow-2xl bg-white/[0.02]",
                  isCompleted && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
                  `shape-cloud-${(weekNum % 5) + 1}`
                )}
              >
                <div className="flex flex-col gap-6 relative z-10 h-full">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-sans font-bold border transition-all duration-500",
                      isCurrent 
                        ? "bg-teal-400/20 text-teal-300 border-teal-400/30 shadow-[0_0_20px_rgba(45,212,191,0.2)]" 
                        : "bg-white/5 text-white/50 border-white/10 group-hover:bg-white/10 group-hover:text-white"
                    )}>
                      {isCompleted ? <CheckCircle2 size={24} /> : weekNum}
                    </div>
                    
                    <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest pt-2">
                      {isCurrent && curD > 0 
                        ? `${curD}/${week.days.length} ${language === 'en' ? 'DONE' : 'ΗΜΕΡΕΣ'}`
                        : `${week.days.length} ${language === 'en' ? 'DAYS' : 'ΗΜΕΡΕΣ'}`
                      }
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-teal-400 opacity-60 uppercase tracking-[0.2em]">
                      {language === 'en' ? 'Week' : 'Εβδομάδα'} {weekNum}
                    </span>
                    <h3 className={cn(
                      "text-2xl font-serif italic leading-tight transition-colors",
                      isCompleted ? "text-white/40" : "text-white/90"
                    )}>
                      {week.title}
                    </h3>
                  </div>

                  <div className="flex gap-1.5 opacity-80 mt-6 pt-4 border-t border-white/5 relative z-20">
                    {week.days.map((_, i) => {
                      const dayCompleted = isLessonComplete(weekNum, i + 1);

                      return (
                        <div 
                          key={i} 
                          title={`${language === 'en' ? 'Day' : 'Ημέρα'} ${i + 1}`}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-500",
                            dayCompleted ? "bg-teal-400/80 shadow-[0_0_8px_rgba(45,212,191,0.4)]" : "bg-white/10 group-hover:bg-white/20"
                          )} 
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 p-8 text-white/[0.02] group-hover:text-white/[0.05] transition-all duration-700 select-none pointer-events-none">
                   <span className="text-9xl font-serif font-black italic">W{weekNum}</span>
                </div>
              </Link>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
