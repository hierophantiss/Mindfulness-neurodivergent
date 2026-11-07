// The breath's position, many times a second, for the figure only. Kept out
// of the page's state, so each frame redraws the figure and not the whole
// practice page (that made the movement stutter on phones).
import { useSyncExternalStore } from 'react';

export interface Tick { pos: number; prog: number }

export function createTickStore(initial: Tick = { pos: 0, prog: 0 }) {
  let now = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => now,
    set(pos: number, prog: number) {
      if (pos === now.pos && prog === now.prog) return;
      now = { pos, prog };
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => { listeners.delete(l); };
    },
  };
}

export type TickStore = ReturnType<typeof createTickStore>;

export function useTick(store: TickStore): Tick {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** Draws its children with the latest tick: only this part redraws each frame. */
export function LiveTick({ store, children }: { store: TickStore; children: (t: Tick) => React.ReactNode }) {
  return <>{children(useTick(store))}</>;
}
