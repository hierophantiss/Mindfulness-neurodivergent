import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAxisBalance } from './useAxisBalance';

const mockLogs: any[] = [];
vi.mock('../contexts/ActivityTrackerContext', () => ({
  useActivityTracker: () => ({ logs: mockLogs }),
}));

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
const log = (axis: string, category = 'microdose', days = 1) =>
  ({ id: Math.random().toString(), timestamp: daysAgo(days), category, axis });

beforeEach(() => { mockLogs.length = 0; });

describe('useAxisBalance', () => {
  it('returns null suggestion with fewer than 4 recent logs', () => {
    mockLogs.push(log('body'), log('breath'), log('attention'));
    const { result } = renderHook(() => useAxisBalance());
    expect(result.current.quietestAxis).toBeNull();
    expect(result.current.suggestion).toBeNull();
  });

  it('weights rabbithole/chapter logs at 0.5', () => {
    mockLogs.push(log('body'), log('body'), log('breath'), log('attention', 'rabbithole'));
    const { result } = renderHook(() => useAxisBalance());
    const dist = result.current.distribution as Record<string, number>;
    expect(dist.attention).toBe(0.5);
    expect(dist.body).toBe(2);
    expect(result.current.totalWeightedCount).toBe(3.5);
  });

  it('picks the axis with the lowest score as quietest', () => {
    mockLogs.push(log('body'), log('breath'), log('attention'), log('body'));
    const { result } = renderHook(() => useAxisBalance());
    expect(result.current.quietestAxis).toBe('space');
  });

  it('ignores logs older than 14 days', () => {
    mockLogs.push(log('body'), log('breath'), log('attention'), log('space', 'microdose', 20));
    const { result } = renderHook(() => useAxisBalance());
    // only 3 logs are recent -> below threshold
    expect(result.current.quietestAxis).toBeNull();
  });
});
