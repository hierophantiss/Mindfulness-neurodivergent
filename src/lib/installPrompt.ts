// The browser's offer to install the app (Chrome, Edge, Samsung Internet) comes
// once per page load, early, and only when the browser is willing (it waits
// until the visitor has spent a little time on the site). It is caught here at
// start-up, before any page is drawn, so an "Install" button anywhere can open
// the browser's own install window with one tap. Safari (iPhone, Mac) never
// sends it: there the way is "Share" → "Add to Home Screen".

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

type Win = Window & { initDeferredPrompt?: InstallPromptEvent | null };

const listeners = new Set<() => void>();
const changed = () => listeners.forEach(f => f());

export function catchInstallPrompt(): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('beforeinstallprompt', (e) => {
    // Keep it for our own button instead of the browser's banner.
    e.preventDefault();
    (window as Win).initDeferredPrompt = e as InstallPromptEvent;
    changed();
  });
  window.addEventListener('appinstalled', () => {
    (window as Win).initDeferredPrompt = null;
    changed();
  });
}

/** True when a tap can open the browser's own install window. */
export const canPromptInstall = (): boolean =>
  typeof window !== 'undefined' && !!(window as Win).initDeferredPrompt;

/** Called when the offer arrives, or the app has been installed. */
export function onInstallPromptChange(f: () => void): () => void {
  listeners.add(f);
  return () => { listeners.delete(f); };
}

/** Opens the browser's install window. "accepted", "dismissed", or null when there is none. */
export async function promptInstall(): Promise<'accepted' | 'dismissed' | null> {
  const ev = (window as Win).initDeferredPrompt;
  if (!ev) return null;
  // The offer can be used once.
  (window as Win).initDeferredPrompt = null;
  await ev.prompt();
  const { outcome } = await ev.userChoice;
  changed();
  return outcome;
}
