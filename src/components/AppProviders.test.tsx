import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { AppProviders } from './AppProviders';
import { useLanguage } from '../hooks/useLanguage';
import { useTime } from '../contexts/TimeContext';
import { useTheme } from '../hooks/useTheme';
import { useReward } from '../contexts/RewardContext';
import { useProgress } from '../contexts/ProgressContext';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useAudioMixer } from '../contexts/AudioContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { useCompanion } from '../hooks/useCompanion';

// Every shared piece of the app is reachable from inside AppProviders
// (each hook throws if its provider is missing).
function UsesEverything() {
  useLanguage(); useTime(); useTheme(); useReward(); useProgress();
  useActivityTracker(); useAudioMixer(); useAccessibility(); useCompanion();
  return <p>ok</p>;
}

describe('AppProviders', () => {
  // jsdom has no matchMedia (the accessibility settings read it).
  window.matchMedia ??= ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  it('provides everything the app shares', () => {
    const { getByText } = render(<AppProviders><UsesEverything /></AppProviders>);
    expect(getByText('ok')).toBeTruthy();
  });
});
