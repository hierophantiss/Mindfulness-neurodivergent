import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { ErrorBoundary } from './components/ErrorBoundary';
import { reloadOnceForUpdate } from './lib/lazyWithReload';
import { setUpdater, markUpdateWaiting } from './lib/appUpdate';
import { listenForFirstTap } from './lib/sound';
import { applyReadingPrefs, readPref, DYSLEXIC_FONT_KEY, AIRY_TEXT_KEY } from './lib/readingPrefs';

// The reading settings apply before the first picture, so the text does not jump.
applyReadingPrefs(readPref(DYSLEXIC_FONT_KEY), readPref(AIRY_TEXT_KEY));

// A piece of the old version is gone after an update: load the new version (once).
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForUpdate()) event.preventDefault();
});

// Sound is allowed only after a tap: the first one wakes the audio engine, quietly.
listenForFirstTap();

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    // A new version is ready: it waits for a calm moment (see appUpdate.ts).
    onNeedRefresh: markUpdateWaiting,
  });
  setUpdater(updateSW);
}

// The text already in the page is a plain version for search engines (see
// scripts/prerender.ts), not the app itself, so the app replaces it rather than
// taking it over (hydrating it would not match).
const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
