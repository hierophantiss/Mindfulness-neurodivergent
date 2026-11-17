// Did this start of the app go well? The Android app confirms a newly
// installed copy to its updater only then (nativeUpdate.ts): a page shown,
// and no page broken in the first seconds. Otherwise the updater puts the
// previous copy back on the next start.

let shown = false;
let failed = false;
const waiting: Array<() => void> = [];

/** A page has been drawn (the page boundary mounted without an error). */
export function pageShown(): void {
  if (shown) return;
  shown = true;
  waiting.splice(0).forEach((f) => f());
}

/** A page broke (the page boundary caught an error). */
export function pageFailed(): void {
  failed = true;
}

/**
 * Resolves true once a page has shown and then `settleMs` passed without a
 * broken page; false if a page broke, or none showed within `maxMs`.
 */
export function startedWell(settleMs = 2000, maxMs = 7000): Promise<boolean> {
  return new Promise((resolve) => {
    const giveUp = window.setTimeout(() => resolve(false), maxMs);
    const settle = () => window.setTimeout(() => { window.clearTimeout(giveUp); resolve(!failed); }, settleMs);
    if (shown) settle(); else waiting.push(settle);
  });
}

/** For tests. */
export function resetAppHealth(): void { shown = false; failed = false; waiting.length = 0; }
