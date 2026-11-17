import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AccessibilityProvider } from '../hooks/useAccessibility';
import { LanguageProvider } from '../hooks/useLanguage';
import MotionGate from './MotionGate';

const show = () => render(
  <LanguageProvider><AccessibilityProvider>
    <MotionGate><iframe title="the animation" /></MotionGate>
  </AccessibilityProvider></LanguageProvider>,
);

describe('an animation page (iframe) and "less motion"', () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  it('plays at once when less motion is off', () => {
    localStorage.setItem('n_mindfulness_reduce_motion', 'false');
    show();
    expect(screen.getByTitle('the animation')).toBeTruthy();
  });

  it('waits for a tap when it is on', () => {
    localStorage.setItem('n_mindfulness_reduce_motion', 'true');
    show();
    expect(screen.queryByTitle('the animation')).toBeNull();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTitle('the animation')).toBeTruthy();
  });
});
