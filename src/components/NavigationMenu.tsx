import React, { useState, useEffect } from 'react';
import InfoModal from './InfoModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { downloadBackup, restoreBackup } from '../lib/backup';
import { Home, BookOpen, Activity, Notebook, X, Info, Music, LayoutGrid, EyeOff, Eye, Database, Download, Sparkles, RotateCcw, Headphones, LetterText, Moon, CalendarDays, Telescope, Compass } from 'lucide-react';
import { MethodMark } from './MethodMark';
import { useTime } from '../contexts/TimeContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../hooks/useAccessibility';
import { useAudioMixer } from '../contexts/AudioContext';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { reduceMotion, toggleReduceMotion, easyRead, toggleEasyRead } = useAccessibility();
  const { masterPlaying, toggleMaster } = useAudioMixer();

  useEffect(() => {
    if (!isOpen) {
      setShowResetConfirm(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).initDeferredPrompt = e;
    };
    
    if ((window as any).initDeferredPrompt) {
      setDeferredPrompt((window as any).initDeferredPrompt);
    }

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIframe = window.self !== window.top;
    
    const promptEvent = deferredPrompt || (window as any).initDeferredPrompt;

    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        (window as any).initDeferredPrompt = null;
      }
    } else if (isIframe) {
       showToast(language === 'el'
         ? 'Ανοίξτε σε νέο παράθυρο για εγκατάσταση.'
         : 'Open the app in a new tab to enable installation.');
    } else if (isIOS) {
      showToast(language === 'el' 
        ? 'Εγκατάσταση: Πατήστε "Κοινοποίηση" ⎋ και "Προσθήκη στην Οθόνη Αφετηρίας" ⊞.' 
        : 'Install Web App: Tap "Share" ⎋ and then "Add to Home Screen" ⊞.');
    } else {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      if (isStandalone) {
        showToast(language === 'el' ? 'Η εφαρμογή είναι ήδη εγκατεστημένη.' : 'The app is already installed.');
      } else {
        const isSamsungBrowser = navigator.userAgent.includes('SamsungBrowser');
        showToast(language === 'el' 
          ? isSamsungBrowser
             ? 'Samsung Internet: Πατήστε το εικονίδιο λήψης (βέλος) στη γραμμή διεύθυνσης ή "Προσθήκη σελίδας σε" > "Αρχική οθόνη" από το μενού.'
             : 'Εγκατάσταση: Πατήστε τις 3 τελείες (Μενού Chrome) και μετά "Εγκατάσταση εφαρμογής" ή "Προσθήκη στην αρχική οθόνη".' 
          : isSamsungBrowser
             ? 'Samsung Internet: Tap the download icon in URL bar or "Add page to" > "Home screen" from menu.'
             : 'Installation: Tap the 3 dots (Chrome Menu) and select "Install app".');
      }
    }
  };

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  // The same "About" as on the home page.
  const [infoOpen, setInfoOpen] = useState(false);
  const showInfo = () => {
    setIsOpen(false);
    setInfoOpen(true);
  };

  // Esc closes the open menu.
  useKeyboardShortcuts({ Escape: () => setIsOpen(false) }, isOpen);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const { hour } = useTime();
  // On a phone a chapter is read without the bottom bar (zen reading);
  // on a computer the side bar stays, it takes nothing from the text.
  const zenReading = /^\/chapters\/\d+/.test(location.pathname);

  const mainNavItems = [
    { path: '/dashboard', icon: <Home size={18} />, labelEn: 'Home', labelEl: 'Αρχική' },
    { path: '/chapters', icon: <BookOpen size={18} />, labelEn: 'Read', labelEl: 'Διάβασμα' },
    { path: '/practice', icon: <Activity size={18} />, labelEn: 'Practice', labelEl: 'Πρακτική' },
    { path: '/journal', icon: <Notebook size={18} />, labelEn: 'Journal', labelEl: 'Ημερολόγιο' },
  ];

  const el = language === 'el';
  const isActivePath = (path: string) =>
    path === '/' ? location.pathname === '/' || location.pathname === '/dashboard' : location.pathname.startsWith(path);
  // The computer's side bar: every place in the app, always in the same order.
  const sideItems = [
    { path: '/', Icon: Home, label: el ? 'Αρχική' : 'Home' },
    { path: '/chapters', Icon: BookOpen, label: el ? 'Διάβασμα' : 'Read' },
    { path: '/practice', Icon: Activity, label: el ? 'Πρακτική' : 'Practice' },
    { path: '/sanctuary', Icon: Moon, label: el ? 'Καταφύγιο' : 'Sanctuary' },
    { path: '/program', Icon: CalendarDays, label: el ? 'Πρόγραμμα' : 'Program' },
    { path: '/journal', Icon: Notebook, label: el ? 'Ημερολόγιο' : 'Journal' },
    { path: '/rabbithole', Icon: Telescope, label: el ? 'Κουνελότρυπα' : 'Rabbit Hole' },
    { path: '/method', Icon: Compass, label: el ? 'Η Μέθοδος' : 'The Method' },
  ];
  const nightDim = hour >= 21 || hour < 5;

  return (
    <>
      {/* Computer: a side bar in place of the bottom bar. */}
      <nav data-nosnippet aria-label={el ? 'Κύρια πλοήγηση' : 'Main navigation'} className="hidden desk:flex fixed left-0 top-0 bottom-0 z-40 w-[248px] flex-col gap-1 px-[18px] pt-7 pb-5 bg-[rgb(8_10_20/0.42)] border-r border-white/[0.06] overflow-y-auto">
        <Link to="/" className="flex items-center gap-3 px-2 pb-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tint-blue-mark)]">
          <MethodMark small dim={nightDim} className="w-10 h-10 shrink-0" />
          <span className="flex flex-col gap-[3px] min-w-0">
            <span className="keep-font text-[12px] leading-tight tracking-[0.15em] uppercase text-sign-gold font-medium whitespace-nowrap">{el ? 'ΕΝΣΥΝΕΙΔΗΤΟΤΗΤΑ' : 'MINDFULNESS'}</span>
            <span className="text-[12.5px] leading-tight text-ink/70 whitespace-nowrap">{el ? 'Για νευροδιαφορετικούς' : 'For neurodivergents'}</span>
          </span>
        </Link>
        {sideItems.map(({ path, Icon, label }) => {
          const on = isActivePath(path);
          return (
            <Link
              key={path}
              to={path}
              aria-current={on ? 'page' : undefined}
              className={`flex items-center gap-3 h-11 px-3 rounded-[14px] text-[15px] transition-colors ${on ? 'bg-[var(--color-sign-gold)]/[0.09] text-sign-gold' : 'text-ink/80 hover:bg-white/[0.04] hover:text-ink'}`}
            >
              <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
        <div className="flex-1 min-h-6" />
        <Link
          to="/practice/breath/sos-breath"
          className="keep-font flex items-center justify-center gap-2.5 h-12 rounded-2xl text-[14px] font-medium text-[var(--tint-rose-ink)] bg-[rgb(240_194_200/0.08)] border border-[rgb(240_194_200/0.36)] hover:bg-[rgb(240_194_200/0.12)] transition-colors"
        >
          <span className="tracking-[0.14em]">SOS</span>
          <span className="font-normal">{el ? 'Άμεση ηρέμηση' : 'Immediate calm'}</span>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2 px-1.5 text-[13px] text-ink/65">
          <button type="button" onClick={() => setIsOpen(true)} aria-expanded={isOpen} className="flex items-center gap-1.5 min-h-[40px] hover:text-ink/90 transition-colors">
            <LayoutGrid size={14} aria-hidden="true" />
            {el ? 'Μενού' : 'Menu'}
          </button>
          <button
            type="button"
            onClick={() => setLanguage(el ? 'en' : 'el')}
            aria-label={el ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
            className="min-h-[40px] hover:text-ink/90 transition-colors"
          >
            {el ? 'English' : 'Ελληνικά'}
          </button>
          <button type="button" onClick={() => setInfoOpen(true)} className="min-h-[40px] hover:text-ink/90 transition-colors">
            {el ? 'Σχετικά' : 'About'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[10000] bg-zinc-800/90 border border-white/10 text-ink text-sm font-medium px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl whitespace-nowrap text-center max-w-[90vw] truncate"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {/* A floating glass bar (colour and a light edge, no blur: light on old phones). */}
      {!zenReading && (
      <div data-nosnippet className="glass fixed left-3 right-3 bottom-[calc(10px+env(safe-area-inset-bottom))] z-40 rounded-[26px] bg-[rgb(12_15_28/0.84)] desk:hidden">
        <div className="flex items-center justify-around px-1 py-1 max-w-md mx-auto">
          {mainNavItems.map((item) => {
            // Home lives at "/" ("/dashboard" only redirects there).
            const isActive = location.pathname === item.path
              || (item.path === '/dashboard' && location.pathname === '/')
              || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <motion.button
                key={item.path}
                onClick={() => handleNav(item.path)}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative py-2 px-2 rounded-[18px] flex-1 ${
                  isActive
                    ? 'text-sign-gold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                }`}
              >
                <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(230,194,126,0.45)]' : 'scale-100'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 font-sans ${isActive ? 'opacity-100 drop-shadow-md' : 'opacity-80'}`}>
                  {language === 'en' ? item.labelEn : item.labelEl}
                </span>
                
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-bg" 
                    className="absolute inset-0 rounded-[18px] bg-[var(--color-sign-gold)]/10 pointer-events-none" 
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
          
          
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ y: -2, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative py-2 px-2 rounded-[18px] flex-1 ${
              isOpen
                ? 'text-sign-gold bg-[var(--color-sign-gold)]/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
            }`}
          >
            <div className={`transition-all duration-300 relative z-10 ${isOpen ? 'scale-110 rotate-90 drop-shadow-[0_0_8px_rgba(230,194,126,0.45)]' : 'scale-100'}`}>
              <LayoutGrid size={18} />
            </div>
            <span className={`text-[10px] font-medium tracking-wide transition-all duration-300 font-sans ${isOpen ? 'opacity-100 drop-shadow-md' : 'opacity-80'}`}>
              {language === 'en' ? 'Menu' : 'Μενού'}
            </span>
          </motion.button>
        </div>
      </div>
      )}

      {/* Slide-Up / Slide-Over Menu for More Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0f1117]/70 backdrop-blur-sm z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              data-nosnippet
              className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] max-h-[85vh] desk:left-[260px] desk:right-auto desk:bottom-4 desk:mx-0 desk:rounded-[2rem] desk:border desk:border-white/10 bg-[#1a1d27]/98 backdrop-blur-2xl border-t border-white/10 z-[9999] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col rounded-t-[2rem]"
            >
              <div className="p-4 flex justify-between items-center border-b border-white/[0.08]">
                <span className="font-medium text-zinc-200 text-sm px-4">
                  {language === 'en' ? 'More Options' : 'Περισσότερα'}
                </span>
                <button
                  onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
                  aria-label={language === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
                  className="ml-auto mr-2 h-9 px-3 rounded-full border border-white/10 text-[12px] font-medium text-zinc-300 hover:bg-white/10 transition-colors"
                >
                  {language === 'el' ? 'English' : 'Ελληνικά'}
                </button>
                <button aria-label={language === 'en' ? 'Close' : 'Κλείσιμο'} 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-ink transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-[1] overflow-y-auto pt-6 px-6 pb-6 max-w-2xl mx-auto w-full flex flex-col gap-3">
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-4 flex flex-col gap-4">
                  
                  {/* Evidence-Based Science Link */}
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-400">
                        <Sparkles size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">
                          {language === 'en' ? 'Research Basis' : 'Επιστημονική Θεμελίωση'}
                        </span>
                        <span className="text-[10px] text-teal-400">
                          {language === 'en' ? 'Scientific references' : 'Επιστημονικές αναφορές'}
                        </span>
                      </div>
                     </div>
                     <button 
                       onClick={() => handleNav('/methodology')}
                       className="px-3 py-1.5 bg-teal-500/15 hover:bg-teal-500/25 rounded-lg text-xs font-medium text-teal-300 transition-colors"
                     >
                       {language === 'en' ? 'Science' : 'Επιστήμη'}
                     </button>
                  </div>
                  
                  <div className="w-full h-px bg-white/5 my-1" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.05] text-zinc-300">
                        {reduceMotion ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">
                          {language === 'en' ? 'Reduce Motion' : 'Μείωση Κίνησης'}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {language === 'en' ? 'Disable breathing animations' : 'Απενεργοποίηση εφέ αναπνοής'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={toggleReduceMotion}
                      role="switch"
                      aria-checked={reduceMotion}
                      aria-label={language === 'en' ? 'Reduce Motion' : 'Μείωση Κίνησης'}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 ${reduceMotion ? 'bg-amber-500' : 'bg-white/10'}`}
                    >
                      <span 
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>
                  </div>

                  {/* Reading: easy reading (also in Settings) */}
                  {[
                    { on: easyRead, toggle: toggleEasyRead, Icon: LetterText,
                      label: language === 'en' ? 'Easy reading' : 'Εύκολη ανάγνωση',
                      hint: language === 'en' ? 'Larger, with more space, no slanted text' : 'Μεγαλύτερα, με περισσότερο χώρο, χωρίς πλάγια' },
                  ].map(({ on, toggle, Icon, label, hint }) => (
                    <React.Fragment key={label}>
                      <div className="w-full h-px bg-white/5 my-1" />
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white/[0.05] text-zinc-300">
                            <Icon size={18} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-zinc-200">{label}</span>
                            <span className="text-[10px] text-zinc-400">{hint}</span>
                          </div>
                        </div>
                        <button
                          onClick={toggle}
                          role="switch"
                          aria-checked={on}
                          aria-label={label}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 ${on ? 'bg-amber-500' : 'bg-white/10'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
                  
                  <div className="w-full h-px bg-white/5 my-1"></div>
                  
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.05] text-zinc-300">
                        <Database size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">
                          {language === 'en' ? 'Your Data' : 'Τα Δεδομένα σας'}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {language === 'en' ? 'Save or restore progress' : 'Αποθήκευση ή επαναφορά προόδου'}
                        </span>
                      </div>
                     </div>
                     <div className="flex gap-2">
                       <button 
                         onClick={() => {
                           downloadBackup();
                           showToast(language === 'en' ? 'Data exported!' : 'Τα δεδομένα εξήχθησαν!');
                         }}
                         className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                       >
                         {language === 'en' ? 'Export' : 'Εξαγωγή'}
                       </button>
                       <label className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors cursor-pointer">
                         {language === 'en' ? 'Import' : 'Εισαγωγή'}
                         <input 
                           type="file" 
                           accept=".json"
                           className="hidden" 
                           onChange={(e) => {
                             const file = e.target.files?.[0];
                             if(!file) return;
                             const reader = new FileReader();
                             reader.onload = (event) => {
                               try {
                                 restoreBackup(event.target?.result as string);
                                 showToast(language === 'en' ? 'Data imported successfully!' : 'Τα δεδομένα εισήχθησαν!');
                                 setTimeout(() => window.location.reload(), 1500);
                                } catch(err) {
                                  showToast(language === 'en' ? 'Invalid backup file' : 'Άκυρο αρχείο αντιγράφου');
                                }
                              };
                              reader.readAsText(file);
                            }} 
                          />
                        </label>
                      </div>
                   </div>
                 </div>

                    <div className="w-full h-px bg-white/5 my-1"></div>

                    <div className="transition-all duration-300">
                      {!showResetConfirm ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-rose-500/15 text-rose-300">
                              <RotateCcw size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-200">
                                {language === 'en' ? 'Clear All Data (Testing)' : 'Επαναφορά Εφαρμογής'}
                              </span>
                              <span className="text-[10px] text-rose-400">
                                {language === 'en' ? 'Start from Day 1 onboarding' : 'Διαγραφή προόδου και έναρξη από την αρχή'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowResetConfirm(true)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-lg text-xs font-medium transition-colors"
                          >
                            {language === 'en' ? 'Reset' : 'Επαναφορά'}
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                          <span className="text-xs font-medium text-red-200">
                            {language === 'en' 
                              ? 'Are you sure? This will delete all your progress and history.' 
                              : 'Είστε σίγουροι; Αυτή η ενέργεια θα διαγράψει όλη την πρόοδο και το ιστορικό σας.'}
                          </span>
                          <div className="flex justify-end gap-2">
                             <button
                               onClick={() => setShowResetConfirm(false)}
                               className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-ink rounded text-xs font-medium transition-colors"
                             >
                               {language === 'en' ? 'Cancel' : 'Ακύρωση'}
                             </button>
                             <button
                               onClick={() => {
                                 localStorage.clear();
                                 window.location.hash = '';
                                 window.location.reload();
                               }}
                               className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-ink rounded text-xs font-medium transition-colors shadow-lg"
                             >
                               {language === 'en' ? 'Confirm Reset' : 'Επιβεβαίωση'}
                             </button>
                          </div>
                        </div>
                      )}
                    </div>

                {/* Download the Book */}
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-3xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-teal-500/20 text-teal-400">
                      <BookOpen size={18} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-medium text-teal-100">
                        {language === 'en' ? 'Download the Book' : 'Κατέβασε το βιβλίο'}
                      </span>
                      <span className="text-[10px] text-teal-400/80">
                        {language === 'en' ? 'Free · CC BY-NC-ND 4.0' : 'Δωρεάν · CC BY-NC-ND 4.0'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/workbook_${language}.epub`} download
                       className="flex-1 text-center px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-teal-100 transition-colors">
                      EPUB · Kindle
                    </a>
                    <a href={`/workbook_${language}.pdf`} download
                       className="flex-1 text-center px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-teal-100 transition-colors">
                      {language === 'en' ? 'PDF · Print' : 'PDF · Εκτύπωση'}
                    </a>
                  </div>
                  <a href={`/audio/mindfulness-guide-${language}.mp3`} download={`mindfulness-guide-${language}.mp3`}
                     className="mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-teal-100 transition-colors">
                    <Headphones size={13} aria-hidden="true" />
                    {language === 'en' ? 'Audiobook · MP3 · about 2 hours' : 'Ακουστικό βιβλίο · MP3 · περίπου 2½ ώρες'}
                  </a>
                </div>

                {/* Install: the page with the steps for every device, and the Microsoft Store */}
                <button 
                  onClick={() => handleNav('/install')}
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
              </div>

              <div className="flex justify-center gap-6 items-center p-6 border-t border-white/[0.08] mt-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                <button 
                  onClick={showInfo} 
                  title={language === 'el' ? 'Σχετικά' : 'About'}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-ink transition-colors border border-white/5"
                >
                  <Info size={20} />
                </button>
                <button 
                  onClick={() => toggleMaster()}
                  title={language === 'el' ? 'Μικτής' : 'Mixer'}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-ink transition-colors border border-white/5"
                >
                  {masterPlaying ? <Music size={20} className="text-teal-400" /> : <Music size={20} />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
}

