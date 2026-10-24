// Reading settings (Settings → Accessibility): a dyslexia-friendly font and
// airier text. Both are classes on <html>, styled in index.css, so they reach
// every page. The font (about 120 KB a weight) downloads only once someone
// turns it on.

export const DYSLEXIC_FONT_KEY = 'n_mindfulness_dyslexic_font';
export const AIRY_TEXT_KEY = 'n_mindfulness_airy_text';

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

let fontLoading: Promise<unknown> | null = null;
function loadDyslexicFont() {
  if (!fontLoading) {
    fontLoading = import('../opendyslexic.css').catch(() => { fontLoading = null; });
  }
  return fontLoading;
}

export function applyReadingPrefs(dyslexicFont: boolean, airyText: boolean) {
  const c = document.documentElement.classList;
  c.toggle('font-dyslexic', dyslexicFont);
  c.toggle('text-airy', airyText);
  if (dyslexicFont) void loadDyslexicFont();
}
