import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import Companion from './Companion';
import NavigationMenu from './NavigationMenu';
import WelcomeModal from './WelcomeModal';
import { useLanguage } from '../hooks/useLanguage';

export default function Layout() {
  const { t } = useLanguage();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const mainRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('N_MINDFULNESS_SEEN_INTRO');
    if (!hasSeenIntro) {
      setShowWelcomeModal(true);
    }

    const showModalListener = () => {
      setShowWelcomeModal(true);
    };
    window.addEventListener('show-welcome-modal', showModalListener);
    return () => window.removeEventListener('show-welcome-modal', showModalListener);
  }, []);

  const handleCloseModal = () => {
    localStorage.setItem('N_MINDFULNESS_SEEN_INTRO', 'true');
    setShowWelcomeModal(false);
  };

  return (
    <div className="h-[100dvh] bg-pine-950 text-pine-100 font-sans selection:bg-teal-500/30 flex flex-col relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 rounded-md z-50 shadow-lg">
        {t('skip_to_content')}
      </a>
      {/* Background Atmosphere - Luminous Dark Theme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-gradient-to-b from-[#0a1e27] to-[#061114]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] opacity-60 mix-blend-screen" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-emerald-700/5 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      </div>

      {/* Main Content Area */}
      <main id="main-content" ref={mainRef} className={cn(
        "flex-1 relative z-10 max-w-7xl mx-auto w-full flex flex-col overflow-y-auto overflow-x-hidden",
        isHome ? "px-0 py-0" : "px-4 md:px-8 pt-safe pb-safe"
      )}>
        <Outlet />
      </main>

      {/* The Navigation Menu */}
      <NavigationMenu />

      {/* The Floating Companion */}
      <Companion />

      <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseModal} />
    </div>
  );
}
