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

// Give React 18 time to finish rendering, including initial skeleton loading states
setTimeout(() => {
  document.dispatchEvent(new Event('app-rendered'));
}, 1200);
