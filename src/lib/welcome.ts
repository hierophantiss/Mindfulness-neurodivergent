// The welcome (three short screens) never blocks the first visit: the home page
// shows a small card that opens them, until they are seen or put away.

const SEEN_KEY = 'onboarding_completed';

/** Has this device seen (or put away) the welcome? */
export function welcomeSeen(): boolean {
  try { return localStorage.getItem(SEEN_KEY) === 'true'; } catch { return true; }
}

/** The welcome was seen or put away: the home page's welcome card goes for good. */
export function markWelcomeSeen() {
  try {
    localStorage.setItem(SEEN_KEY, 'true');
    localStorage.setItem('hasCompletedOnboarding', 'true'); // older key
  } catch { /* private mode */ }
  window.dispatchEvent(new Event('welcome-seen'));
}

/** Open the welcome screens (Layout listens and loads them). */
export function openWelcome() {
  window.dispatchEvent(new Event('show-welcome-modal'));
}
