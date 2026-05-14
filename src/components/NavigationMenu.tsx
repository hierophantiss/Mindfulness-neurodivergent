import React, { useState, useEffect } from 'react';
import { Home, BookOpen, Activity, Notebook, Menu, X, Info, Music, Bell, Compass, LayoutGrid, EyeOff, Eye, Database, User as UserIcon, LogOut, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../hooks/useAccessibility';
import { useFirebase } from '../lib/FirebaseContext';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { reduceMotion, toggleReduceMotion } = useAccessibility();
  const { user, signInWithGoogle, logout } = useFirebase();

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const showInfo = () => {
    setIsOpen(false);
    navigate('/method');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const mainNavItems = [
    { path: '/dashboard', icon: <Home size={18} />, labelEn: 'Home', labelEl: 'Αρχική' },
    { path: '/chapters', icon: <BookOpen size={18} />, labelEn: 'Read', labelEl: 'Διάβασμα' },
    { path: '/practice', icon: <Activity size={18} />, labelEn: 'Practice', labelEl: 'Πρακτική' },
    { path: '/journal', icon: <Notebook size={18} />, labelEn: 'Journal', labelEl: 'Ημερολόγιο' },
  ];

  const moreItems = [
    { path: '/program', icon: '🗺️', labelEn: 'Program', labelEl: 'Πλάνο' },
    { path: '/rabbithole', icon: '🐇', labelEn: 'Rabbit Hole', labelEl: 'Εξερεύνηση' },
    { path: '/faq', icon: '❓', labelEn: 'FAQ', labelEl: 'Συχνές Ερωτήσεις' },
    { path: '/method', icon: '∞', labelEn: 'Method', labelEl: 'Η Μέθοδος' },
    { path: '/media', icon: '🎬', labelEn: 'Media', labelEl: 'Υλικό' },
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
      <div className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 w-auto pointer-events-none">
        <div className="bg-[#0f171a]/80 backdrop-blur-3xl border border-white/10 shape-nav px-6 py-2.5 flex items-center justify-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-500 relative py-1 ${
                  isActive
                    ? 'text-teal-400'
                    : 'text-white/20 hover:text-white/40'
                }`}
              >
                <div className={`relative z-10 transition-transform duration-500 ${isActive ? 'scale-110' : 'scale-100 opacity-80'}`}>
                  {item.icon}
                </div>
                <span className={`text-[8px] font-bold tracking-widest uppercase transition-all duration-500 font-sans ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-0.5'}`}>
                  {language === 'en' ? item.labelEn : item.labelEl}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-glow" 
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,1)]" 
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
          
          <div className="w-[1px] h-6 bg-white/10 mx-1 opacity-50"></div>

          <button
            onClick={() => setIsOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-500 relative py-1 ${
              isOpen
                ? 'text-teal-400'
                : 'text-white/20 hover:text-white/40'
            }`}
          >
            <div className={`transition-transform duration-500 ${isOpen ? 'scale-110 rotate-90' : 'scale-100 opacity-80'}`}>
              <LayoutGrid size={18} />
            </div>
            <span className={`text-[8px] font-bold tracking-widest uppercase transition-all duration-500 font-sans ${isOpen ? 'opacity-100' : 'opacity-40'}`}>
              {language === 'en' ? 'More' : 'Μενού'}
            </span>
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

              {/* Settings / Accessibility & Install Toggles */}
              <div className="px-6 pb-6 max-w-2xl mx-auto w-full flex flex-col gap-3">
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

                {/* Install App - Only show when install prompt is available */}
                {deferredPrompt && (
                  <button 
                    onClick={handleInstallClick}
                    className="bg-teal-500/10 border border-teal-500/20 hover:bg-teal-500/20 rounded-3xl p-4 flex items-center justify-between transition-colors active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500/20 text-teal-400">
                        <Download size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-sm font-medium text-teal-100">
                          {language === 'en' ? 'Install App' : 'Εγκατάσταση Εφαρμογής'}
                        </span>
                        <span className="text-[10px] text-teal-400/80">
                          {language === 'en' ? 'Add to your home screen' : 'Προσθήκη στην αρχική οθόνη'}
                        </span>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              <div className="flex justify-center gap-6 items-center p-6 border-t border-pine-800/40 mt-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
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
                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>
                {user ? (
                  <button 
                    onClick={() => {
                        logout();
                        setIsOpen(false);
                    }}
                    title={language === 'el' ? 'Αποσύνδεση' : 'Logout'}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-pine-300 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-white/5"
                  >
                    <LogOut size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                        signInWithGoogle();
                        setIsOpen(false);
                    }}
                    title={language === 'el' ? 'Σύνδεση' : 'Login'}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-pine-300 hover:bg-teal-500/10 hover:text-teal-400 transition-colors border border-white/5"
                  >
                    <UserIcon size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

