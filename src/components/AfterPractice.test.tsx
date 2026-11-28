import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../hooks/useAccessibility';
import AfterPractice from './AfterPractice';
import { beforeState } from '../data/afterPractice';

const show = (opts: { state?: unknown; path?: string; axis?: string; sos?: boolean; language?: string } = {}) => render(
  <MemoryRouter initialEntries={[{ pathname: opts.path ?? '/practice/breath/breath-5-5', state: opts.state }]}>
    <AccessibilityProvider>
      <AfterPractice axis={opts.axis ?? 'breath'} language={opts.language ?? 'el'} sos={opts.sos} helplines={<p>112</p>} onAgain={() => {}} />
    </AccessibilityProvider>
  </MemoryRouter>,
);

describe('«Πώς είσαι τώρα;» after a practice', () => {
  // Less motion on (as with the phone's setting): the answer appears without movement.
  beforeEach(() => { localStorage.clear(); localStorage.setItem('n_mindfulness_reduce_motion', 'true'); });
  afterEach(cleanup);

  it('asks with the four answers of the home check-in; without an answer the guide card stays', () => {
    show();
    const group = screen.getByRole('group', { name: 'Πώς είσαι τώρα;' });
    expect(within(group).getAllByRole('button').map(b => b.textContent)).toEqual(['Ένταση', 'Ηρεμία', 'Μούδιασμα', 'Δεν ξέρω']);
    expect(screen.getByText('Στον οδηγό')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Κεφάλαιο 2 · Αναπνοή/ }).getAttribute('href')).toBe('/chapters/2');
  });

  it('calm: the axis chapter at its section, to read or to listen, and nothing is kept', () => {
    show();
    const before = JSON.stringify({ ...localStorage });
    fireEvent.click(screen.getByRole('button', { name: 'Ηρεμία' }));
    expect(screen.getByRole('button', { name: 'Ηρεμία' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('status').textContent).toContain('Μοιάζει να υπάρχει ηρεμία.');
    expect(screen.getByRole('link', { name: /^Διάβασε: Κεφάλαιο 2 · Οι Τρεις Ρυθμοί/ }).getAttribute('href')).toBe('/chapters/2?s=3');
    expect(screen.getByRole('link', { name: /^Άκου: Κεφάλαιο 2/ }).getAttribute('href')).toBe('/chapters/2?s=3&listen=1');
    expect(screen.getByRole('link', { name: /Δες την κινούμενη εικόνα/ }).getAttribute('href')).toBe('/chapters/2?s=2&anim=1');
    expect(screen.getByRole('link', { name: 'Γράψε στο Ημερολόγιο' })).toBeTruthy();
    expect(screen.queryByText('Στον οδηγό')).toBeNull();
    expect(screen.queryByTestId('after-change')).toBeNull();
    expect(JSON.stringify({ ...localStorage })).toBe(before);
  });

  it('with the "before" from the home check-in: Before → Now, and self-regulation', () => {
    show({ state: beforeState('hyper') });
    fireEvent.click(screen.getByRole('button', { name: 'Ηρεμία' }));
    expect(screen.getByTestId('after-change').textContent).toBe('Πριν: Ένταση→, Τώρα: Ηρεμία');
    expect(within(screen.getByTestId('after-answer')).getByText('Αυτό που μόλις έγινε λέγεται αυτορρύθμιση.')).toBeTruthy();
  });

  it('tension after a breath practice: the body, SOS, and Chapter 8 for later', () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Ένταση' }));
    expect(screen.getByRole('link', { name: /Παράδοση στη Βαρύτητα/ }).getAttribute('href')).toBe('/practice/body/gravity-surrender');
    expect(screen.getByRole('link', { name: 'SOS' }).getAttribute('href')).toBe('/practice/breath/sos-breath');
    expect(screen.getByRole('link', { name: /Για αργότερα · Κεφάλαιο 8: Το Βαρόμετρο/ }).getAttribute('href')).toBe('/chapters/8?s=1');
  });

  it('a second tap on the same answer takes it back: the guide card returns', () => {
    show();
    fireEvent.click(screen.getByRole('button', { name: 'Δεν ξέρω' }));
    expect(screen.queryByText('Στον οδηγό')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Δεν ξέρω' }));
    expect(screen.getByText('Στον οδηγό')).toBeTruthy();
  });

  it('numbness after a Space practice: the drifting note first', () => {
    show({ axis: 'space', path: '/practice/space/soft-eyes', language: 'en' });
    fireEvent.click(screen.getByRole('button', { name: 'Numbness' }));
    expect(screen.getByRole('note', { name: /drifting away/ })).toBeTruthy();
    expect(screen.getByRole('link', { name: /^Listen: Chapter 6/ }).getAttribute('href')).toBe('/chapters/6?s=6&listen=1');
  });

  it('SOS, the light version: «Ακόμα ένταση» or «Πέρασε», no chapters now', () => {
    show({ sos: true, path: '/practice/breath/sos-breath' });
    const group = screen.getByRole('group', { name: 'Πώς είσαι τώρα;' });
    expect(within(group).getAllByRole('button').map(b => b.textContent)).toEqual(['Ακόμα ένταση', 'Πέρασε']);
    fireEvent.click(screen.getByRole('button', { name: 'Ακόμα ένταση' }));
    expect(screen.getByRole('button', { name: 'Ξανά' })).toBeTruthy();
    expect(screen.getByText('112')).toBeTruthy();
    expect(screen.queryByRole('link', { name: /Κεφάλαιο/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Πέρασε' }));
    expect(within(screen.getByTestId('after-answer')).getByText('Μετά το κύμα: νερό, φαγητό, ξεκούραση.')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Μετά το Κύμα/ }).getAttribute('href')).toBe('/chapters/8?s=5');
  });
});
