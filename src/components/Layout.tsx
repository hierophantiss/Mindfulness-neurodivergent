import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import Companion from './Companion';
import NavigationMenu from './NavigationMenu';
import OfflineNotification from './OfflineNotification';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  const { t } = useLanguage();
  const location = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);

  const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding') === 'true';

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  const isIntroPage = ['/landing_info', '/intro'].includes(location.pathname);

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-transparent text-pine-100 font-sans selection:bg-teal-500/30 flex flex-col relative overflow-hidden">
      <div className="noise-overlay" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 rounded-md z-50 shadow-lg">
        {t('skip_to_content')}
      </a>
      <OfflineNotification />

      {/* Main Content Area */}
      <main id="main-content" ref={mainRef} className={cn(
         "flex-1 relative z-10 max-w-7xl mx-auto w-full flex flex-col overflow-x-hidden scroll-smooth overflow-y-auto px-4 md:px-8 pt-[env(safe-area-inset-top)] pb-[calc(100px+env(safe-area-inset-bottom))] md:pb-24"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col flex-1 h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* The Navigation Menu */}
      {location.pathname !== '/landing_info' && <NavigationMenu />}

      {/* The Floating Companion */}
      {!isIntroPage && <Companion />}
    </div>
  );
}
