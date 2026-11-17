import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pageFailed, pageShown, resetAppHealth, startedWell } from './appHealth';

describe('did the app start well (before a new Android copy is kept)', () => {
  beforeEach(() => { vi.useFakeTimers(); resetAppHealth(); });
  afterEach(() => vi.useRealTimers());

  it('yes: a page showed and nothing broke for two seconds', async () => {
    const r = startedWell();
    pageShown();
    await vi.advanceTimersByTimeAsync(2100);
    await expect(r).resolves.toBe(true);
  });

  it('no: a page broke right after showing', async () => {
    const r = startedWell();
    pageShown();
    await vi.advanceTimersByTimeAsync(500);
    pageFailed();
    await vi.advanceTimersByTimeAsync(2000);
    await expect(r).resolves.toBe(false);
  });

  it('no: nothing showed in time (well before the updater gives up at 10 s)', async () => {
    const r = startedWell();
    await vi.advanceTimersByTimeAsync(7100);
    await expect(r).resolves.toBe(false);
  });
});
