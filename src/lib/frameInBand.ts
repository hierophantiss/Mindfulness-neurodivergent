import { useSyncExternalStore } from 'react';

// Is an animation's window, right now, in the strip at the bottom of the
// screen where the "Listen" button floats? The animations have their own
// buttons down there (next, auto), and a button floating over them hides
// them. So each window reports itself here, and the "Listen" button steps
// aside while one is in the strip (ChapterReaderBar), then comes back.

let inBand = 0;
const listeners = new Set<() => void>();
const tell = () => listeners.forEach((f) => f());

/** Watches one window; returns the function that stops watching. */
export function watchFrame(el: Element): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  let inside = false;
  // The strip: the lowest quarter of the screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting === inside) return;
      inside = entry.isIntersecting;
      inBand += inside ? 1 : -1;
      tell();
    },
    { rootMargin: '-76% 0px 0px 0px' },
  );
  io.observe(el);
  return () => {
    io.disconnect();
    if (inside) {
      inBand -= 1;
      tell();
    }
  };
}

export function useFrameInBand(): boolean {
  return useSyncExternalStore(
    (f) => {
      listeners.add(f);
      return () => listeners.delete(f);
    },
    () => inBand > 0,
    () => false,
  );
}
