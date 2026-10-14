// "How do you feel right now?" — shared by the home page row and the
// companion's check-in. The axes per state match useSmartSuggestion
// (tension → body/breath, numbness → attention/space).

import type { Axis } from './types';

export type CheckinState = 'hyper' | 'hypo' | 'balanced';

type T = { el: string; en: string };

export interface CheckinOption {
  id: CheckinState;
  label: T;        // short chip label
  hint: T;         // what it can feel like
  title: T;        // response heading
  desc: T;         // response text — an observation, never a diagnosis
  axes: Axis[];
  actions: { title: T; path: string }[];
}

export const AXIS_LABEL: Record<Axis, T> = {
  body: { el: 'Σώμα', en: 'Body' },
  breath: { el: 'Αναπνοή', en: 'Breath' },
  attention: { el: 'Προσοχή', en: 'Attention' },
  space: { el: 'Χώρος', en: 'Space' },
};

export const AXIS_COLOR: Record<Axis, string> = {
  body: 'var(--color-axis-body, #7A9E7E)',
  breath: 'var(--color-axis-breath, #C07050)',
  attention: 'var(--color-axis-focus, #C8922A)',
  space: 'var(--color-axis-space, #B5A7D0)',
};

export const CHECKIN_OPTIONS: CheckinOption[] = [
  {
    id: 'hyper',
    label: { el: 'Ένταση', en: 'Tension' },
    hint: { el: 'Σφίξιμο, γρήγορη καρδιά, σκέψεις που τρέχουν', en: 'Tightness, a racing heart, thoughts that run' },
    title: { el: 'Γείωση και μακριά εκπνοή', en: 'Grounding and a long exhale' },
    desc: {
      el: 'Μοιάζει να υπάρχει ένταση. Βοηθάει να νιώσεις το βάρος σου και να αφήσεις την εκπνοή να γίνει πιο μακριά από την εισπνοή.',
      en: 'It sounds like there is tension. It helps to feel your weight and let the exhale grow longer than the inhale.',
    },
    axes: ['body', 'breath'],
    actions: [
      { title: { el: 'Μακριά εκπνοή · 4-2-6-1', en: 'Long exhale · 4-2-6-1' }, path: '/practice/breath/4-2-6-1' },
      { title: { el: 'Μικρο-δόσεις σώματος', en: 'Body microdoses' }, path: '/practice/microdoses?tab=body' },
      { title: { el: 'SOS', en: 'SOS' }, path: '/practice/breath/sos-breath' },
    ],
  },
  {
    id: 'hypo',
    label: { el: 'Μούδιασμα', en: 'Numbness' },
    hint: { el: 'Κούραση, ομίχλη, αποσύνδεση', en: 'Tiredness, fog, disconnection' },
    title: { el: 'Απαλή ενεργοποίηση', en: 'Gentle activation' },
    desc: {
      el: 'Μοιάζει να έχει πέσει η ενέργεια. Βοηθάει λίγη απαλή κίνηση, ένα σταθερό σημείο για την προσοχή και ένα πιο ανοιχτό βλέμμα, χωρίς βιασύνη.',
      en: 'It sounds like your energy has dropped. It helps to add a little gentle movement, a steady point for attention and a wider gaze, without hurry.',
    },
    axes: ['attention', 'space'],
    actions: [
      { title: { el: 'Tai Chi · απαλή ροή', en: 'Tai Chi · gentle flow' }, path: '/practice/breath/tai-chi-cloud-hands' },
      { title: { el: 'Μικρο-δόσεις προσοχής', en: 'Attention microdoses' }, path: '/practice/microdoses?tab=focus' },
      { title: { el: 'Μικρο-δόσεις χώρου', en: 'Space microdoses' }, path: '/practice/microdoses?tab=space' },
    ],
  },
  {
    id: 'balanced',
    label: { el: 'Ηρεμία', en: 'Calm' },
    hint: { el: 'Παρουσία, ασφάλεια, συγκέντρωση', en: 'Present, safe, focused' },
    title: { el: 'Καλή στιγμή για εξερεύνηση', en: 'A good moment to explore' },
    desc: {
      el: 'Μοιάζει να υπάρχει ηρεμία. Είναι καλή στιγμή για μια πιο ανοιχτή πρακτική ή για λίγο διάβασμα.',
      en: 'It sounds like there is calm. It is a good moment for a more open practice, or for some reading.',
    },
    axes: ['space'],
    actions: [
      { title: { el: 'Ανοιχτή επίγνωση', en: 'Open awareness' }, path: '/practice/microdoses?tab=space' },
      { title: { el: 'Η Κουνελότρυπα', en: 'The Rabbit Hole' }, path: '/rabbithole' },
    ],
  },
];

export const getCheckinOption = (id: CheckinState) => CHECKIN_OPTIONS.find(o => o.id === id)!;

const INTENTION: Record<CheckinState, string> = { hyper: 'anxiety', hypo: 'focus', balanced: 'awareness' };

// Saves the answer; useSmartSuggestion reads it for the next 90 minutes.
export function saveCheckinState(state: CheckinState) {
  try {
    localStorage.setItem('n_mindfulness_intention', INTENTION[state]);
    localStorage.setItem('n_mindfulness_state', JSON.stringify({ state, ts: Date.now() }));
  } catch {
    // storage unavailable — the answer still shows on screen
  }
  window.dispatchEvent(new Event('storage'));
}

// The answer given in the last 90 minutes, if any.
export function readRecentCheckinState(): CheckinState | null {
  try {
    const parsed = JSON.parse(localStorage.getItem('n_mindfulness_state') || 'null');
    if (parsed && typeof parsed.ts === 'number' && Date.now() - parsed.ts < 90 * 60 * 1000 &&
        (parsed.state === 'hyper' || parsed.state === 'hypo' || parsed.state === 'balanced')) {
      return parsed.state;
    }
  } catch {
    // ignore
  }
  return null;
}
