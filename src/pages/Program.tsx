import { PageHeader } from '../components/PageHeader';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { useProgress } from '../contexts/ProgressContext';
import { Skeleton } from '../components/ui/Skeleton';
import { COURSE_EL as courseDataEl } from '../data/course-el';
import { COURSE_EN as courseDataEn } from '../data/course-en';

export default function Program() {
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
  
  const curW = companionData.programProgress?.week || 1;
  const curD = companionData.programProgress?.day || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <PageHeader
        back="/dashboard"
        eyebrow={language === 'en' ? '8 Weeks Program' : 'Πρόγραμμα 8 Εβδομάδων'}
        title={language === 'en' ? 'The Path' : 'Η Διαδρομή'}
        lead={language === 'en' ? 'Eight weeks, one small step a day, at your own pace.' : 'Οκτώ εβδομάδες, ένα μικρό βήμα τη μέρα, με τον δικό σου ρυθμό.'}
      />
      
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
            const isCompleted = week.days.every((_: unknown, i: number) => isLessonComplete(weekNum, i + 1));
            const isCurrent = curW === weekNum;
            const isLocked = weekNum > curW;
            
            const CardElement = (isLocked ? 'div' : Link) as any;
            
            return (
              <CardElement 
                {...(isLocked ? {} : { to: `/program/week/${weekNum}` })}
                key={weekNum} 
                className={cn(
                  "group relative p-8 transition-all duration-300",
                  isLocked ? "glass-card opacity-75 grayscale cursor-not-allowed border-white/5 " : "glass-card active:scale-[0.98] ",
                  isCurrent && "border-teal-400/40 shadow-[0_0_30px_rgba(127,169,228,0.1)] bg-white/[0.03]",
                  isCompleted && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
                  `shape-cloud-${(weekNum % 5) + 1}`
                )}
              >
                <div className="flex flex-col gap-6 relative z-10 h-full">
                  <div className="flex justify-between items-start">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-sans font-bold border transition-all duration-500",
                      isLocked ? "bg-white/5 text-ink/70 border-white/5" :
                      isCurrent 
                        ? "bg-teal-400/20 text-teal-300 border-teal-400/30 shadow-[0_0_20px_rgba(127,169,228,0.2)]" 
                        : "bg-white/5 text-ink/70 border-white/10 group-hover:bg-white/10 group-hover:text-ink"
                    )}>
                      {isCompleted ? <CheckCircle2 size={24} /> : weekNum}
                    </div>
                    
                    <div className="text-[13px] font-medium text-ink/65 pt-2">
                       {isLocked ? (language === 'en' ? 'Opens later' : 'Ανοίγει αργότερα') :
                        isCurrent && curD > 0 
                        ? `${curD}/${week.days.length} ${language === 'en' ? 'done' : 'ημέρες'}`
                        : `${week.days.length} ${language === 'en' ? 'days' : 'ημέρες'}`
                      }
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[13px] font-medium text-teal-300">
                      {language === 'en' ? 'Week' : 'Εβδομάδα'} {weekNum}
                    </span>
                    <h2 className={cn(
                      "text-2xl font-light leading-tight transition-colors",
                      isCompleted ? "text-ink/70" : (isLocked ? "text-ink/70" : "text-ink/90")
                    )}>
                      {week.title}
                    </h2>
                  </div>

                  <div className="flex gap-1.5 opacity-80 mt-6 pt-4 border-t border-white/5 relative z-20">
                    {week.days.map((_: unknown, i: number) => {
                      const dayCompleted = isLessonComplete(weekNum, i + 1);

                      return (
                        <div 
                          key={i} 
                          title={`${language === 'en' ? 'Day' : 'Ημέρα'} ${i + 1}`}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-500",
                            dayCompleted ? "bg-teal-400/80 shadow-[0_0_8px_rgba(127,169,228,0.4)]" : "bg-white/10"
                          )} 
                        />
                      );
                    })}
                  </div>
                </div>

                <div aria-hidden="true" className="absolute -bottom-4 -right-4 p-8 text-ink/[0.02] transition-all duration-700 select-none pointer-events-none">
                   <span className="text-9xl font-black">W{weekNum}</span>
                </div>
              </CardElement>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
