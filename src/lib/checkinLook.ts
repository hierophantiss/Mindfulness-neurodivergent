// How the four answers to "How do you feel?" look, wherever they appear
// (the home page and the Journal): one soft pastel and one line icon each.
import type { CheckinChoice } from '../data/stateCheckin';

// Tension a warm dusty rose, numbness lavender, calm sage, not sure sand
// (the --tint-* colours in index.css).
const TINT: Record<CheckinChoice, string> = { hyper: 'rose', hypo: 'lav', balanced: 'sage', unsure: 'sand' };
export const tint = (id: CheckinChoice, part: 'bg' | 'hi' | 'line' | 'dot') => `var(--tint-${TINT[id]}-${part})`;

// Recognised before the word is read: a wave that rises (tension), a cloud
// over mist (numbness), a leaf (calm), an open circle (not sure).
export const CHECKIN_ICON: Record<CheckinChoice, string> = {
  hyper: 'M2.5 15c2 0 2.5-5 4.5-5s2.3 8 4.6 8 2.6-12 5-12 2.4 6 4.9 6',
  hypo: 'M7 13.5h9.5a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.5 1.3A3 3 0 0 0 7 13.5zM4 17h16M7 20.5h10',
  balanced: 'M5 19.5C5 11 10.5 5 19.5 4.5 19.5 13 14 19.5 5 19.5zM5 19.5 13 11.5',
  unsure: 'M15.5 4.2A8.5 8.5 0 1 0 20.3 9',
};

// The four answers' names, in their order: small, so the welcome can ask the
// question without loading the suggestions (data/stateCheckin.ts uses these).
export const CHECKIN_ORDER: CheckinChoice[] = ['hyper', 'balanced', 'hypo', 'unsure'];
export const CHECKIN_LABEL: Record<CheckinChoice, { el: string; en: string }> = {
  hyper: { el: 'Ένταση', en: 'Tension' },
  balanced: { el: 'Ηρεμία', en: 'Calm' },
  hypo: { el: 'Μούδιασμα', en: 'Numbness' },
  unsure: { el: 'Δεν ξέρω', en: 'Not sure' },
};
