import React from 'react';

// Pages load in pieces whose names change with every new version of the site.
// Someone who still has the old version open asks for a piece that is gone;
// instead of a blank screen, the app reloads once and gets the new version.

const KEY = 'n_mindfulness_reloaded_for_update';
const WINDOW_MS = 30_000;

export function isChunkLoadError(err: unknown): boolean {
  const msg = String((err as Error)?.message || err || '');
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\w-]+ failed|ChunkLoadError|Unable to preload CSS/i.test(msg);
}

/** Reloads the page, but at most once in 30 seconds (so it can never loop). Returns whether it did. */
export function reloadOnceForUpdate(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < WINDOW_MS) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* no storage: still reload once for this page view */
  }
  window.location.reload();
  return true;
}

export function lazyWithReload<T extends React.ComponentType<any>>(load: () => Promise<{ default: T }>) {
  return React.lazy(() =>
    load().catch((err) => {
      if (isChunkLoadError(err) && reloadOnceForUpdate()) {
        // The page is reloading; keep the fallback on screen meanwhile.
        return new Promise<{ default: T }>(() => {});
      }
      throw err;
    }),
  );
}
