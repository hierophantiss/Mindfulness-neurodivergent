import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

import { initUISounds } from './lib/soundEffects';

initUISounds();
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Gracefully remove splash screen
const splash = document.getElementById('splash-screen');
if (splash) {
  setTimeout(() => {
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    setTimeout(() => splash.remove(), 800);
  }, 150); // slight delay to ensure first paint of App is ready
}
