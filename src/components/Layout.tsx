import { useAccessibility } from '../hooks/useAccessibility';
import React, { useEffect } from 'react';
import { useOutlet, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import Companion from './Companion';
import NavigationMenu from './NavigationMenu';
import OfflineNotification from './OfflineNotification';
import { useLanguage } from '../hooks/useLanguage';
import { motion, AnimatePresence } from 'motion/react';
import { SEO } from './SEO';
import { ErrorBoundary } from './ErrorBoundary';
import { isUpdateWaiting, applyWaitingUpdate } from '../lib/appUpdate';
import { lazyWithReload } from '../lib/lazyWithReload';
import { useCompanion } from '../hooks/useCompanion';

// The cat's sheet needs the text of every chapter, so it loads only once it is
// first opened (and quietly in the background once the page has settled).
const loadSheet = () => import('./CompanionSheet');
const CompanionSheet = lazyWithReload(loadSheet);
// The welcome screens load only when someone opens them (home card or the cat).
const Onboarding = lazyWithReload(() => import('./Onboarding'));

export default function Layout() {
    const { reduceMotion } = useAccessibility();
  

  const { t, language } = useLanguage();
  const location = useLocation();
  const outlet = useOutlet();
  const { sheetVisible } = useCompanion();
  const [sheetWanted, setSheetWanted] = React.useState(false);
  const [welcomeOpen, setWelcomeOpen] = React.useState(false);
  useEffect(() => {
    const open = () => setWelcomeOpen(true);
    window.addEventListener('show-welcome-modal', open);
    return () => window.removeEventListener('show-welcome-modal', open);
  }, []);
  useEffect(() => { if (sheetVisible) setSheetWanted(true); }, [sheetVisible]);
  const mainRef = React.useRef<HTMLElement>(null);




  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Back on the home page is a calm moment to load a new version, if one waits.
  useEffect(() => {
    if (location.pathname === '/' && isUpdateWaiting()) applyWaitingUpdate();
  }, [location.pathname]);

  

  const isIntroPage = ['/landing_info', '/intro'].includes(location.pathname);
  // On a computer: a practice gets a wider stage, a chapter a slightly wider reading column.
  const isBreathPlayer = /^\/practice\/breath\//.test(location.pathname);
  const isWidePractice = isBreathPlayer || /^\/practice\/(swaying|grounding)/.test(location.pathname);
  const isReading = /^\/chapters\/\d+/.test(location.pathname);
  const hideGlobalNavigation = location.pathname !== '/landing_info';
  // On a computer the side bar is on the left and the page fills the rest:
  // home and practice lists in a wide grid, a chapter with its contents beside
  // it, every other page in a comfortable column (lines never get too long).
  const isWideDesk = location.pathname === '/' || /^\/practice(\/microdoses)?\/?$/.test(location.pathname);

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-transparent text-pine-100 font-sans selection:bg-teal-500/30 flex flex-col relative overflow-hidden">
      <SEO />
      <div className="noise-overlay" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-500 text-ink px-4 py-2 rounded-md z-50 shadow-lg">
        {t('skip_to_content')}
      </a>
      <OfflineNotification />
      {/* On a computer the breathing practice fills the whole screen with its dark, not a box in the middle */}
      {isBreathPlayer && <div className="hidden desk:block fixed inset-0 bg-[#061114] pointer-events-none" />}

      <div className={cn("flex flex-1 w-full max-w-[1700px] mx-auto overflow-hidden h-full", hideGlobalNavigation && "desk:max-w-none desk:pl-[248px]")}>
        {/* Main Content Area */}
        <main id="main-content" ref={mainRef} className={cn(
          "flex-1 relative z-10 w-full flex flex-col overflow-x-hidden scroll-smooth overflow-y-auto px-4 desk:px-14 pt-[env(safe-area-inset-top)] desk:pt-6 pb-[calc(160px+env(safe-area-inset-bottom))] desk:pb-20"
        )}>
          {/* min-h-full, not h-full: a page taller than the screen must grow this box,
              so the space kept below it for the bottom bar comes after the last line. */}
          <div className={cn("w-full max-w-[480px] mx-auto min-h-full shrink-0 flex flex-col pt-4 desk:max-w-[760px]", isWidePractice && "desk:max-w-[900px]", isWideDesk && "desk:max-w-[1120px]", isReading && "desk:max-w-[1260px]")}>
            {/* initial={false}: the first page of a visit is there at once; the fade is only between pages. */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={reduceMotion ? { duration: 0.01 } : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col flex-1 w-full"
              >
                {/* React Router v6 useOutlet keeps the right context for the unmounting route. */}
                <ErrorBoundary resetKey={location.pathname}>
                  {outlet ? React.cloneElement(outlet as React.ReactElement, { key: location.pathname }) : null}
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden">
        {hideGlobalNavigation && <NavigationMenu />}
      </div>

      {/* The Floating Companion (Mobile only if we want, or universally if needed) */}
      <div className="lg:hidden">
        {/* On the home page the cat lives inside the "Continue" card instead */}
        {!isIntroPage && location.pathname !== '/' && !location.pathname.match(/^\/(chapters\/\d+|practice\/breath\/)/) && <Companion />}
      </div>


      {(sheetWanted || sheetVisible) && (
        <React.Suspense fallback={null}>
          <CompanionSheet />
        </React.Suspense>
      )}
      {welcomeOpen && (
        <React.Suspense fallback={null}>
          <Onboarding onClose={() => setWelcomeOpen(false)} />
        </React.Suspense>
      )}
    </div>
  );
}
