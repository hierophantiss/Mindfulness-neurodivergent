import { describe, expect, it, vi } from 'vitest';
import { createTickStore } from './breathTick';

describe('createTickStore', () => {
  it('tells its listeners only when the breath has moved', () => {
    const s = createTickStore();
    const l = vi.fn();
    const off = s.subscribe(l);
    s.set(0.5, 0.2);
    s.set(0.5, 0.2);
    expect(l).toHaveBeenCalledTimes(1);
    expect(s.get()).toEqual({ pos: 0.5, prog: 0.2 });
    off();
    s.set(0.6, 0.3);
    expect(l).toHaveBeenCalledTimes(1);
  });
});
