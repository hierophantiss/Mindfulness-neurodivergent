import React, { useEffect } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import Companion from './Companion';
import NavigationMenu from './NavigationMenu';
import DesktopNavigation from './DesktopNavigation';
import DesktopRightRail from './DesktopRightRail';
import CompanionSheet from './CompanionSheet';
import Onboarding from './Onboarding';
import OfflineNotification from './OfflineNotification';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';

export default function Layout() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const outlet = useOutlet();
  const mainRef = React.useRef<HTMLElement>(null);




  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  

  const isIntroPage = ['/landing_info', '/intro'].includes(location.pathname);
  const hideGlobalNavigation = location.pathname !== '/landing_info';

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-transparent text-pine-100 font-sans selection:bg-teal-500/30 flex flex-col relative overflow-hidden">
      <SEO />
      <div className="noise-overlay" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-white px-4 py-2 rounded-md z-50 shadow-lg">
        {t('skip_to_content')}
      </a>
      <OfflineNotification />

      <div className="flex flex-1 w-full max-w-[1700px] mx-auto overflow-hidden h-full">
        {/* Desktop Left Nav */}
        {hideGlobalNavigation && !isIntroPage && <DesktopNavigation />}

        {/* Main Content Area */}
        <main id="main-content" ref={mainRef} className={cn(
          "flex-1 relative z-10 w-full flex flex-col overflow-x-hidden scroll-smooth overflow-y-auto px-4 md:px-8 lg:px-12 pt-[env(safe-area-inset-top)] pb-[calc(100px+env(safe-area-inset-bottom))] lg:pb-12"
        )}>
          <div className="w-full max-w-2xl mx-auto h-full flex flex-col pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col flex-1 h-full w-full"
              >
                {/* React Router v6 useOutlet keeps the right context for the unmounting route. */}
                {outlet ? React.cloneElement(outlet as React.ReactElement, { key: location.pathname }) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Desktop Right Rail */}
        {hideGlobalNavigation && !isIntroPage && <DesktopRightRail />}
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden">
        {hideGlobalNavigation && <NavigationMenu />}
      </div>

      {/* The Floating Companion (Mobile only if we want, or universally if needed) */}
      <div className="lg:hidden">
        {!isIntroPage && !location.pathname.match(/^\/chapters\/\d+/) && <Companion />}
      </div>

      <CompanionSheet />
      <Onboarding />
    </div>
  );
}
