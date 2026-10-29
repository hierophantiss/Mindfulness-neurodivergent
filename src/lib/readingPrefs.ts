// Reading setting (Menu and Settings → Accessibility): "Easy reading". What
// helps reading, by the research, is space between letters, words and lines,
// a slightly larger size and upright letters — not a special "dyslexia font"
// (none has shown a benefit, and OpenDyslexic has no real Greek), so it stays
// our own font, with air. A class on <html>, styled in index.css, so it
// reaches every page.

export const EASY_READ_KEY = 'n_mindfulness_easy_read';
// The two older settings it replaces: whoever had either on, finds it on.
const OLD_KEYS = ['n_mindfulness_dyslexic_font', 'n_mindfulness_airy_text'];

export function readPref(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

export function savePref(key: string, on: boolean) {
  try {
    localStorage.setItem(key, String(on));
  } catch {
    // private mode: the setting lasts until the app closes
  }
}

/** "Easy reading" as saved, or on if one of the two older settings was on. */
export function readEasyRead(): boolean {
  try {
    const saved = localStorage.getItem(EASY_READ_KEY);
    if (saved !== null) return saved === 'true';
    const was = OLD_KEYS.some(k => localStorage.getItem(k) === 'true');
    OLD_KEYS.forEach(k => localStorage.removeItem(k));
    if (was) localStorage.setItem(EASY_READ_KEY, 'true');
    return was;
  } catch {
    return false;
  }
}

export function applyReadingPrefs(easyRead: boolean) {
  const c = document.documentElement.classList;
  c.toggle('text-easy', easyRead);
  // the classes of the older settings, if a page was left with them
  c.remove('font-dyslexic', 'text-airy');
}
