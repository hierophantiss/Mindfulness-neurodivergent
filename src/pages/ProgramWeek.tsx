import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { D as courseDataEl } from '../data/course-el';
import { D as courseDataEn } from '../data/course-en';
import { ArrowLeft, Check, PlayCircle, BookOpen, Clock, MapPin } from 'lucide-react';
import CameraAnimation from '../components/CameraAnimation';
import SamathaAnimation from '../components/SamathaAnimation';

export default function ProgramWeek() {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { companionData, updateCompanionData } = useCompanion();
  
  const courseData = language === 'en' ? courseDataEn : courseDataEl;
  const weekNum = Number(weekId);
  const week = courseData[weekNum];
  
  const [activeDay, setActiveDay] = useState(0);

  // Default activeDay to what the companion has IF it's on this week
  useEffect(() => {
    if (companionData.programProgress?.week === weekNum) {
      setActiveDay(Math.min(companionData.programProgress?.day || 0, week?.days?.length - 1 || 0));
    }
  }, [weekNum]);

  if (!week) {
    return <div className="p-8 text-center text-pine-400">
      {language === 'en' ? 'Week not found.' : 'Εβδομάδα δεν βρέθηκε.'}
    </div>;
  }

  const currentDayContent = week.days[activeDay];
  
  const hasCameraAnchor = currentDayContent.lesson?.includes('Animation Camera') || currentDayContent.lesson?.includes('Οπτική Άγκυρα') || currentDayContent.title?.includes('Άγκυρα');
  const hasCameraZoom = currentDayContent.lesson?.includes('Camera Animation') || currentDayContent.title?.includes('Κλειστή και Ανοιχτή');
  const hasSamatha = currentDayContent.lesson?.includes('Samatha Animation') || currentDayContent.title?.includes('Samatha') || currentDayContent.lesson?.includes('Samatha');

  const curW = companionData.programProgress?.week || 0;
  const curD = companionData.programProgress?.day || 0;
  const isCompleted = weekNum < curW || (weekNum === curW && activeDay < curD);

  const handleComplete = () => {
    // Only advance if it's the latest day they are on
    if (!isCompleted) {
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
        setTimeout(() => navigate('/program'), 500);
      } else {
        setTimeout(() => setActiveDay(nextD), 500);
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-safe mb-4">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/program')} 
          className="w-10 h-10 rounded-full bg-pine-800/40 border border-pine-700/50 flex items-center justify-center text-pine-300 hover:bg-pine-700 hover:text-white transition-all backdrop-blur-md"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="mb-8">
        <span className="text-teal-500/80 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">
          {language === 'en' ? 'Week' : 'Εβδομάδα'} {weekNum}
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-medium text-white tracking-tight mb-8 drop-shadow-sm">{week.title}</h2>
        
        {/* Days Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x hide-scrollbar px-1">
          {week.days.map((day: any, idx: number) => {
             const dayCompleted = weekNum < curW || (weekNum === curW && idx < curD);
             return (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`snap-start shrink-0 flex flex-col items-start p-5 rounded-[1.5rem] border transition-all duration-300 active:scale-[0.98] ${
                  activeDay === idx 
                    ? 'bg-gradient-to-br from-pine-700 to-pine-800 border-pine-600/50 text-white min-w-[220px] shadow-[0_8px_20px_rgba(0,0,0,0.3)] ring-1 ring-white/10' 
                    : 'bg-pine-800/40 shadow-sm border-pine-700/50 text-pine-300 hover:bg-pine-800/60 min-w-[180px] backdrop-blur-sm'
                }`}
              >
                <div className="w-full flex justify-between items-center mb-2">
                  <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${activeDay === idx ? 'text-teal-300 drop-shadow-sm' : 'text-pine-400/80'}`}>
                    {language === 'en' ? 'Day' : 'Ημερα'} {idx + 1}
                  </div>
                  {dayCompleted && (
                    <div className="w-4 h-4 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <h4 className={`font-heading text-lg leading-tight text-left ${activeDay === idx ? 'text-white drop-shadow-sm' : 'text-pine-100/90'}`}>
                  {day.title}
                </h4>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Day Content */}
      <div className="bg-gradient-to-b from-pine-800/40 to-pine-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-pine-700/50 rounded-[2rem] p-6 md:p-10 animate-in fade-in zoom-in-95 duration-500 backdrop-blur-md">
        <div className="flex flex-wrap gap-3 mb-8 text-xs text-pine-300 font-medium">
          <div className="flex items-center gap-2 bg-pine-950/60 px-4 py-2 rounded-full border border-white/5 shadow-inner backdrop-blur-sm">
            <Clock size={14} className="text-amber-400/90" />
            <span>{currentDayContent.dur}</span>
          </div>
          <div className="flex items-center gap-2 bg-pine-950/60 px-4 py-2 rounded-full border border-white/5 shadow-inner backdrop-blur-sm">
            <MapPin size={14} className="text-teal-400/90" />
            <span>{currentDayContent.where}</span>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-heading font-medium text-white mb-8 leading-tight drop-shadow-sm">
          <span className="text-teal-500/90 mr-3">{language === 'en' ? 'Day' : 'Ημέρα'} {activeDay + 1}:</span>
          {currentDayContent.title}
        </h3>

        {hasCameraAnchor && !hasCameraZoom && <CameraAnimation mode="anchor" />}
        {hasCameraZoom && <CameraAnimation mode="zoom" />}
        {hasSamatha && <SamathaAnimation />}

        <div className="prose prose-invert prose-pine max-w-none mb-10 text-pine-100/90 leading-relaxed font-normal text-lg" 
             dangerouslySetInnerHTML={{ __html: currentDayContent.lesson }} />

        {currentDayContent.exercise && (
          <div className="bg-gradient-to-b from-pine-900/60 to-pine-950/80 border border-white/5 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.2)] backdrop-blur-md">
            <h4 className="text-xl md:text-2xl font-heading font-medium text-white mb-6 flex items-center gap-3 drop-shadow-sm">
              <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/20 shadow-inner">
                <PlayCircle size={24} strokeWidth={2} />
              </div>
              {currentDayContent.exercise.title}
            </h4>
            <ul className="space-y-4">
              {currentDayContent.exercise.steps.map((step: string, idx: number) => (
                <li key={idx} className="flex gap-4 text-pine-100 leading-relaxed items-start">
                  <span className="w-7 h-7 rounded-full bg-pine-800/80 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0 border border-amber-500/20 shadow-inner mt-0.5">{idx + 1}</span>
                  <span className="text-base sm:text-lg">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentDayContent.breathing && (
          <div className="bg-gradient-to-br from-teal-900/30 to-pine-900/50 border border-teal-800/30 rounded-[2rem] p-6 sm:p-8 mb-10 prose prose-invert prose-teal max-w-none text-pine-100/90 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05),0_8px_20px_rgba(0,0,0,0.2)] backdrop-blur-md"
               dangerouslySetInnerHTML={{ __html: currentDayContent.breathing }} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <div className="bg-gradient-to-b from-pine-900/60 to-pine-950/80 border border-white/5 rounded-[1.75rem] p-6 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80"></div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/90 drop-shadow-sm">{language === 'el' ? 'Επίγνωση' : 'Insight'}</h5>
            </div>
            <p className="text-white font-medium italic leading-relaxed text-lg sm:text-xl">"{currentDayContent.insight}"</p>
          </div>
          <div className="bg-gradient-to-b from-pine-900/40 to-pine-950/60 border border-white/5 rounded-[1.75rem] p-6 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400/80"></div>
              <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/90 drop-shadow-sm">
                {language === 'en' ? 'Reflection' : 'Αναστοχασμός'}
              </h5>
            </div>
            <p className="text-pine-100 leading-relaxed text-base sm:text-lg">{currentDayContent.reflection}</p>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button 
            onClick={handleComplete}
            disabled={isCompleted}
            className={`group flex items-center gap-3 px-8 py-4 rounded-[1.25rem] font-bold transition-all ${
              isCompleted 
                ? 'bg-pine-800 text-pine-400 cursor-default opacity-80' 
                : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-pine-950 shadow-[0_8px_20px_rgba(20,184,166,0.3)] active:scale-[0.98] hover:shadow-[0_12px_25px_rgba(20,184,166,0.4)]'
            }`}
          >
            <div className={`p-1 rounded-full flex-shrink-0 ${isCompleted ? 'bg-pine-900/50' : 'bg-pine-950/10 group-hover:scale-110 transition-transform'}`}>
              <Check size={20} strokeWidth={3} className={isCompleted ? 'text-teal-500/50' : 'text-pine-950'} />
            </div>
            <span className="tracking-wide">{isCompleted ? (language === 'en' ? 'Completed' : 'Ολοκληρώθηκε') : (language === 'en' ? 'Complete Day' : 'Ολοκλήρωση Ημέρας')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
