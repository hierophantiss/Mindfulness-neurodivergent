import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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
    <App />
  </StrictMode>,
);

// Gracefully remove splash screen
const splash = document.getElementById('splash-screen');
if (splash) {
  setTimeout(() => {
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    setTimeout(() => {
      if (splash.parentNode) splash.remove();
    }, 800);
  }, 200); // slight delay to ensure first paint of App is ready
}

// Failsafe: hide splash after 4 seconds regardless
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
