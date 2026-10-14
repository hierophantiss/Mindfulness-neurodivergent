// "How do you feel right now?" — shared by the home page row and the
// companion's check-in. The axes per state match useSmartSuggestion
// (tension → body/breath, numbness → attention/space). The practices come
// from the practice catalogue, so every tagged exercise can be offered.

import type { Axis } from './types';
import { pickForTag, forTag, type CatalogItem, type PracticeKind } from './practiceCatalog';

export type CheckinState = 'hyper' | 'hypo' | 'balanced';
export type CheckinChoice = CheckinState | 'unsure';

type T = { el: string; en: string };
export type CheckinAction = { title: T; path: string; dur?: T };

export interface CheckinOption {
  id: CheckinChoice;
  label: T;        // short chip label
  hint: T;         // what it can feel like
  title: T;        // response heading
  desc: T;         // response text — an observation, never a diagnosis
  axes: Axis[];
  kinds: PracticeKind[];       // one practice of each kind, changing daily
  pinned: CheckinAction[];     // always shown after them
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

export const SOS_PATH = '/practice/breath/sos-breath';

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
    kinds: ['breath', 'dose'],
    pinned: [{ title: { el: 'SOS', en: 'SOS' }, path: SOS_PATH }],
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
    kinds: ['movement', 'dose', 'guided'],
    pinned: [],
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
    kinds: ['dose', 'movement'],
    pinned: [{ title: { el: 'Η Κουνελότρυπα', en: 'The Rabbit Hole' }, path: '/rabbithole' }],
  },
  {
    id: 'unsure',
    label: { el: 'Δεν ξέρω', en: 'Not sure' },
    hint: { el: 'Δεν είναι ξεκάθαρο τι νιώθω', en: 'It is not clear what I feel' },
    title: { el: 'Δεν χρειάζεται να το ονομάσεις', en: 'You do not need to name it' },
    desc: {
      el: 'Συμβαίνει συχνά να μην είναι ξεκάθαρο τι νιώθεις. Βοηθάει μια σύντομη ματιά στο σώμα: πού ακουμπάει, πού σφίγγει, πού είναι ήσυχο. Μετά, αν θέλεις, ξαναδιάλεξε.',
      en: 'It is common not to be sure what you feel. A short look at the body helps: where it touches, where it is tight, where it is quiet. Then, if you like, choose again.',
    },
    axes: ['body'],
    kinds: ['dose', 'guided'],
    pinned: [],
  },
];

export const getCheckinOption = (id: CheckinChoice) => CHECKIN_OPTIONS.find(o => o.id === id)!;

const asAction = (i: CatalogItem): CheckinAction => ({ title: i.title, path: i.path, dur: i.dur });

// The practices shown right away: one per kind (changing daily), then the pinned ones.
export function getCheckinActions(id: CheckinChoice): CheckinAction[] {
  const opt = getCheckinOption(id);
  const pinnedPaths = opt.pinned.map(p => p.path);
  return [...pickForTag(id, opt.kinds, pinnedPaths).map(asAction), ...opt.pinned];
}

// Every practice that suits this choice, for "see all".
export const getAllForChoice = (id: CheckinChoice) => forTag(id);

const INTENTION: Record<CheckinState, string> = { hyper: 'anxiety', hypo: 'focus', balanced: 'awareness' };

// Saves the answer; useSmartSuggestion reads it for the next 90 minutes.
// "Not sure" is not a state, so nothing is saved for it.
export function saveCheckinState(choice: CheckinChoice) {
  if (choice === 'unsure') return;
  try {
    localStorage.setItem('n_mindfulness_intention', INTENTION[choice]);
    localStorage.setItem('n_mindfulness_state', JSON.stringify({ state: choice, ts: Date.now() }));
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
