import React, { Suspense } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CompanionProvider } from './hooks/useCompanion';
import Layout from './components/Layout';

import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { ThemeProvider } from './hooks/useTheme';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { TimeProvider } from './contexts/TimeContext';
import { RewardProvider } from './contexts/RewardContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';
import { ActivityTrackerProvider } from './contexts/ActivityTrackerContext';

const InteractiveBackground = React.lazy(() => import('./components/InteractiveBackground').then(m => ({ default: m.InteractiveBackground })));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Chapters = React.lazy(() => import('./pages/Chapters'));
const ChapterDetail = React.lazy(() => import('./pages/ChapterDetail'));
const Program = React.lazy(() => import('./pages/Program'));
const ProgramWeek = React.lazy(() => import('./pages/ProgramWeek'));
const Practice = React.lazy(() => import('./pages/Practice'));
const PracticeMovement = React.lazy(() => import('./pages/PracticeMovement'));
const PracticeMicrodoses = React.lazy(() => import('./pages/PracticeMicrodoses'));
const PracticeBreath = React.lazy(() => import('./pages/PracticeBreath'));
const PracticeSection = React.lazy(() => import('./components/PracticeSection'));
const PracticeSwaying = React.lazy(() => import('./pages/PracticeSwaying'));
const Journal = React.lazy(() => import('./pages/Journal'));
const Faq = React.lazy(() => import('./pages/Faq'));
const GenericExercise = React.lazy(() => import('./pages/GenericExercise'));
const Method = React.lazy(() => import('./pages/Method'));
const Methodology = React.lazy(() => import('./pages/Methodology'));
const RabbitHole = React.lazy(() => import('./pages/RabbitHole'));
const Sanctuary = React.lazy(() => import('./pages/Sanctuary'));
const Settings = React.lazy(() => import('./pages/Settings'));
const PrintWorkbook = React.lazy(() => import('./pages/PrintWorkbook'));

const FallbackLoader = () => (
  <div role="status" aria-label="Loading" className="flex items-center justify-center min-h-[50vh] bg-transparent">
    <div className="w-3 h-3 rounded-full bg-indigo-400/50 animate-pulse"></div>
  </div>
);

/**
 * Keeps the /el or /en prefix of the address bar in step with the language
 * the person is reading. Switching language used to change only the text,
 * so a page read in Greek could still sit at /en/... and be shared (or
 * bookmarked) as the English version. Runs before the router renders, so the
 * router always starts from the corrected address.
 */
function syncLanguagePrefix(language: 'el' | 'en'): string {
  const { pathname, search, hash } = window.location;
  const match = pathname.match(/^\/(en|el)(?=\/|$)/);
  const isInstalledApp =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;

  // The bare root is the language-neutral entry (x-default) for search
  // engines; it only gets a prefix inside the installed app.
  if (!match && !(pathname === '/' && isInstalledApp)) return '';

  const rest = match ? pathname.slice(match[0].length) : '';
  const target = `/${language}${rest === '/' ? '' : rest}`;
  if (target !== pathname) {
    window.history.replaceState(window.history.state, '', `${target}${search}${hash}`);
  }
  return `/${language}`;
}

function AppContent() {
  const { language } = useLanguage();
  const isIframe = window.self !== window.top;
  const Router = isIframe ? HashRouter : BrowserRouter;
  const iframeMatch = isIframe ? window.location.pathname.match(/^\/(en|el)/) : null;
  const basename = isIframe ? (iframeMatch ? iframeMatch[0] : '') : syncLanguagePrefix(language);

  return (
    // A language switch changes the basename, which remounts the router so it
    // reads the corrected address. Saved progress reloads from storage.
    <Router key={basename} basename={basename}>
      <CompanionProvider>
        <InteractiveBackground />
        <Suspense fallback={<FallbackLoader />}>
        <Routes>
        <Route path="/workbook/print" element={<PrintWorkbook />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="method" element={<Method />} />
          <Route path="methodology" element={<Methodology />} />
          <Route path="rabbithole" element={<RabbitHole />} />
          <Route path="rabbithole/:articleId" element={<RabbitHole />} />
          <Route path="chapters" element={<Chapters />} />
          <Route path="chapters/:id" element={<ChapterDetail />} />
          <Route path="program" element={<Program />} />
          <Route path="program/week/:weekId" element={<ProgramWeek />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/grounding" element={<PracticeSection />} />
          <Route path="practice/swaying" element={<PracticeSwaying />} />
          <Route path="practice/movement" element={<PracticeMovement />} />
          <Route path="practice/microdoses" element={<PracticeMicrodoses />} />
          <Route path="practice/breath/:id" element={<PracticeBreath />} />
          <Route path="practice/:category/:id" element={<GenericExercise />} />
          <Route path="journal" element={<Journal />} />
          <Route path="sanctuary" element={<Sanctuary />} />
          <Route path="settings" element={<Settings />} />
          <Route path="faq" element={<Faq />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
        </Suspense>
      </CompanionProvider>
    </Router>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <TimeProvider>
        <LanguageProvider>
          <ThemeProvider>
            <RewardProvider>
              <ProgressProvider>
                <ActivityTrackerProvider>
                  <AudioProvider>
                    <AccessibilityProvider>
                      <AppContent />
                    </AccessibilityProvider>
                  </AudioProvider>
                </ActivityTrackerProvider>
              </ProgressProvider>
            </RewardProvider>
          </ThemeProvider>
        </LanguageProvider>
      </TimeProvider>
    </HelmetProvider>
  );
}
