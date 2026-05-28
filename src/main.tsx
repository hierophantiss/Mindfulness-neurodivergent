import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Fire app-rendered AFTER React has flushed to the DOM.
// giving react-helmet-async time to inject <title> and <meta> tags so the
// Puppeteer prerenderer captures the correct SEO metadata per route.
setTimeout(() => {
  document.dispatchEvent(new Event('app-rendered'));
}, 500);
