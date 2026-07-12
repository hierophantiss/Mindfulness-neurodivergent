import React, { Suspense } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CompanionProvider } from './hooks/useCompanion';
import Layout from './components/Layout';
import { InteractiveBackground } from './components/InteractiveBackground';
import Dashboard from './pages/Dashboard';

import { LanguageProvider } from './hooks/useLanguage';
import { ThemeProvider } from './hooks/useTheme';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { TimeProvider } from './contexts/TimeContext';
import { RewardProvider } from './contexts/RewardContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';
import { ActivityTrackerProvider } from './contexts/ActivityTrackerContext';

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

function AppContent() {
  const isIframe = window.self !== window.top;
  const Router = isIframe ? HashRouter : BrowserRouter;
  const match = window.location.pathname.match(/^\/(en|el)/);
  const basename = match ? match[0] : '';
  
  return (
    <Router basename={basename}>
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
