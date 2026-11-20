import { useEffect, useState } from 'react';
import { isNative } from '../lib/native';
import { canPromptInstall, onInstallPromptChange, promptInstall } from '../lib/installPrompt';

// The browser's install prompt is caught at start-up (lib/installPrompt.ts).
// This hook shares it, says whether a tap can open it (canPrompt), and whether
// the app is already running installed, so install links can hide themselves.

// The Android app counts as installed: it is.
const isStandaloneNow = () =>
  typeof window !== 'undefined' &&
  (isNative() || window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true);

export function useInstallApp(language: string) {
  const [installed, setInstalled] = useState(isStandaloneNow);
  const [canPrompt, setCanPrompt] = useState(canPromptInstall);

  useEffect(() => {
    const onInstalled = () => setInstalled(true);
    window.addEventListener('appinstalled', onInstalled);
    const off = onInstallPromptChange(() => setCanPrompt(canPromptInstall()));
    return () => {
      window.removeEventListener('appinstalled', onInstalled);
      off();
    };
  }, []);

  // Returns a short hint when the browser cannot show its own prompt.
  const install = async (): Promise<string | null> => {
    const el = language === 'el';
    const outcome = await promptInstall();
    if (outcome) {
      if (outcome === 'accepted') setInstalled(true);
      return null;
    }
    if (window.self !== window.top) {
      return el ? 'Άνοιξε την εφαρμογή σε νέα καρτέλα για να την εγκαταστήσεις.' : 'Open the app in a new tab to install it.';
    }
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      return el ? 'Πάτα «Κοινοποίηση» ⎋ και μετά «Προσθήκη στην οθόνη αφετηρίας».' : 'Tap “Share” ⎋, then “Add to Home Screen”.';
    }
    if (navigator.userAgent.includes('SamsungBrowser')) {
      return el ? 'Πάτα το βέλος λήψης στη γραμμή διεύθυνσης ή «Προσθήκη σελίδας σε» › «Αρχική οθόνη».' : 'Tap the download arrow in the address bar, or “Add page to” › “Home screen”.';
    }
    return el ? 'Πάτα τις τρεις τελείες του browser και μετά «Εγκατάσταση εφαρμογής».' : 'Tap the browser’s three dots, then “Install app”.';
  };

  return { installed, canPrompt, install };
}
