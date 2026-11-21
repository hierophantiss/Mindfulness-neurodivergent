import React, { useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { promptInstall } from '../lib/installPrompt';
import BackupDialog from './BackupDialogLazy';
import type { BackupMode } from './BackupDialog';
import { Home, BookOpen, Activity, X, Info, Music, LayoutGrid, EyeOff, Eye, Database, Download, Sparkles, Headphones, LetterText, Compass, Settings, Layers, BookA } from 'lucide-react';
import { MethodMark } from './MethodMark';
import { useTime } from '../contexts/TimeContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useAccessibility } from '../hooks/useAccessibility';
import { QuillIcon, SpiralIcon, SproutIcon, WavesIcon } from './placeIcons';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [backupMode, setBackupMode] = useState<BackupMode | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { reduceMotion, toggleReduceMotion, easyRead, toggleEasyRead } = useAccessibility();

  // The home page's "In the Menu" line opens it.
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-menu', open);
    return () => window.removeEventListener('open-menu', open);
  }, []);

  const handleInstallClick = async () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isIframe = window.self !== window.top;
    
    if (await promptInstall()) {
      // The browser's own install window opened (and closed).
    } else if (isIframe) {
       showToast(language === 'el'
         ? 'Άνοιξέ το σε νέο παράθυρο για εγκατάσταση.'
         : 'Open the app in a new tab to enable installation.');
    } else if (isIOS) {
      showToast(language === 'el' 
        ? 'Εγκατάσταση: πάτα «Κοινοποίηση» ⎋ και «Προσθήκη στην Οθόνη Αφετηρίας» ⊞.' 
        : 'Install Web App: Tap “Share” ⎋ and then “Add to Home Screen” ⊞.');
    } else {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      if (isStandalone) {
        showToast(language === 'el' ? 'Η εφαρμογή είναι ήδη εγκατεστημένη.' : 'The app is already installed.');
      } else {
        const isSamsungBrowser = navigator.userAgent.includes('SamsungBrowser');
        showToast(language === 'el' 
          ? isSamsungBrowser
             ? 'Samsung Internet: πάτα το εικονίδιο λήψης (βέλος) στη γραμμή διεύθυνσης ή «Προσθήκη σελίδας σε» > «Αρχική οθόνη» από το μενού.'
             : 'Εγκατάσταση: πάτα τις 3 τελείες (Μενού Chrome) και μετά «Εγκατάσταση εφαρμογής» ή «Προσθήκη στην αρχική οθόνη».' 
          : isSamsungBrowser
             ? 'Samsung Internet: Tap the download icon in URL bar or “Add page to” > “Home screen” from menu.'
             : 'Installation: Tap the 3 dots (Chrome Menu) and select “Install app”.');
      }
    }
  };

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };


  // Esc closes the open menu.
  // The open menu holds the keyboard's focus: Tab stays in it, Escape closes it.
  const panelRef = useFocusTrap(isOpen, () => setIsOpen(false));

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
    { path: '/chapters', icon: <BookOpen size={18} />, labelEn: 'Book', labelEl: 'Βιβλίο' },
    { path: '/practice', icon: <Activity size={18} />, labelEn: 'Practice', labelEl: 'Πρακτική' },
    { path: '/journal', icon: <QuillIcon size={18} />, labelEn: 'Journal', labelEl: 'Ημερολόγιο' },
  ];

  const el = language === 'el';
  const isActivePath = (path: string) =>
    path === '/' ? location.pathname === '/' || location.pathname === '/dashboard' : location.pathname.startsWith(path);
  // The computer's side bar: every place in the app, always in the same order.
  const sideItems = [
    { path: '/', Icon: Home, label: el ? 'Αρχική' : 'Home' },
    { path: '/chapters', Icon: BookOpen, label: el ? 'Βιβλίο' : 'Book' },
    { path: '/practice', Icon: Activity, label: el ? 'Πρακτική' : 'Practice' },
    { path: '/sanctuary', Icon: WavesIcon, label: el ? 'Καταφύγιο' : 'Sanctuary' },
    { path: '/program', Icon: SproutIcon, label: el ? 'Πρόγραμμα' : 'Program' },
    { path: '/journal', Icon: QuillIcon, label: el ? 'Ημερολόγιο' : 'Journal' },
    { path: '/cards', Icon: Layers, label: el ? 'Κάρτες' : 'Cards' },
    { path: '/rabbithole', Icon: SpiralIcon, label: el ? 'Κουνελότρυπα' : 'Rabbit Hole' },
    { path: '/method', Icon: Compass, label: el ? 'Η Μέθοδος' : 'The Method' },
    { path: '/glossary', Icon: BookA, label: el ? 'Γλωσσάρι' : 'Glossary' },
  ];
  const nightDim = hour >= 21 || hour < 5;

  return (
    <>
      {/* Computer: a side bar in place of the bottom bar. */}
      <nav data-nosnippet aria-label={el ? 'Κύρια πλοήγηση' : 'Main navigation'} className="hidden desk:flex fixed left-0 top-0 bottom-0 z-40 w-[248px] flex-col gap-1 px-[18px] pt-7 pb-5 bg-[rgb(8_10_20/0.42)] border-r border-white/[0.06] overflow-y-auto">
        <Link to="/" className="flex items-center gap-3 px-2 pb-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tint-blue-mark)]">
          <MethodMark small dim={nightDim} className="w-10 h-10 shrink-0" />
          <span className="flex flex-col gap-[3px] min-w-0">
            <span className="keep-font font-display text-[17px] leading-none text-sign-gold whitespace-nowrap">{el ? 'Ενσυνειδητότητα' : 'Mindfulness'}</span>
            <span className="text-[12.5px] leading-tight text-ink/70 [text-wrap:balance]">{el ? 'Για νου που τρέχει ή κλειδώνει' : 'For minds that race or lock in'}</span>
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
          <button type="button" onClick={() => setIsOpen(true)} aria-expanded={isOpen} className="flex items-center gap-1.5 min-h-[44px] hover:text-ink/90 transition-colors">
            <LayoutGrid size={14} aria-hidden="true" />
            {el ? 'Μενού' : 'Menu'}
          </button>
          <button
            type="button"
            onClick={() => setLanguage(el ? 'en' : 'el')}
            aria-label={el ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
            className="min-h-[44px] hover:text-ink/90 transition-colors"
          >
            {el ? 'English' : 'Ελληνικά'}
          </button>
          <Link to="/about" className="flex items-center min-h-[44px] hover:text-ink/90 transition-colors">
            {el ? 'Σχετικά' : 'About'}
          </Link>
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
      {/* A solid bar along the bottom edge: no text shows through it or around it. */}
      {!zenReading && (
      <div data-nosnippet className="fixed left-0 right-0 bottom-0 z-40 rounded-t-[22px] bg-[var(--color-surface)] border-t border-white/[0.09] shadow-[0_-14px_28px_-14px_rgb(0_0_0/0.7)] pt-1 pb-[calc(4px+env(safe-area-inset-bottom))] desk:hidden">
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
                    : 'text-ink/75 hover:text-ink hover:bg-white/[0.03]'
                }`}
              >
                <div className={`relative z-10 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(230,194,126,0.45)]' : 'scale-100'}`}>
                  {item.icon}
                </div>
                <span className={`text-[11px] font-medium transition-all duration-300 font-sans ${isActive ? 'drop-shadow-md' : ''}`}>
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
                : 'text-ink/75 hover:text-ink hover:bg-white/[0.03]'
            }`}
          >
            <div className={`transition-all duration-300 relative z-10 ${isOpen ? 'scale-110 rotate-90 drop-shadow-[0_0_8px_rgba(230,194,126,0.45)]' : 'scale-100'}`}>
              <LayoutGrid size={18} />
            </div>
            <span className={`text-[11px] font-medium transition-all duration-300 font-sans ${isOpen ? 'drop-shadow-md' : ''}`}>
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
              aria-hidden="true"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={language === 'en' ? 'More Options' : 'Περισσότερα'}
              data-nosnippet
              className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[480px] max-h-[85vh] short:max-h-[94dvh] desk:left-[260px] desk:right-auto desk:bottom-4 desk:mx-0 desk:rounded-[2rem] desk:border desk:border-white/10 bg-[#1a1d27]/98 backdrop-blur-2xl border-t border-white/10 z-[9999] shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col rounded-t-[2rem]"
            >
              <div className="p-4 short:py-2 flex justify-between items-center border-b border-white/[0.08]">
                <span className="font-medium text-zinc-200 text-sm px-4">
                  {language === 'en' ? 'More Options' : 'Περισσότερα'}
                </span>
                <button
                  onClick={() => setLanguage(language === 'el' ? 'en' : 'el')}
                  aria-label={language === 'el' ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
                  className="ml-auto mr-2 min-h-[44px] px-3 rounded-full border border-white/10 text-[12px] font-medium text-zinc-300 hover:bg-white/10 transition-colors"
                >
                  {language === 'el' ? 'English' : 'Ελληνικά'}
                </button>
                <button aria-label={language === 'en' ? 'Close' : 'Κλείσιμο'} 
                  onClick={() => setIsOpen(false)}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-ink transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-[1] overflow-y-auto pt-6 short:pt-3 px-6 pb-6 short:pb-3 max-w-2xl mx-auto w-full flex flex-col gap-3">
                {/* On the phone, the places the home page does not list (on a computer they are in the side bar). */}
                <nav aria-label={el ? 'Τόποι της εφαρμογής' : 'Places in the app'} className="grid grid-cols-2 gap-2.5 desk:hidden">
                  {sideItems.filter(i => ['/cards', '/method', '/glossary'].includes(i.path)).map(({ path, Icon, label }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 min-h-[56px] px-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] text-[14.5px] text-ink/90 hover:bg-white/[0.07] transition-colors [&:last-child:nth-child(odd)]:col-span-2"
                    >
                      <Icon size={19} aria-hidden="true" className="shrink-0 text-ink/75" />
                      {label}
                    </Link>
                  ))}
                </nav>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-4 flex flex-col gap-4">
                  
                  {/* The research: the same name as the page it opens, and in Settings. */}
                  <button
                    type="button"
                    onClick={() => handleNav('/methodology')}
                    className="flex items-center gap-3 min-h-[44px] text-left rounded-2xl hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-400">
                      <Sparkles size={18} aria-hidden="true" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-200">
                        {language === 'en' ? 'Evidence & Methodology' : 'Επιστημονική Θεμελίωση'}
                      </span>
                      <span className="text-[12px] text-teal-300">
                        {language === 'en' ? 'Scientific references' : 'Επιστημονικές αναφορές'}
                      </span>
                    </span>
                  </button>
                  
                  <div className="w-full h-px bg-white/5 my-1" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.05] text-zinc-300">
                        {reduceMotion ? <EyeOff size={18} /> : <Eye size={18} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">
                          {language === 'en' ? 'Reduce motion' : 'Μειωμένη κίνηση'}
                        </span>
                        <span className="text-[12px] text-zinc-400">
                          {language === 'en' ? 'Nothing moves; the breath shows as light' : 'Τίποτα δεν κινείται· η αναπνοή φαίνεται με φως'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={toggleReduceMotion}
                      role="switch"
                      aria-checked={reduceMotion}
                      aria-label={language === 'en' ? 'Reduce motion' : 'Μειωμένη κίνηση'}
                      className={`hit-44 relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 ${reduceMotion ? 'bg-amber-500' : 'bg-white/10'}`}
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
                            <span className="text-[12px] text-zinc-400">{hint}</span>
                          </div>
                        </div>
                        <button
                          onClick={toggle}
                          role="switch"
                          aria-checked={on}
                          aria-label={label}
                          className={`hit-44 relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-teal-400 ${on ? 'bg-amber-500' : 'bg-white/10'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    </React.Fragment>
                  ))}
                  
                  <div className="w-full h-px bg-white/5 my-1"></div>
                  
                  {/* A copy of the data: the same names as in Settings. (Deleting everything is in Settings only.) */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white/[0.05] text-zinc-300">
                        <Database size={18} aria-hidden="true" />
                      </div>
                      <span className="text-sm font-medium text-zinc-200">
                        {language === 'en' ? 'A copy of your data' : 'Αντίγραφο των δεδομένων σου'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBackupMode('save')}
                        className="min-h-[44px] px-3 bg-white/5 hover:bg-white/10 rounded-xl text-[13px] font-medium text-ink/90 transition-colors"
                      >
                        {language === 'en' ? 'Save a copy' : 'Αποθήκευση αντιγράφου'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setBackupMode('restore')}
                        className="min-h-[44px] px-3 bg-white/5 hover:bg-white/10 rounded-xl text-[13px] font-medium text-ink/90 transition-colors"
                      >
                        {language === 'en' ? 'Restore from a copy' : 'Επαναφορά από αντίγραφο'}
                      </button>
                    </div>
                  </div>
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
                      <span className="text-[12px] text-teal-300/90">
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
                          {language === 'en' ? 'Install the app' : 'Εγκατάσταση εφαρμογής'}
                        </span>
                        <span className="text-[12px] text-teal-300/90">
                          {language === 'en' ? 'Add to your home screen' : 'Προσθήκη στην αρχική οθόνη'}
                        </span>
                      </div>
                    </div>
                  </button>
              </div>

              {/* Help now: always here, in plain sight. */}
              <p className="mt-auto px-6 pb-4 short:pb-2 text-center text-[13px] leading-relaxed short:leading-snug text-ink/70 [&_a]:text-ink/90 [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-2">
                {language === 'el' ? (
                  <>Αν χρειάζεσαι βοήθεια τώρα: <a href="tel:112">112</a> για κίνδυνο, <a href="tel:1018">1018</a> (Κλίμακα) ή <a href="tel:197">197</a>, όλο το 24ωρο.</>
                ) : (
                  <>If you need help now: <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">findahelpline.com</a> lists free helplines in your country. In danger, your local emergency number (<a href="tel:112">112</a> in Europe).</>
                )}
              </p>

              {/* Settings, About and the Sanctuary's sounds: each with its name under it. */}
              <div className="flex justify-center gap-7 items-start px-6 pt-5 short:pt-3 border-t border-white/[0.08] pb-[calc(1.25rem+env(safe-area-inset-bottom))] short:pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                {[
                  { key: 'settings', label: language === 'el' ? 'Ρυθμίσεις' : 'Settings', onClick: () => handleNav('/settings'), icon: <Settings size={20} aria-hidden="true" /> },
                  { key: 'about', label: language === 'el' ? 'Σχετικά' : 'About', onClick: () => handleNav('/about'), icon: <Info size={20} aria-hidden="true" /> },
                  // The sounds live in the Sanctuary: this opens it (it never plays anything by itself).
                  { key: 'sounds', label: language === 'el' ? 'Ήχοι' : 'Sounds', onClick: () => handleNav('/sanctuary'), icon: <Music size={20} aria-hidden="true" /> },
                ].map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={b.onClick}
                    className="group flex flex-col items-center gap-1.5 min-w-[64px] text-zinc-300 hover:text-ink transition-colors"
                  >
                    <span className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 border border-white/5 transition-colors">
                      {b.icon}
                    </span>
                    <span className="text-[11px] text-ink/60 group-hover:text-ink/85">{b.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <BackupDialog mode={backupMode} onClose={() => setBackupMode(null)} />
    </>
  );
}

