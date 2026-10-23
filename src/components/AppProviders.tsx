import React, { type ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { TimeProvider } from '../contexts/TimeContext';
import { LanguageProvider } from '../hooks/useLanguage';
import { ThemeProvider } from '../hooks/useTheme';
import { RewardProvider } from '../contexts/RewardContext';
import { ProgressProvider } from '../contexts/ProgressContext';
import { ActivityTrackerProvider } from '../contexts/ActivityTrackerContext';
import { AudioProvider } from '../contexts/AudioContext';
import { AccessibilityProvider } from '../hooks/useAccessibility';
import { CompanionProvider } from '../hooks/useCompanion';

type Provider = React.ComponentType<{ children: ReactNode }>;

/**
 * Everything the whole app shares, outermost first. None of them depends on
 * another, so the order only matters for reading; a new one goes in this list.
 * (The router sits inside, in App.tsx: it is remounted on a language switch,
 * and these keep their state through that.)
 */
const PROVIDERS: Provider[] = [
  HelmetProvider as Provider, // page titles and descriptions
  TimeProvider,               // time of day (greeting, sky)
  LanguageProvider,           // Greek / English
  ThemeProvider,
  RewardProvider,             // the soft bell when something is finished
  ProgressProvider,           // chapters finished, programme days done
  ActivityTrackerProvider,    // the record of practices (lib/activityLog.ts)
  AudioProvider,              // background sounds (lib/sound.ts engine)
  AccessibilityProvider,      // reduce motion
  CompanionProvider,          // the cat: where you read, programme day
];

export function AppProviders({ children }: { children: ReactNode }) {
  return <>{PROVIDERS.reduceRight<ReactNode>((inner, P) => <P>{inner}</P>, children)}</>;
}
