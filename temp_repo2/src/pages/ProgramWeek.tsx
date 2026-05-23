import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { D as courseDataEl } from '../data/course-el';
import { D as courseDataEn } from '../data/course-en';
import { ArrowLeft, Check, PlayCircle, Clock, MapPin, ChevronLeft, ChevronRight, Wind, BookOpen, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CameraAnimation from '../components/CameraAnimation';
import SamathaAnimation from '../components/SamathaAnimation';
import { playSound } from '../lib/soundEffects';
import { useReward } from '../contexts/RewardContext';
import { useProgress } from '../contexts/ProgressContext';

export default function ProgramWeek() {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { companionData, updateCompanionData } = useCompanion();
  const { triggerReward } = useReward();
  const { isLessonComplete, markLessonComplete } = useProgress();
  
  const courseData = language === 'en' ? courseDataEn : courseDataEl;
  const weekNum = Number(weekId);
  const week = courseData[weekNum];
  
  const [activeDay, setActiveDay] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef(0);

  // Default activeDay to what the companion has IF it's on this week
  useEffect(() => {
    if (companionData.programProgress?.week === weekNum) {
      setActiveDay(Math.min(companionData.programProgress?.day || 0, week?.days?.length - 1 || 0));
      setActiveStep(0);
    }
  }, [weekNum]);

  useEffect(() => {
    setActiveStep(0);
  }, [activeDay]);

  if (!week) {
    return <div className="p-8 text-center text-white/40">
      {language === 'en' ? 'Week not found.' : 'Εβδομάδα δεν βρέθηκε.'}
    </div>;
  }

  const currentDayContent = week.days[activeDay];
  
  const hasCameraAnchor = currentDayContent.lesson?.includes('Animation Camera') || currentDayContent.lesson?.includes('Οπτική Άγκυρα') || currentDayContent.title?.includes('Άγκυρα');
  const hasCameraZoom = currentDayContent.lesson?.includes('Camera Animation') || currentDayContent.title?.includes('Κλειστή και Ανοιχτή');
  const hasSamatha = currentDayContent.lesson?.includes('Samatha Animation') || currentDayContent.title?.includes('Samatha') || currentDayContent.lesson?.includes('Samatha');

  const daySteps: Array<{ id: string; labelEn: string; labelEl: string; icon: any }> = [];
  if (currentDayContent.lesson) daySteps.push({ id: 'lesson', labelEn: 'Lesson', labelEl: 'Μάθημα', icon: BookOpen });
  if (currentDayContent.exercise) daySteps.push({ id: 'exercise', labelEn: 'Exercise', labelEl: 'Άσκηση', icon: PlayCircle });
  if (currentDayContent.breathing) daySteps.push({ id: 'breathing', labelEn: 'Breathing', labelEl: 'Αναπνοή', icon: Wind });
  if (currentDayContent.insight || currentDayContent.reflection) daySteps.push({ id: 'insight', labelEn: 'Reflection', labelEl: 'Αναστοχασμός', icon: Lightbulb });

  const currentStepData = daySteps[activeStep];

  const goNextStep = () => {
    if (activeStep < daySteps.length - 1) {
      setDirection(1);
      setActiveStep(s => s + 1);
    } else {
      handleComplete();
    }
  };

  const goPrevStep = () => {
    if (activeStep > 0) {
      setDirection(-1);
      setActiveStep(s => s - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 40) goNextStep();
    else if (diff < -40) goPrevStep();
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? 50 : -50, opacity: 0 })
  };

  const isCompleted = isLessonComplete(weekNum, activeDay + 1);

  const handleComplete = () => {
    // Play complete sound and show reward
    if (!isCompleted) {
      playSound('complete');
      triggerReward('program');
      markLessonComplete(weekNum, activeDay + 1);
    }
    
    // Advance companion data progress if needed
    const curW = companionData.programProgress?.week || 0;
    const curD = companionData.programProgress?.day || 0;
    const isCompanionBehind = weekNum > curW || (weekNum === curW && activeDay >= curD);

    if (isCompanionBehind) {
      let nextW = weekNum;
      let nextD = activeDay + 1;
      if (nextD >= week.days.length) {
        nextW = weekNum + 1;
        nextD = 0;
      }
      updateCompanionData({
        programProgress: {
          week: nextW,
          day: nextD,
          lastVisit: new Date().toISOString()
        }
      });
      
      // Auto move to next day or back to program if week finished
      if (nextD === 0) {
        setTimeout(() => navigate('/program'), 800);
      } else {
        setTimeout(() => setActiveDay(nextD), 800);
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-safe mb-4">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/program')} 
          className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-[0.98] backdrop-blur-md"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="mb-8">
        <span className="text-teal-500/80 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">
          {language === 'en' ? 'Week' : 'Εβδομάδα'} {weekNum}
        </span>
        <h2 className="text-3xl md:text-4xl font-serif text-white tracking-tight mb-8 drop-shadow-sm italic">{week.title}</h2>
        
        {/* Days Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x hide-scrollbar px-1">
          {week.days.map((day: any, idx: number) => {
             const dayCompleted = isLessonComplete(weekNum, idx + 1);
             const curW = companionData.programProgress?.week || 1;
             const curD = companionData.programProgress?.day || 0;
             const isLocked = weekNum > curW || (weekNum === curW && idx > curD);

             return (
              <button
                key={idx}
                onClick={() => {
                  if (!isLocked) setActiveDay(idx);
                }}
                disabled={isLocked}
                className={`snap-start shrink-0 flex flex-col items-start p-5 rounded-2xl border transition-all duration-300 active:scale-[0.98] ${
                  isLocked ? 'glass-card opacity-50 grayscale cursor-not-allowed min-w-[180px]' :
                  activeDay === idx 
                    ? 'bg-teal-500/10 border-teal-500/30 text-white min-w-[220px] shadow-sm ring-1 ring-teal-500/20' 
                    : 'glass-card text-white/50 hover:bg-white/[0.04] min-w-[180px] '
                }`}
              >
                <div className="w-full flex justify-between items-center mb-2">
                  <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeDay === idx ? 'text-teal-400 drop-shadow-sm' : 'text-white/30'}`}>
                    {language === 'en' ? 'Day' : 'Ημερα'} {idx + 1}
                  </div>
                  {isLocked ? (
                    <div className="w-4 h-4 rounded-full bg-white/10 text-white/40 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                  ) : dayCompleted && (
                    <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <h4 className={`font-serif text-lg leading-tight text-left ${activeDay === idx ? 'text-white drop-shadow-sm' : 'text-white/60'}`}>
                  {isLocked ? (language === 'en' ? 'Locked' : 'Κλειδωμένο') : day.title}
                </h4>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Day Content Progressive View */}
      <div 
 className="glass-card rounded-[2rem] p-6 md:p-10 flex flex-col relative min-h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-wrap gap-3 mb-6 text-xs text-white/60 font-medium">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md/60 px-4 py-2 rounded-full border border-white/5 shadow-inner backdrop-blur-sm">
            <Clock size={14} className="text-amber-400/80" />
            <span>{currentDayContent.dur}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md/60 px-4 py-2 rounded-full border border-white/5 shadow-inner backdrop-blur-sm">
            <MapPin size={14} className="text-teal-400/80" />
            <span>{currentDayContent.where}</span>
          </div>
        </div>

        {/* Step Progress indicators */}
        <div className="flex gap-2 mb-8">
          {daySteps.map((step, idx) => (
             <div 
               key={step.id} 
               className={`h-1 flex-1 rounded-full transition-all duration-500 bg-[#161922] ${idx <= activeStep ? 'bg-teal-500/80' : 'bg-white/10'}`} 
             />
          ))}
        </div>

        <div className="flex-1 relative flex flex-col items-stretch pt-2">
           <AnimatePresence mode="wait" custom={direction} initial={false}>
             <motion.div
                key={activeStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="flex-1 flex flex-col"
             >
                {currentStepData.id === 'lesson' && (
                  <>
                    <h3 className="text-2xl md:text-3xl font-serif text-white mb-6 leading-tight drop-shadow-sm flex items-center gap-3">
                       <currentStepData.icon className="text-teal-400 opacity-80" size={24} />
                       {currentDayContent.title}
                    </h3>
                    
                    {hasCameraAnchor && !hasCameraZoom && <CameraAnimation mode="anchor" />}
                    {hasCameraZoom && <CameraAnimation mode="zoom" />}
                    {hasSamatha && <SamathaAnimation />}

                    <div className="prose prose-invert max-w-none mb-8 text-white/80 leading-relaxed font-serif text-lg" 
                         dangerouslySetInnerHTML={{ __html: currentDayContent.lesson }} />
                  </>
                )}

                {currentStepData.id === 'exercise' && currentDayContent.exercise && (
                  <div className="bg-black/40 backdrop-blur-md/80 border border-white/5 rounded-[2rem] p-6 sm:p-8 mb-6 shadow-2xl backdrop-blur-md">
                    <h4 className="text-xl md:text-2xl font-serif text-white mb-6 flex items-center gap-3 drop-shadow-sm">
                      <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/20 shadow-inner">
                        <PlayCircle size={24} strokeWidth={2} />
                      </div>
                      {currentDayContent.exercise.title}
                    </h4>
                    <ul className="space-y-4">
                      {currentDayContent.exercise.steps.map((step: string, idx: number) => (
                        <li key={idx} className="flex gap-4 text-white/90 leading-relaxed items-start">
                          <span className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 border border-amber-500/20 shadow-inner mt-0.5">{idx + 1}</span>
                          <span className="text-base sm:text-lg">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.id === 'breathing' && currentDayContent.breathing && (
 <div className="glass-card rounded-[2rem] p-6 sm:p-8 mb-6 prose prose-invert max-w-none text-white/80"
                       dangerouslySetInnerHTML={{ __html: currentDayContent.breathing }} />
                )}

                {currentStepData.id === 'insight' && (
                  <div className="grid grid-cols-1 gap-5 md:gap-6 mb-6">
                    {currentDayContent.insight && (
                      <div className="bg-black/40 backdrop-blur-md/80 border border-white/5 rounded-[1.75rem] p-6 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></div>
                          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/90 drop-shadow-sm">{language === 'el' ? 'Επίγνωση' : 'Insight'}</h5>
                        </div>
                        <p className="text-white font-medium italic leading-relaxed text-lg sm:text-xl">"{currentDayContent.insight}"</p>
                      </div>
                    )}
                    {currentDayContent.reflection && (
                      <div className="bg-black/40 backdrop-blur-md/80 border border-white/5 rounded-[1.75rem] p-6 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80"></div>
                          <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/90 drop-shadow-sm">
                            {language === 'en' ? 'Reflection' : 'Αναστοχασμός'}
                          </h5>
                        </div>
                        <p className="text-white/80 leading-relaxed text-base sm:text-lg">{currentDayContent.reflection}</p>
                      </div>
                    )}
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center z-10 rounded-2xl pb-0">
          <button
            onClick={goPrevStep}
            disabled={activeStep === 0}
            className="flex h-12 px-5 rounded-xl bg-white/5 border border-white/5 items-center justify-center gap-2 text-white/50 disabled:opacity-0 disabled:cursor-not-allowed hover:bg-white/[0.08] hover:text-white/90 transition-all duration-300 active:scale-95 font-medium text-sm backdrop-blur-sm"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">{language === 'el' ? 'Πίσω' : 'Back'}</span>
          </button>
          
          {activeStep === daySteps.length - 1 ? (
            <button 
              onClick={handleComplete}
              disabled={isCompleted}
              className={`group flex items-center gap-2 px-6 h-12 rounded-xl font-bold transition-all duration-300 ${
                isCompleted 
                  ? 'bg-white/10 text-white/40 cursor-default opacity-80 border border-white/5' 
                  : 'bg-teal-500 hover:bg-teal-400 text-black shadow-[0_4px_15px_rgba(20,184,166,0.3)] active:scale-95'
              }`}
            >
              <span>{isCompleted ? (language === 'en' ? 'Completed' : 'Ολοκληρώθηκε') : (language === 'en' ? 'Complete Day' : 'Ολοκλήρωση')}</span>
              <Check size={18} strokeWidth={3} className={isCompleted ? 'text-white/50' : 'text-black'} />
            </button>
          ) : (
            <button
              onClick={goNextStep}
              className="flex h-12 px-6 rounded-xl items-center justify-center gap-2 transition-all duration-300 active:scale-95 font-bold text-sm bg-teal-500/10 text-teal-300 border border-teal-500/30 hover:bg-teal-500/20 shadow-sm"
            >
              {language === 'el' ? 'Συνέχεια' : 'Next'}
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
