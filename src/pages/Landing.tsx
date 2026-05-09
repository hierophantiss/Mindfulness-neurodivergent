import React, { useState } from 'react';
import { Music, Bell, Sun, Moon, ArrowRight, Settings, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../hooks/useAccessibility';
import { motion, AnimatePresence } from 'framer-motion';

export default function Landing() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { reduceMotion } = useAccessibility();
  const toggleLanguage = () => setLanguage(language === 'el' ? 'en' : 'el');
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(() => localStorage.getItem('hasSeenIntro') === 'true');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEnter = () => {
    if (dontShowAgain) {
      localStorage.setItem('hasSeenIntro', 'true');
    } else {
      localStorage.setItem('hasSeenIntro', 'false');
    }
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col relative w-full h-full overflow-y-auto overflow-x-hidden selection:bg-amber-500/30 transition-colors duration-1000 bg-[#1E1B18]">
      
      {/* Deep Immersive Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2C2622] via-[#1E1B18] to-[#12100E] opacity-100"></div>
        
        {/* Soft light sources */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] transition-colors duration-1000 bg-[#e6a15c]/15 mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[130px] transition-colors duration-1000 bg-[#788276]/20 mix-blend-screen opacity-50"></div>
        
        {/* Noise texture for organic feel */}
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 border px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl whitespace-nowrap text-center text-sm font-medium ${theme === 'light' ? 'bg-white/80 border-teal-500/10 text-teal-900' : 'bg-pine-900/90 border-teal-500/20 text-teal-50'}`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full w-full max-w-2xl mx-auto px-5">
        
        {/* Top Header - Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex justify-between items-center w-full pt-4 sm:pt-6"
        >
          {/* Left Setting - Language/Settings */}
          <div className="flex gap-3 pl-16 sm:pl-[72px]">
             <button onClick={toggleLanguage} className="w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
               <span className="font-bold text-sm">{language === 'el' ? 'EN' : 'EL'}</span>
             </button>
             <button onClick={() => showToast(language === 'el' ? 'Ρυθμίσεις σύντομα' : 'Settings coming soon')} className="hidden sm:flex w-12 h-12 rounded-full border items-center justify-center backdrop-blur-xl transition-all duration-300 bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
               <Settings size={20} strokeWidth={1.5} />
             </button>
          </div>

          {/* Right Controls - Audio & SOS */}
          <div className="flex gap-3">
            <button onClick={() => showToast(language === 'el' ? 'Μουσική σύντομα!' : 'Music coming soon!')} className={`w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all duration-300 ${theme === 'light' ? 'bg-white/40 border-teal-900/10 text-teal-900 hover:bg-white/60 shadow-[0_4px_16px_rgba(13,34,43,0.1)]' : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] hover:border-white/10 text-teal-200/80 hover:text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]'}`}>
               <Volume2 size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => navigate('/practice/breath/sos-breath')} className={`w-12 h-12 rounded-full border flex items-center justify-center backdrop-blur-xl transition-all duration-300 group relative overflow-hidden ${theme === 'light' ? 'bg-amber-100/50 border-amber-500/30 text-amber-600 hover:bg-amber-200/50 hover:text-amber-700 shadow-[0_4px_16px_rgba(245,158,11,0.1)]' : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 shadow-[0_4px_16px_rgba(245,158,11,0.15)]'}`}>
               <span className="font-bold tracking-widest text-[13px] group-hover:scale-105 transition-transform">SOS</span>
               {/* SOS ripple effect */}
               <div className={`absolute inset-0 rounded-full border animate-[ping_2s_ease-in-out_infinite] opacity-50 ${theme === 'light' ? 'border-amber-500/40' : 'border-amber-500/50'}`}></div>
            </button>
          </div>
        </motion.div>

        {/* Central Composition */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pb-2">
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1.5, ease: [0.25, 1, 0.3, 1] }}
             className="relative w-full flex flex-col items-center justify-center mt-2 sm:mt-4"
           >
              {/* Floating Stars/Orbs */}
              <div className={`absolute -top-12 left-[10%] sm:left-[20%] ${reduceMotion ? '' : 'animate-[pulse_4s_ease-in-out_infinite]'}`}>
                 <Moon size={36} className={`drop-shadow-[0_0_15px_rgba(191,219,254,0.3)] ${theme === 'light' ? 'text-teal-600/40' : 'text-blue-200/80'}`} fill="currentColor" strokeWidth={0} />
              </div>
              <div className={`absolute -top-16 right-[10%] sm:right-[20%] ${reduceMotion ? '' : 'animate-[pulse_5s_ease-in-out_infinite]'}`}>
                 <Sun size={42} className={`drop-shadow-[0_0_20px_rgba(252,211,77,0.4)] ${theme === 'light' ? 'text-amber-400/50' : 'text-amber-300/90'}`} fill="currentColor" strokeWidth={0} />
              </div>

              {/* The Quote */}
              <div className="relative z-20 flex flex-col items-center mb-6 sm:mb-8">
                <span className={`pb-2 text-lg ${theme === 'light' ? 'text-teal-700/60' : 'text-teal-400/40'}`}>✦</span>
                <p className={`font-serif italic text-base sm:text-lg tracking-[0.05em] max-w-[280px] sm:max-w-md text-center leading-relaxed px-4 font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${theme === 'light' ? 'text-pine-900/90 font-medium drop-shadow-none' : 'text-teal-50/70 mix-blend-screen'}`}>
                  {language === 'el' ? '« Ο νους σου δεν είναι χαλασμένος, απλά λειτουργεί διαφορετικά. »' : '« Your mind is not broken, it simply functions differently. »'}
                </p>
              </div>

              {/* Gravity & Earth Area */}
              <div className="relative flex flex-col items-center justify-center w-full min-h-[180px] sm:min-h-[200px] mb-4">
                
                {/* Axis Line - Laser Gravity */}
                <div className={`absolute -top-[120px] bottom-[50%] left-1/2 -translate-x-1/2 w-[1px] z-0 ${theme === 'light' ? 'bg-gradient-to-b from-teal-500/0 via-teal-600/40 to-teal-700/80 shadow-[0_0_15px_rgba(15,118,110,0.3)]' : 'bg-gradient-to-b from-teal-200/0 via-teal-300/40 to-teal-400/80 shadow-[0_0_15px_rgba(45,212,191,0.5)]'}`}></div>

                {/* 3D-like Earth Component */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-1000 ease-out ${reduceMotion ? '' : 'animate-[pulse_6s_ease-in-out_infinite]'} ${theme === 'light' ? 'bg-gradient-to-br from-[#86efac] via-[#38bdf8] to-[#1e40af] opacity-80 border-blue-900/10 shadow-[0_0_60px_rgba(14,165,233,0.3),inset_-20px_-20px_40px_rgba(0,0,0,0.2),inset_4px_4px_16px_rgba(255,255,255,0.8)]' : 'bg-gradient-to-br from-[#4ade80] via-[#0ea5e9] to-[#1e3a8a] border-blue-200/5 shadow-[0_0_80px_rgba(14,165,233,0.15),inset_-20px_-20px_40px_rgba(0,0,0,0.8),inset_4px_4px_16px_rgba(255,255,255,0.3)] opacity-90'}`}>
                  {/* Internal Glow at the pole */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-teal-200/40 blur-[12px] rounded-full transform -translate-y-1/2"></div>
                  {/* Organic Continents */}
                  <div className="absolute top-[20%] left-[25%] w-[40%] h-[30%] bg-emerald-400/40 rounded-[40%] blur-[2.5px] transform rotate-[15deg]"></div>
                  <div className="absolute bottom-[20%] right-[15%] w-[50%] h-[35%] bg-emerald-500/50 rounded-[50%] blur-[3px] transform -rotate-[20deg]"></div>
                  <div className="absolute top-[50%] left-[18%] w-[25%] h-[20%] bg-emerald-400/30 rounded-full blur-[2px]"></div>
                  {/* Atmosphere outer rim */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none"></div>
                </div>

                {/* Depth overlay for the text */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] z-10 pointer-events-none rounded-full blur-[6px] ${theme === 'light' ? 'bg-[radial-gradient(ellipse_at_center,_rgba(244,241,234,0.75)_0%,_transparent_60%)]' : 'bg-[radial-gradient(ellipse_at_center,_rgba(12,30,38,0.65)_0%,_transparent_60%)]'}`}></div>

                {/* Massive 3D Text Overlaid */}
                <div className="relative z-20 text-center flex flex-col items-center w-full px-2 mt-4 perspective-[1000px]">
                  <h1 className={`font-serif italic text-[28px] min-[360px]:text-[32px] sm:text-[44px] md:text-[56px] tracking-wide leading-[1.05] ${theme === 'light' ? 'text-pine-900 font-bold' : 'text-[#f0f9ff] font-medium'}`}
                      style={{ 
                        textShadow: theme === 'light' ? '0 4px 12px rgba(13,34,43,0.1), 0 10px 30px rgba(13,34,43,0.1), inset 0 2px 0 rgba(255,255,255,0.8)' : '0 4px 12px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.5)',
                        transform: 'translateZ(20px)'
                      }}>
                     {language === 'el' ? 'Ενσυνειδητότητα' : 'Mindfulness'}
                  </h1>
                  <h2 className={`font-sans text-[11px] sm:text-[13px] md:text-[14px] font-semibold tracking-[0.3em] uppercase mt-2 sm:mt-3 ${theme === 'light' ? 'text-teal-800/90' : 'text-teal-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'}`}>
                     {language === 'el' ? 'για Νευροδιαφορετικούς' : 'for Neurodivergents'}
                  </h2>
                </div>
              </div>
           </motion.div>
        </div>

        {/* Bottom Enter Button Layer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full flex flex-col items-center pb-12 sm:pb-16 pt-2 relative z-30"
        >
          {/* Don't show again checkbox */}
          <div className="mb-4 sm:mb-6 flex items-center gap-3 cursor-pointer group" onClick={() => setDontShowAgain(!dontShowAgain)}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${dontShowAgain ? 'bg-teal-500 border-teal-500' : theme === 'light' ? 'border-teal-900/30 group-hover:border-teal-700/50' : 'border-teal-50/20 group-hover:border-teal-50/50'}`}>
              {dontShowAgain && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className={`text-sm font-medium tracking-wide ${theme === 'light' ? 'text-teal-900/70 group-hover:text-teal-900' : 'text-teal-50/60 group-hover:text-teal-50/90'} transition-colors`}>
              {language === 'el' ? 'Παράλειψη την επόμενη φορά' : 'Skip this intro next time'}
            </span>
          </div>

          <button 
            onClick={handleEnter}
            className="group relative flex items-center justify-center px-10 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-sm bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] hover:border-white/10 backdrop-blur-md shadow-lg transition-all duration-300"
          >
             {/* Text and Icon */}
             <div className="relative z-10 flex items-center gap-3">
               <span>{language === 'el' ? 'ΕΙΣΟΔΟΣ' : 'ENTER'}</span>
               <ArrowRight size={18} className="transform group-hover:translate-x-2 transition-transform duration-500 ease-out" />
             </div>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
