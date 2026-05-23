import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Dispatch the event that prerender.js is waiting for
setTimeout(() => {
  document.dispatchEvent(new Event('app-rendered'));
}, 500);
