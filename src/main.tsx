import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { ErrorBoundary } from './components/ErrorBoundary';
import { reloadOnceForUpdate } from './lib/lazyWithReload';
import { setUpdater, markUpdateWaiting } from './lib/appUpdate';

// A piece of the old version is gone after an update: load the new version (once).
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForUpdate()) event.preventDefault();
});

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    // A new version is ready: it waits for a calm moment (see appUpdate.ts).
    onNeedRefresh: markUpdateWaiting,
  });
  setUpdater(updateSW);
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Fire app-rendered AFTER React has flushed to the DOM.
// giving react-helmet-async time to inject <title> and <meta> tags so the
// Puppeteer prerenderer captures the correct SEO metadata per route.
setTimeout(() => {
  document.dispatchEvent(new Event('app-rendered'));
}, 500);
