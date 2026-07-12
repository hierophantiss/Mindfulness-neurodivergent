import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSmartSuggestion } from './useSmartSuggestion';

const mockLogs: any[] = [];
vi.mock('../contexts/ActivityTrackerContext', () => ({
  useActivityTracker: () => ({ logs: mockLogs }),
}));

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const log = (axis: string) =>
  ({ id: Math.random().toString(), timestamp: daysAgo(1), category: 'microdose', axis });
const setState = (state: string, minutesAgo = 5) =>
  localStorage.setItem('n_mindfulness_state',
    JSON.stringify({ state, ts: Date.now() - minutesAgo * 60000 }));

beforeEach(() => {
  mockLogs.length = 0;
  localStorage.clear();
});

describe('useSmartSuggestion', () => {
  it('returns nulls with no history and no state', () => {
    const { result } = renderHook(() => useSmartSuggestion());
    expect(result.current.axis).toBeNull();
    expect(result.current.mode).toBeNull();
  });

  it('hyper state restricts to body/breath', () => {
    setState('hyper');
    mockLogs.push(log('body'), log('body'), log('breath'), log('attention'));
    const { result } = renderHook(() => useSmartSuggestion());
    expect(['body', 'breath']).toContain(result.current.axis);
    expect(result.current.mode).toBe('state+history');
    // breath has lower score than body among allowed axes
    expect(result.current.axis).toBe('breath');
  });

  it('hypo state restricts to attention/space', () => {
    setState('hypo');
    mockLogs.push(log('attention'), log('attention'), log('space'), log('body'));
    const { result } = renderHook(() => useSmartSuggestion());
    expect(result.current.axis).toBe('space');
  });

  it('ignores state older than 90 minutes', () => {
    setState('hyper', 120);
    mockLogs.push(log('body'), log('breath'), log('attention'), log('space'), log('body'));
    const { result } = renderHook(() => useSmartSuggestion());
    expect(result.current.mode).toBe('history');
    expect(result.current.state).toBeNull();
  });

  it('survives corrupt localStorage without crashing', () => {
    localStorage.setItem('n_mindfulness_state', '{not-json!!');
    mockLogs.push(log('body'), log('breath'), log('attention'), log('space'), log('body'));
    const { result } = renderHook(() => useSmartSuggestion());
    expect(result.current.mode).toBe('history');
  });

  it('hyper suggestion prefers exercises of 60s or less', () => {
    setState('hyper');
    mockLogs.push(log('attention'), log('attention'), log('space'), log('space'));
    const { result } = renderHook(() => useSmartSuggestion());
    if (result.current.suggestion) {
      expect(result.current.suggestion.maxSeconds).toBeLessThanOrEqual(60);
    }
  });
});
