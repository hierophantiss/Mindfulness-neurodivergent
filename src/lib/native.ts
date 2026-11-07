// Running inside the Android app (Capacitor) rather than a browser.
// Capacitor puts `window.Capacitor` in the page before it loads, so this needs
// no import: the website never loads any of the app's native code.

export const SITE = 'https://neurodivergent-mindfulness.org';

export const isNative = (): boolean =>
  typeof window !== 'undefined' && !!(window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.();

/**
 * A file the website serves itself (the chapters' audio through /audio/):
 * in the app the pages come from the phone, so these go to the site by its
 * full address. On the website the path stays as it is.
 */
export const remote = (path: string): string => (isNative() && path.startsWith('/') ? SITE + path : path);
