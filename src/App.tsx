import React, { useState, useEffect } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { CompanionProvider } from './hooks/useCompanion';
import Layout from './components/Layout';
import { InteractiveBackground } from './components/InteractiveBackground';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import ChapterDetail from './pages/ChapterDetail';
import Program from './pages/Program';
import ProgramWeek from './pages/ProgramWeek';
import Practice from './pages/Practice';
import PracticeMovement from './pages/PracticeMovement';
import PracticeMicrodoses from './pages/PracticeMicrodoses';
import PracticeBreath from './pages/PracticeBreath';
import PracticeSection from './components/PracticeSection';
import Journal from './pages/Journal';
import Faq from './pages/Faq';
import GenericExercise from './pages/GenericExercise';
import Method from './pages/Method';
import RabbitHole from './pages/RabbitHole';
import Onboarding from './pages/Onboarding';
import Sanctuary from './pages/Sanctuary';
import Settings from './pages/Settings';
import PrintWorkbook from './pages/PrintWorkbook';

import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { ThemeProvider } from './hooks/useTheme';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { TimeProvider } from './contexts/TimeContext';
import { RewardProvider } from './contexts/RewardContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';

function AppContent() {
  const isIframe = window.self !== window.top;
  const Router = isIframe ? HashRouter : BrowserRouter;
  const match = window.location.pathname.match(/^\/(en|el)/);
  const basename = match ? match[0] : '';
  
  return (
    <Router basename={basename}>
      <CompanionProvider>
        <InteractiveBackground />
        <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/workbook/print" element={<PrintWorkbook />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="method" element={<Method />} />
          <Route path="rabbithole" element={<RabbitHole />} />
          <Route path="chapters" element={<Chapters />} />
          <Route path="chapters/:id" element={<ChapterDetail />} />
          <Route path="program" element={<Program />} />
          <Route path="program/week/:weekId" element={<ProgramWeek />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/grounding" element={<PracticeSection />} />
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
      </CompanionProvider>
    </Router>
  );
}

export default function App() {
  return (
    <TimeProvider>
      <LanguageProvider>
        <ThemeProvider>
          <RewardProvider>
            <ProgressProvider>
              <AudioProvider>
                <AccessibilityProvider>
                  <AppContent />
                </AccessibilityProvider>
              </AudioProvider>
            </ProgressProvider>
          </RewardProvider>
        </ThemeProvider>
      </LanguageProvider>
    </TimeProvider>
  );
}
