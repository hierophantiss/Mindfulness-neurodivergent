import React, { useState } from 'react';
import { Home, BookOpen, Activity, BookMarked, Menu, X, Info, Music, Bell, Compass, LayoutGrid, EyeOff, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../hooks/useAccessibility';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const showInfo = () => {
    setIsOpen(false);
    navigate('/landing_info');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const mainNavItems = [
    { path: '/', icon: <Home size={22} />, labelEn: 'Home', labelEl: 'Αρχική' },
    { path: '/chapters', icon: <BookOpen size={22} />, labelEn: 'Read', labelEl: 'Διάβασμα' },
    { path: '/practice', icon: <Activity size={22} />, labelEn: 'Practice', labelEl: 'Πρακτική' },
    { path: '/journal', icon: <BookMarked size={22} />, labelEn: 'Journal', labelEl: 'Ημερολόγιο' },
  ];

  const moreItems = [
    { path: '/program', icon: '🗺️', labelEn: 'Program', labelEl: 'Πλάνο' },
    { path: '/rabbithole', icon: '🐇', labelEn: 'Rabbit Hole', labelEl: 'Εξερεύνηση' },
    { path: '/faq', icon: '❓', labelEn: 'FAQ', labelEl: 'Συχνές Ερωτήσεις' },
    { path: '/intro', icon: '∞', labelEn: 'Guide', labelEl: 'Οδηγός' },
  ];

  return (
    <>
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] bg-pine-800/90 border border-white/10 text-white text-sm font-medium px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl whitespace-nowrap text-center max-w-[90vw] truncate"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Dock */}
      <div className="fixed bottom-0 md:bottom-6 left-0 md:left-1/2 md:-translate-x-1/2 z-40 w-full md:w-auto pointer-events-none">
        <div className="bg-[#0f171a]/95 backdrop-blur-2xl border-t md:border border-white/10 md:rounded-3xl p-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] md:pb-2 flex items-center justify-around sm:justify-center sm:gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pointer-events-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all duration-300 relative ${
                  isActive
                    ? 'text-amber-400'
                    : 'text-pine-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill" 
                    className="absolute inset-0 bg-white/5 rounded-2xl" 
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  {item.icon}
                  <span className="text-[10px] font-medium tracking-wide">
                    {language === 'en' ? item.labelEn : item.labelEl}
                  </span>
                </div>
              </button>
            );
          })}
          
          <div className="w-[1px] h-8 bg-white/10 mx-1"></div>

          <button
            onClick={() => setIsOpen(true)}
            className={`flex flex-col items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all duration-300 relative ${
              isOpen
                ? 'text-amber-400 bg-white/5'
                : 'text-pine-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="relative z-10 flex flex-col items-center gap-1">
              <LayoutGrid size={22} />
              <span className="text-[10px] font-medium tracking-wide">
                {language === 'en' ? 'More' : 'Μενού'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Slide-Up / Slide-Over Menu for More Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-pine-950/60 backdrop-blur-sm z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-gradient-to-t from-pine-950/95 to-[#0a1316] backdrop-blur-2xl border-t border-pine-800/50 z-[9999] shadow-[0_-20px_40px_rgba(0,0,0,0.5)] flex flex-col rounded-t-[2rem]"
            >
              <div className="p-4 flex justify-between items-center border-b border-pine-800/40">
                <span className="font-bold text-pine-100 tracking-wider text-sm uppercase px-4">
                  {language === 'en' ? 'More Options' : 'Περισσότερα'}
                </span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-pine-300 hover:bg-pine-800 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-[1] overflow-y-auto py-6 px-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto w-full content-start">
                {moreItems.map((item) => {
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className="flex flex-col items-center gap-3 p-5 rounded-3xl transition-all bg-white/[0.03] hover:bg-white/[0.08] text-pine-100 border border-white/[0.05] hover:border-white/10"
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="font-medium tracking-wide text-xs text-center">
                        {language === 'en' ? item.labelEn : item.labelEl}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Settings / Accessibility Toggles */}
              <div className="px-6 pb-6 max-w-2xl mx-auto w-full">
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-pine-900/50 text-pine-300">
                      {reduceMotion ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-pine-100">
                        {language === 'en' ? 'Reduce Motion' : 'Μείωση Κίνησης'}
                      </span>
                      <span className="text-[10px] text-pine-400">
                        {language === 'en' ? 'Disable breathing animations' : 'Απενεργοποίηση εφέ αναπνοής'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button 
                    onClick={toggleReduceMotion}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${reduceMotion ? 'bg-amber-500' : 'bg-white/10'}`}
                  >
                    <span 
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-6 items-center p-6 border-t border-pine-800/40 mt-auto pb-safe">
                <button 
                  onClick={showInfo} 
                  title={language === 'el' ? 'Πληροφορίες' : 'Info'}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-pine-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                >
                  <Info size={20} />
                </button>
                <button 
                  onClick={() => showToast(language === 'el' ? 'Λειτουργία σύντομα!' : 'Feature coming soon!')}
                  title={language === 'el' ? 'Μουσική' : 'Music'}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-pine-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                >
                  <Music size={20} />
                </button>
                <button 
                  onClick={() => showToast(language === 'el' ? 'Λειτουργία σύντομα!' : 'Feature coming soon!')}
                  title={language === 'el' ? 'Ειδοποιήσεις' : 'Notifications'}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-pine-300 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                >
                  <Bell size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

