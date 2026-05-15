import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { CompanionProvider } from './hooks/useCompanion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chapters from './pages/Chapters';
import ChapterDetail from './pages/ChapterDetail';
import Program from './pages/Program';
import ProgramWeek from './pages/ProgramWeek';
import Practice from './pages/Practice';
import PracticeMovement from './pages/PracticeMovement';
import PracticeMicrodoses from './pages/PracticeMicrodoses';
import PracticeBreath from './pages/PracticeBreath';
import Journal from './pages/Journal';
import Faq from './pages/Faq';
import GenericExercise from './pages/GenericExercise';
import Method from './pages/Method';
import RabbitHole from './pages/RabbitHole';
import Onboarding from './pages/Onboarding';

import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { ThemeProvider } from './hooks/useTheme';
import { AccessibilityProvider } from './hooks/useAccessibility';
import { TimeProvider } from './contexts/TimeContext';
import { RewardProvider } from './contexts/RewardContext';

function AppContent() {
  return (
    <HashRouter>
      <CompanionProvider>
        <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="method" element={<Method />} />
          <Route path="rabbithole" element={<RabbitHole />} />
          <Route path="chapters" element={<Chapters />} />
          <Route path="chapters/:id" element={<ChapterDetail />} />
          <Route path="program" element={<Program />} />
          <Route path="program/week/:weekId" element={<ProgramWeek />} />
          <Route path="practice" element={<Practice />} />
          <Route path="practice/movement" element={<PracticeMovement />} />
          <Route path="practice/microdoses" element={<PracticeMicrodoses />} />
          <Route path="practice/breath/:id" element={<PracticeBreath />} />
          <Route path="practice/:category/:id" element={<GenericExercise />} />
          <Route path="journal" element={<Journal />} />
          <Route path="faq" element={<Faq />} />
        </Route>
        </Routes>
      </CompanionProvider>
    </HashRouter>
  );
}

export default function App() {
  return (
    <TimeProvider>
      <LanguageProvider>
        <ThemeProvider>
          <RewardProvider>
            <AccessibilityProvider>
              <AppContent />
            </AccessibilityProvider>
          </RewardProvider>
        </ThemeProvider>
      </LanguageProvider>
    </TimeProvider>
  );
}
