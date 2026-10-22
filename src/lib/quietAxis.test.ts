import { describe, it, expect } from 'vitest';
import type { ActivityContextData } from '../contexts/ActivityTrackerContext';
import { quietAxis } from './quietAxis';

const NOW = new Date('2026-10-22T12:00:00Z');
const log = (itemId: string, daysAgo: number, extra: Partial<ActivityContextData> = {}): ActivityContextData => ({
  id: itemId + daysAgo, itemId, category: 'microdose', completed: true, durationSeconds: 60,
  timestamp: new Date(NOW.getTime() - daysAgo * 86400000).toISOString(), ...extra,
});
// body, breath and attention, but no space, in the last two weeks
const noSpace = [log('axis-pause', 1), log('soft-belly', 2), log('breath-4-6', 3, { category: 'breath' }), log('anchor-7-sec', 4)];

describe('the quiet axis hint', () => {
  it('says nothing with too little to go on', () => {
    expect(quietAxis(noSpace.slice(0, 3), null, NOW)).toBeNull();
  });

  it('names the axis that has not come up, with a short practice of it', () => {
    const hint = quietAxis(noSpace, null, NOW)!;
    expect(hint.axis).toBe('space');
    expect(hint.practice.axis).toBe('space');
    expect(hint.practice.seconds).toBeLessThanOrEqual(300);
  });

  it('says nothing when every axis has come up', () => {
    expect(quietAxis([...noSpace, log('short-moment', 5)], null, NOW)).toBeNull();
  });

  it('only counts the last two weeks, and only practices (not reading)', () => {
    const old = [...noSpace, log('short-moment', 20), log('some-article', 1, { category: 'rabbithole', axis: 'space' })];
    expect(quietAxis(old, null, NOW)?.axis).toBe('space');
  });

  it('follows the method: after Tension never outwards, after Numbness never Space', () => {
    expect(quietAxis(noSpace, 'hyper', NOW)).toBeNull();
    expect(quietAxis(noSpace, 'hypo', NOW)).toBeNull();
    const noBody = [log('breath-4-6', 1, { category: 'breath' }), log('anchor-7-sec', 2), log('short-moment', 3), log('rhythm-5-5', 4)];
    expect(quietAxis(noBody, 'hyper', NOW)?.axis).toBe('body');
  });
});
