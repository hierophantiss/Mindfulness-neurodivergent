import React, { useState, useEffect } from 'react';
import { Music, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import HeroMeditator from '../components/HeroMeditator';
import { useCompanion } from '../hooks/useCompanion';

export default function Home() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { companionData } = useCompanion();
  
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert(language === 'el' ? 'Η εφαρμογή είναι ήδη εγκατεστημένη ή δεν υποστηρίζεται σε αυτόν τον περιηγητή.' : 'The app is already installed or not supported in this browser.');
    }
  };

  const handleMusicClick = () => {
    alert(language === 'el' ? 'Μουσική επένδυση θα προστεθεί σε επόμενη έκδοση!' : 'Background music will be added in a future update!');
  };

  const handleNotificationsClick = () => {
    alert(language === 'el' ? 'Οι ειδοποιήσεις υπενθύμισης έρχονται σύντομα!' : 'Reminder notifications are coming soon!');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-full animate-in fade-in slide-in-from-bottom-4 duration-500 lg:p-6 lg:gap-8 lg:items-stretch">
      
      {/* Hero Banner */}
      <section 
        className="relative flex-none h-[32vh] lg:h-auto lg:flex-1 lg:min-h-[500px] lg:mb-0 overflow-hidden rounded-[1.75rem] rounded-t-none lg:rounded-[2.5rem] bg-[#0a1a2f] border-b lg:border border-pine-800 shadow-[0_8px_30px_rgb(0,0,0,0.3)]"
      >
        <img src="/hero.webp" alt="Cosmic Background" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <HeroMeditator mode="idle" className="absolute inset-0 w-full h-full object-cover" language={language} />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-900/40 to-transparent mix-blend-multiply flex flex-col justify-end p-6" />
        
        {/* Top left action buttons */}
        <div className="absolute top-[60px] left-4 flex flex-col gap-3 z-20">
          <button onClick={handleMusicClick} className="w-9 h-9 rounded-full bg-pine-950/40 border border-pine-700/30 flex items-center justify-center backdrop-blur-md text-pine-300 hover:text-white transition-colors">
             <Music size={16} strokeWidth={2} />
          </button>
          <button onClick={handleNotificationsClick} className="w-9 h-9 rounded-full bg-pine-950/40 border border-pine-700/30 flex items-center justify-center backdrop-blur-md text-amber-400/80 hover:text-amber-400 transition-colors">
            <Bell size={16} strokeWidth={2} />
          </button>
        </div>



      </section>

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:flex lg:flex-col lg:justify-center lg:items-center">
        <div className="flex flex-col gap-2 px-4 lg:px-0 pb-safe mb-1 mt-3 lg:mb-0 lg:mt-0 w-full lg:max-w-xl">

          <p className="text-center text-pine-300/90 text-[13px] md:text-sm font-medium italic mb-1 tracking-wide">
            {language === 'el' ? '«Ο νους σου δεν είναι χαλασμένος, απλά λειτουργεί διαφορετικά.»' : '«Your mind is not broken, it simply functions differently.»'}
          </p>

          {/* SOS Card - Top Priority */}
          <div 
            onClick={() => navigate('/practice/breath')}
            className="group block w-full relative bg-gradient-to-br from-pine-800/60 to-pine-900/90 shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-pine-600/40 p-4 rounded-[1.5rem] text-left transition-all overflow-hidden active:scale-[0.98] hover:shadow-[0_16px_40px_rgba(20,184,166,0.15)] hover:border-teal-500/30 mb-2 cursor-pointer backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]"></div>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/practice/breath/sos-breath'); }}
              className="absolute top-4 right-4 bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm hover:bg-teal-500/30 active:bg-teal-500/40 z-20 cursor-pointer backdrop-blur-sm transition-colors"
            >
              SOS
            </button>
            <div className="flex items-center gap-4 relative z-10">
              <div className="text-[36px] shrink-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 pl-1">
                🫁
              </div>
              <div>
                <h3 className="text-[17px] font-heading font-medium text-white mb-1 drop-shadow-sm leading-tight group-hover:text-teal-50 transition-colors">{t('home.needCalm')}</h3>
                <p className="text-pine-300 flex-1 text-[13px] opacity-90 drop-shadow-sm leading-snug">{t('home.needCalmSub')}</p>
              </div>
            </div>
          </div>
          
          {/* Two Columns for Learn and Practice */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <Link to="/chapters" className="group relative bg-gradient-to-b from-pine-800/50 to-pine-900/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)] border border-pine-600/40 py-4 px-3 rounded-[1.5rem] text-center transition-all overflow-hidden flex flex-col items-center justify-center gap-2 active:scale-[0.97] hover:shadow-[0_12px_30px_rgba(20,184,166,0.1)] hover:border-teal-500/20 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-[32px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] leading-none transform group-hover:-translate-y-1 transition-transform duration-500">
                📖
              </div>
              <div className="relative z-10">
                <h3 className="text-[14px] font-heading font-medium text-white mb-0.5 drop-shadow-sm">{t('home.read')}</h3>
                <p className="text-pine-300/90 text-[11px] leading-snug tracking-wide drop-shadow-sm">{t('home.readSub').split(' & ').join(' &\n')}</p>
              </div>
            </Link>

            <Link to="/practice" className="group relative bg-gradient-to-b from-pine-800/50 to-pine-900/80 shadow-[0_8px_20px_rgba(0,0,0,0.2)] border border-pine-600/40 py-4 px-3 rounded-[1.5rem] text-center transition-all overflow-hidden flex flex-col items-center justify-center gap-2 active:scale-[0.97] hover:shadow-[0_12px_30px_rgba(20,184,166,0.1)] hover:border-teal-500/20 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-[32px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] leading-none transform group-hover:-translate-y-1 transition-transform duration-500">
                🎯
              </div>
              <div className="relative z-10">
                <h3 className="text-[14px] font-heading font-medium text-white mb-0.5 drop-shadow-sm">{t('home.practice')}</h3>
                <p className="text-pine-300/90 text-[11px] leading-snug tracking-wide drop-shadow-sm">{t('home.practiceSub').split(' & ').join(' &\n')}</p>
              </div>
            </Link>
          </div>

          {/* Special Interest & Tracking */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Link 
              to="/rabbithole" 
              className="group block relative bg-gradient-to-bl from-pine-800/60 to-pine-900/80 shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-pine-600/40 p-4 rounded-[1.5rem] text-left transition-all overflow-hidden active:scale-[0.98] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:border-pine-500/40 flex flex-col justify-center items-center text-center h-[90px] backdrop-blur-md"
            >
              <div className="text-[30px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] mb-2 transform group-hover:-translate-y-1 transition-transform duration-500 leading-none flex items-center gap-1 justify-center">
                <span>🐇</span><span className="text-[22px]">🕳️</span>
              </div>
              <div className="relative z-10 w-full">
                <h3 className="text-[14px] font-heading font-medium text-white mb-1 drop-shadow-sm leading-tight">{t('home.rabbitHole')}</h3>
                <p className="text-pine-300/80 text-[10px] uppercase tracking-[0.15em] drop-shadow-sm truncate">{t('home.rabbitHoleSub')}</p>
              </div>
            </Link>

            <Link 
              to="/journal" 
              className="group block relative bg-gradient-to-br from-pine-800/60 to-pine-900/80 shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-pine-600/40 p-4 rounded-[1.5rem] text-left transition-all overflow-hidden active:scale-[0.98] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:border-pine-500/40 flex flex-col justify-center items-center text-center h-[90px] backdrop-blur-md"
            >
              <div className="text-[30px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] mb-2 transform group-hover:-translate-y-1 transition-transform duration-500 leading-none">
                📝
              </div>
              <div className="relative z-10 w-full">
                <h3 className="text-[14px] font-heading font-medium text-white mb-1 drop-shadow-sm leading-tight">{language === 'el' ? 'Ημερολόγιο' : 'Journal'}</h3>
                <p className="text-pine-300/80 text-[10px] uppercase tracking-[0.15em] drop-shadow-sm truncate">{language === 'el' ? 'ΙΣΤΟΡΙΚΟ & ΠΕΡΑΣΜΑΤΑ' : 'HISTORY & ENTRIES'}</p>
              </div>
            </Link>
          </div>

          {/* Two Columns for Downloads/Install */}
          <div className="grid grid-cols-2 gap-3">
            <a href={language === 'en' ? "/workbook_en.pdf" : "/workbook_el.pdf"} download className="group relative bg-pine-800/40 shadow-sm border border-pine-600/30 hover:bg-pine-700/60 backdrop-blur-md py-3 px-3 rounded-[1.25rem] text-center transition-all overflow-hidden flex flex-row items-center justify-center gap-3 active:scale-[0.97] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
               <div className="text-[22px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-none transform group-hover:scale-110 transition-transform duration-500">
                📥
              </div>
              <div className="text-left relative z-10">
                <h3 className="text-[12px] font-heading font-medium text-pine-100 mb-0.5 tracking-wide drop-shadow-sm">{t('home.downloadPdfTitle')}</h3>
              </div>
            </a>

            <button onClick={handleInstallClick} className="group relative bg-pine-800/40 shadow-sm border border-pine-600/30 hover:bg-pine-700/60 backdrop-blur-md py-3 px-3 rounded-[1.25rem] text-center transition-all overflow-hidden flex flex-row items-center justify-center gap-3 active:scale-[0.97] hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)]">
              <div className="text-[22px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] leading-none transform group-hover:scale-110 transition-transform duration-500">
                📱
              </div>
              <div className="text-left relative z-10">
                <h3 className="text-[12px] font-heading font-medium text-pine-100 mb-0.5 tracking-wide drop-shadow-sm">{t('home.installAppTitle')}</h3>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
