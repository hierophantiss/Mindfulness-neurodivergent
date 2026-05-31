import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useCompanion } from '../hooks/useCompanion';
import { MessageCircle, Sparkles, Activity, ShieldAlert, Heart, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CatInfinityAvatar } from './CatInfinityAvatar';

export default function DesktopRightRail() {
  const { language } = useLanguage();
  const { companionData, updateCompanionData, setSheetVisible } = useCompanion();

  const handleCompanionClick = () => {
    setSheetVisible(true);
  };

  const hasProgram = (companionData.programProgress?.week || 0) > 0;
  
  // Calculate mock streaks based on actual companion stats for quick context
  const streak = Math.max(1, companionData?.dailyLogs?.length || 7);
  const practices = Math.max(1, (companionData?.programProgress?.day || 0) + 1);

  return (
    <aside className="hidden lg:flex w-[280px] xl:w-[320px] flex-col h-full border-l border-white/5 bg-[#0a0d14]/40 z-20 overflow-y-auto pt-8 pb-4 px-5 custom-scrollbar">
      
      {/* 1. Companion / Status Tracker Header */}
      <div className="flex items-start justify-between mb-8 cursor-pointer group" onClick={handleCompanionClick}>
         <div className="relative">
           <CatInfinityAvatar className="w-12 h-12 relative z-10 transition-transform group-hover:scale-105" />
           <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full scale-110 group-hover:scale-125 transition-transform" />
         </div>
         <div className="flex-1 ml-4 pt-1">
           <h3 className="text-sm font-semibold text-white/90">
             {language === 'en' ? 'Companion' : 'Συνοδός'}
           </h3>
           <p className="text-[11px] text-teal-400 mt-0.5 uppercase tracking-widest font-bold">
             {companionData.companionModeEnabled 
               ? (language === 'en' ? 'Active' : 'Ενεργός') 
               : (language === 'en' ? 'Quiet Tracking' : 'Ήσυχη Καταγραφή')}
           </p>
         </div>
         <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors group-hover:bg-white/10">
           <MessageCircle size={14} />
         </button>
      </div>

      {/* 2. Quick Progress Context */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-teal-500/0 via-teal-500/30 to-teal-500/0" />
        
        <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-3">
          {language === 'el' ? 'Συνοψη Πρακτικης' : 'Practice Summary'}
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-mono text-zinc-100">{streak}</span>
            <span className="text-[10px] text-zinc-500 font-medium">
              {language === 'en' ? 'Day Streak' : 'Ημέρες Σερί'}
            </span>
          </div>
          <div className="flex flex-col gap-1 border-l border-white/5 pl-2">
            <span className="text-xl font-mono text-zinc-100">{practices}</span>
            <span className="text-[10px] text-zinc-500 font-medium">
              {language === 'en' ? 'Practices' : 'Ασκήσεις'}
            </span>
          </div>
        </div>

        {hasProgram && (
           <div className="mt-4 pt-3 border-t border-white/5">
             <div className="flex items-center gap-2 text-teal-300">
               <Calendar size={12} />
               <span className="text-xs font-medium">
                 {language === 'en' ? `Week ${companionData.programProgress?.week}` : `Εβδομάδα ${companionData.programProgress?.week}`}
               </span>
             </div>
           </div>
        )}
      </div>

      <button 
        onClick={handleCompanionClick}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-500/20 transition-all font-medium text-sm mt-auto shadow-sm active:scale-[0.98]"
      >
        <Sparkles size={16} />
        {language === 'el' ? 'Άνοιξε το Companion' : 'Open Companion'}
      </button>

    </aside>
  );
}
