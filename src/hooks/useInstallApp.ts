import { useEffect, useState } from 'react';

// The browser's install prompt is caught once (NavigationMenu keeps it on
// window.initDeferredPrompt). This hook shares it, and tells whether the app
// is already running installed, so install links can hide themselves.

const isStandaloneNow = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true);

export function useInstallApp(language: string) {
  const [installed, setInstalled] = useState(isStandaloneNow);

  useEffect(() => {
    const onInstalled = () => setInstalled(true);
    const onPrompt = (e: any) => {
      e.preventDefault();
      (window as any).initDeferredPrompt = e;
    };
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => {
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('beforeinstallprompt', onPrompt);
    };
  }, []);

  // Returns a short hint when the browser cannot show its own prompt.
  const install = async (): Promise<string | null> => {
    const el = language === 'el';
    const promptEvent = (window as any).initDeferredPrompt;
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        (window as any).initDeferredPrompt = null;
        setInstalled(true);
      }
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

  return { installed, install };
}
