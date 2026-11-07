import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { ErrorBoundary } from './components/ErrorBoundary';
import { reloadOnceForUpdate } from './lib/lazyWithReload';
import { setUpdater, markUpdateWaiting } from './lib/appUpdate';
import { listenForFirstTap } from './lib/sound';
import { applyReadingPrefs, readEasyRead } from './lib/readingPrefs';
import { keepDataOnDevice } from './lib/dataSafety';
import { installErrorLog } from './lib/errorLog';
import { isNative } from './lib/native';

// Errors are noted on this device only (Settings → Diagnostics).
installErrorLog();

// The reading settings apply before the first picture, so the text does not jump.
applyReadingPrefs(readEasyRead());

// A piece of the old version is gone after an update: load the new version (once).
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForUpdate()) event.preventDefault();
});

// Sound is allowed only after a tap: the first one wakes the audio engine, quietly.
listenForFirstTap();

// Inside the Android app the pages come from the phone itself: no service
// worker (nothing to cache), and updates come another way (lib/nativeUpdate.ts).
const native = isNative();

if (!native && 'serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    // A new version is ready: it waits for a calm moment (see appUpdate.ts).
    onNeedRefresh: markUpdateWaiting,
  });
  setUpdater(updateSW);
}

// Ask the browser to keep progress and journal (once there is something to
// keep), after the page has settled. See lib/dataSafety.ts.
window.addEventListener('load', () => {
  window.setTimeout(() => { void keepDataOnDevice(); }, 3000);
});

// The text already in the page is a plain version for search engines (see
// scripts/prerender.ts), not the app itself, so the app replaces it rather than
// taking it over (hydrating it would not match).
function render() {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}

if (native) {
  // A newer copy downloaded last time takes over first (the app reloads into it);
  // otherwise the app starts and looks for updates quietly.
  import('./lib/nativeUpdate')
    .then(({ switchToPending }) => switchToPending())
    .catch(() => false)
    .then((reloading) => {
      if (reloading) return;
      render();
      import('./lib/nativeApp').then(({ startNativeApp }) => startNativeApp()).catch(() => { /* the app works without it */ });
    });
} else {
  render();
}
