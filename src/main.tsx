import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';

import './index.css';
import {initUISounds} from './lib/soundEffects';
import {registerSW} from 'virtual:pwa-register';

// Register PWA service worker with enhanced logging
registerSW({
  immediate: true,
  onRegistered(r) {
    console.log('PWA: Service Worker registered', r);
  },
  onRegisterError(error) {
    console.error('PWA: Service Worker registration failed', error);
  }
});

initUISounds();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

// Gracefully remove splash screen
const splash = document.getElementById('splash-screen');
const isPrerendering = navigator.userAgent.includes('jsdom') || window.__PRERENDER_INJECTED;

if (splash) {
  if (isPrerendering) {
    splash.remove();
    document.dispatchEvent(new Event('app-rendered'));
  } else {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.visibility = 'hidden';
      setTimeout(() => {
        if (splash.parentNode) splash.remove();
        document.dispatchEvent(new Event('app-rendered'));
      }, 800);
    }, 200); // slight delay to ensure first paint of App is ready
  }
} else {
  setTimeout(() => document.dispatchEvent(new Event('app-rendered')), 100);
}

// Failsafe: hide splash after 4 seconds regardless
if (!isPrerendering) {
  setTimeout(() => {
    const s = document.getElementById('splash-screen');
    if (s) {
      s.style.opacity = '0';
      s.style.visibility = 'hidden';
      setTimeout(() => {
        if (s.parentNode) s.remove();
      }, 800);
    }
  }, 4000);
}
