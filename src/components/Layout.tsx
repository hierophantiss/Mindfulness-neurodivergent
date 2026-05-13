import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import Companion from './Companion';
import NavigationMenu from './NavigationMenu';
import { useLanguage } from '../hooks/useLanguage';

import { InteractiveBackground } from './InteractiveBackground';

export default function Layout() {
  const { t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const mainRef = React.useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const isIntroPage = ['/', '/landing_info', '/intro'].includes(location.pathname);

  return (
    <div className="h-[100dvh] bg-pine-950 text-pine-100 font-sans selection:bg-teal-500/30 flex flex-col relative">
      <div className="noise-overlay" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 rounded-md z-50 shadow-lg">
        {t('skip_to_content')}
      </a>
      <InteractiveBackground />

      {/* Main Content Area */}
      <main id="main-content" ref={mainRef} className={cn(
         "flex-1 relative z-10 max-w-7xl mx-auto w-full flex flex-col overflow-y-auto overflow-x-hidden scroll-smooth",
         isHome ? "px-0 py-0" : "px-4 md:px-8 pt-safe pb-20 md:pb-24"
      )}>
        <Outlet />
      </main>

      {/* The Navigation Menu */}
      {!isHome && location.pathname !== '/landing_info' && <NavigationMenu />}

      {/* The Floating Companion */}
      {!isIntroPage && <Companion />}
    </div>
  );
}
