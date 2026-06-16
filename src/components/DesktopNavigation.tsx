import React, { useState } from 'react';
import { Home, BookOpen, Activity, Notebook, Info, Music, Bell, LogOut, Download, Sparkles, RotateCcw, LayoutGrid, Compass } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useAudioMixer } from '../contexts/AudioContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { CatInfinityAvatar } from './CatInfinityAvatar';

export default function DesktopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { masterPlaying, toggleMaster } = useAudioMixer();

  // Hide completely in chapters for Zen Reading Mode
  if (location.pathname.match(/^\/chapters\/\d+/)) {
    return null;
  }

  const mainNavItems = [
    { path: '/dashboard', icon: <Home size={20} />, labelEn: 'Home', labelEl: 'Αρχική' },
    { path: '/chapters', icon: <BookOpen size={20} />, labelEn: 'Read', labelEl: 'Διάβασμα' },
    { path: '/practice', icon: <Activity size={20} />, labelEn: 'Practice', labelEl: 'Πρακτική' },
    { path: '/journal', icon: <Notebook size={20} />, labelEn: 'Journal', labelEl: 'Ημερολόγιο' },
  ];

  const moreItems = [
    { path: '/program', icon: '🗺️', labelEn: 'Program', labelEl: 'Πλάνο' },
    { path: '/rabbithole', icon: '🐇', labelEn: 'Rabbit Hole', labelEl: 'Εξερεύνηση' },
    { path: '/sanctuary', icon: '🌙', labelEn: 'Sanctuary', labelEl: 'Καταφύγιο' },
    { path: '/faq', icon: '❓', labelEn: 'FAQ', labelEl: 'Συχνές Ερωτήσεις' },
    { path: '/method', icon: '∞', labelEn: 'Method', labelEl: 'Η Μέθοδος' },
    { path: '/methodology', icon: '🔬', labelEn: 'Science', labelEl: 'Επιστήμη' },
  ];

  const handleNav = (path: string, external?: boolean) => {
    if (external) {
      window.location.href = path;
    } else {
      navigate(path);
    }
  };

  return (
    <aside className="hidden lg:flex w-[260px] xl:w-[280px] flex-col h-full border-r border-white/5 bg-[#0a0d14]/40 z-20 overflow-y-auto px-4 py-8 custom-scrollbar">
      {/* Brand ID */}
      <div className="flex items-center gap-3 px-3 mb-12" onClick={() => handleNav('/')}>
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center cursor-pointer border border-teal-500/20">
          <CatInfinityAvatar className="w-8 h-8 drop-shadow-md" />
        </div>
        <div>
          <h1 className="font-serif italic text-white/90 text-xl leading-none">Awareness</h1>
          <p className="text-[10px] text-teal-400/80 font-medium tracking-widest mt-1">GATEWAY</p>
        </div>
      </div>

      <nav className="space-y-1 mb-8">
        <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">
          {language === 'el' ? 'Βασικη Περιηγηση' : 'Main Menu'}
        </p>
        {mainNavItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-[13px] relative group active:scale-[0.98]",
                isActive 
                  ? "text-teal-300 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.05)]" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div layoutId="left-nav-active" className="absolute left-0 w-1 h-1/2 bg-teal-400 rounded-r-full" />
              )}
              <div className={cn("transition-transform duration-300", isActive ? "scale-110 drop-shadow-md" : "group-hover:scale-105")}>
                {item.icon}
              </div>
              <span className="tracking-wide">
                {language === 'en' ? item.labelEn : item.labelEl}
              </span>
            </button>
          );
        })}
      </nav>

      <nav className="space-y-1 mb-auto">
        <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">
          {language === 'el' ? 'Περισσοτερα' : 'More Tools'}
        </p>
        {moreItems.map(item => {
          const isActive = location.pathname.startsWith(item.path.replace('.html', ''));
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-[13px] relative group active:scale-[0.98]",
                isActive 
                  ? "text-teal-300 bg-teal-500/10 shadow-[0_0_15px_rgba(20,184,166,0.05)]" 
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div layoutId="left-nav-active" className="absolute left-0 w-1 h-1/2 bg-teal-400 rounded-r-full" />
              )}
              <div className={cn("text-lg transition-transform duration-300 transform", isActive ? "scale-110" : "group-hover:scale-105")}>
                {item.icon}
              </div>
              <span className="tracking-wide">
                {language === 'en' ? item.labelEn : item.labelEl}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-white/5 pt-6 pb-2 space-y-2">
         <button 
           onClick={() => toggleMaster()}
           className={cn(
             "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-[13px] group border",
             masterPlaying 
               ? "text-teal-300 bg-teal-500/10 border-teal-500/20" 
               : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border-transparent"
           )}
         >
           <Music size={18} className={masterPlaying ? 'animate-pulse' : ''} />
           <span>{language === 'en' ? 'Audio Mixer' : 'Μίκτης Ήχου'}</span>
         </button>
      </div>
    </aside>
  );
}
