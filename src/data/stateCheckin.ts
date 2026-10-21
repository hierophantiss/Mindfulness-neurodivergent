// "How do you feel right now?" — shared by the home page row and the
// companion's check-in. The axes per state match useSmartSuggestion
// (tension → body/breath, numbness → attention/space). The practices come
// from the practice catalogue, so every tagged exercise can be offered.

import type { Axis } from './types';
import { pickWithUsage, forTag, type CatalogItem, type PracticeKind, type UsageCounts } from './practiceCatalog';

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
      el: 'Μοιάζει να έχει πέσει η ενέργεια. Βοηθάει μια απαλή ενεργοποίηση από το σώμα: λίγη κίνηση, η φωνή, και μια ματιά γύρω σου (τι βλέπεις, τι ακούς), χωρίς βιασύνη.',
      en: 'It sounds like your energy has dropped. A gentle activation from the body helps: a little movement, your voice, and a look around you (what you see, what you hear), without hurry.',
    },
    // In shutdown, gentle activation and orienting outwards; not a deep turn
    // inwards or an open gaze into the distance, which can deepen disconnection.
    axes: ['body', 'attention'],
    kinds: ['movement', 'voice', 'dose'],
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
    // Only one practice here: someone unsure of what they feel needs
    // one clear next step, not a choice.
    kinds: [],
    pinned: [{
      title: { el: 'Παρατήρηση επαφής', en: 'Noticing contact' },
      path: '/practice/body/contact-observe',
      dur: { el: '2 λεπτά', en: '2 min' },
    }],
  },
];

export const getCheckinOption = (id: CheckinChoice) => CHECKIN_OPTIONS.find(o => o.id === id)!;

const asAction = (i: CatalogItem): CheckinAction => ({ title: i.title, path: i.path, dur: i.dur });

// The practices shown right away: one per kind, then the pinned ones.
// "How much time do you have?" — seconds: microdoses up to a minute;
// minutes: breathing, movement, voice and guided practices.
export type CheckinTime = 'seconds' | 'minutes';

export const TIME_LABEL: Record<CheckinTime, T> = {
  seconds: { el: 'Λίγα δευτερόλεπτα', en: 'A few seconds' },
  minutes: { el: 'Λίγα λεπτά', en: 'A few minutes' },
};

// With usage counts, the picks follow what the person has done before.
export function getCheckinActions(id: CheckinChoice, counts: UsageCounts = {}, time?: CheckinTime): CheckinAction[] {
  const opt = getCheckinOption(id);
  const pinnedPaths = opt.pinned.map(p => p.path);
  if (!opt.kinds.length) return opt.pinned;
  let kinds = opt.kinds;
  let keep: (i: CatalogItem) => boolean = () => true;
  if (time === 'seconds') {
    kinds = opt.kinds.map(() => 'dose' as PracticeKind);
    keep = i => i.kind === 'dose' && i.seconds <= 60;
  } else if (time === 'minutes') {
    kinds = opt.kinds.map(k => (k === 'dose' ? 'guided' : k));
    keep = i => i.kind !== 'dose';
  }
  return [...pickWithUsage(id, kinds, counts, pinnedPaths, undefined, keep).map(asAction), ...opt.pinned];
}

// Every practice that suits this choice, for "see all".
// "Not sure" has no list — one clear step is the point.
export const getAllForChoice = (id: CheckinChoice) => (id === 'unsure' ? [] : forTag(id));

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

// ── Second, optional step: "Say it more precisely" ──────────────────────
// Only for tension and numbness, at most four each, one concrete step and
// two practices. Shown only after the check-in has been used a few times,
// so new users see the simple version first.

export interface CheckinDetail {
  id: string;
  label: T;
  msg: T;
  step: T;
  actions: CheckinAction[];   // an action without a path just closes the panel
}

const SOS_ACTION: CheckinAction = { title: { el: 'SOS', en: 'SOS' }, path: SOS_PATH };
const CONTACT: CheckinAction = { title: { el: 'Παρατήρηση επαφής', en: 'Noticing contact' }, path: '/practice/body/contact-observe' };

export const CHECKIN_DETAILS: Partial<Record<CheckinState, CheckinDetail[]>> = {
  hyper: [
    {
      id: 'overwhelm',
      label: { el: 'Υπερφόρτωση', en: 'Overwhelm' },
      msg: { el: 'Πάρε μια στιγμή. Δεν χρειάζεται να κάνεις τίποτα άλλο.', en: 'Take a moment. You do not need to do anything else.' },
      step: { el: 'Νιώσε τα πέλματά σου. Μία αργή εκπνοή από το στόμα. Αυτό αρκεί.', en: 'Feel your soles. One slow exhale through the mouth. That is enough.' },
      actions: [SOS_ACTION, CONTACT],
    },
    {
      id: 'panic',
      label: { el: 'Πανικός', en: 'Panic' },
      msg: { el: 'Ο πανικός είναι πολύ έντονος, αλλά περνάει.', en: 'Panic is very intense, but it passes.' },
      step: { el: 'Εκπνοή από το στόμα, αργά, σαν να σβήνεις ένα κερί μακριά σου.', en: 'Breathe out through the mouth, slowly, as if blowing out a candle far away.' },
      actions: [SOS_ACTION, { title: { el: 'Μακριά εκπνοή · 4-6', en: 'Long exhale · 4-6' }, path: '/practice/breath/breath-4-6' }],
    },
    {
      id: 'anxiety',
      label: { el: 'Άγχος', en: 'Anxiety' },
      msg: { el: 'Υπάρχει πολλή ενέργεια χωρίς κατεύθυνση, και ο νους τρέχει. Μπορείς να της δώσεις μία.', en: 'There is a lot of energy without direction, and the mind races. You can give it one.' },
      step: { el: 'Βάρος → Εκπνοή → Ταμπέλα → Χώρος. Αν το σώμα θέλει κίνηση, πάτα δυνατά στο πάτωμα τρεις φορές.', en: 'Weight → Exhale → Label → Space. If the body wants to move, press firmly into the floor three times.' },
      actions: [
        { title: { el: 'Πρωτόκολλο · Κεφάλαιο 8', en: 'Protocol · Chapter 8' }, path: '/chapters/8' },
        { title: { el: 'Λίκνισμα', en: 'Swaying' }, path: '/practice/body/mindful-swaying' },
      ],
    },
    {
      id: 'selfcritical',
      label: { el: 'Αυτοκριτική', en: 'Self-criticism' },
      msg: { el: 'Αυτή η φωνή συχνά είναι παλιός απόηχος, όχι η αλήθεια για σένα.', en: 'That voice is often an old echo, not the truth about you.' },
      step: { el: 'Νιώσε πρώτα τα πέλματά σου. Μετά πες μέσα σου: «Α, η παλιά φωνή. Δεν χρειάζεται να την ακολουθήσω.»', en: 'First feel your soles. Then say to yourself: “Ah, the old voice. I do not need to follow it.”' },
      actions: [
        { title: { el: 'Κεφάλαιο 5 · Νευροδιαφορετικός νους', en: 'Chapter 5 · Neurodivergent mind' }, path: '/chapters/5' },
        { title: { el: 'Η τεχνική της ταμπέλας', en: 'The labelling technique' }, path: '/practice/focus/labeling-technique' },
      ],
    },
  ],
  hypo: [
    {
      id: 'tired',
      label: { el: 'Κούραση', en: 'Tiredness' },
      msg: { el: 'Η κούραση είναι σήμα. Σεβάσου το.', en: 'Tiredness is a signal. Respect it.' },
      step: { el: 'Αν θέλεις, τρεις αργές αναπνοές 5-5. Ή απλώς ξεκουράσου.', en: 'If you like, three slow 5-5 breaths. Or simply rest.' },
      actions: [
        { title: { el: 'Αναπνοή 5-5', en: '5-5 breathing' }, path: '/practice/breath/rhythm-5-5' },
        { title: { el: 'Τίποτα, ξεκουράσου', en: 'Nothing, rest' }, path: '' },
      ],
    },
    {
      id: 'disconnected',
      label: { el: 'Αποσύνδεση', en: 'Disconnection' },
      msg: { el: 'Μερικές φορές το σύστημα χαμηλώνει για να προστατευτεί. Δεν φταις εσύ.', en: 'Sometimes the system turns down to protect itself. It is not your fault.' },
      step: { el: 'Ακούμπησε κάτι με υφή ή θερμοκρασία, όσο σου είναι άνετο. Νιώσε τη βαρύτητα.', en: 'Touch something with texture or temperature, as much as is comfortable. Feel gravity.' },
      actions: [CONTACT, { title: { el: 'Tai Chi · απαλή ροή', en: 'Tai Chi · gentle flow' }, path: '/practice/breath/tai-chi-cloud-hands' }],
    },
    {
      id: 'hyperfocus',
      label: { el: 'Κλείδωμα', en: 'Locked in' },
      msg: { el: 'Ο νους κλείδωσε. Δεν πειράζει, ήδη το πρόσεξες.', en: 'The mind locked in. That is okay, you already noticed.' },
      step: { el: 'Νιώσε τη βαρύτητα. Μετά μαλάκωσε το βλέμμα και νιώσε τον χώρο γύρω σου.', en: 'Feel gravity. Then soften your gaze and feel the space around you.' },
      actions: [
        { title: { el: 'Ανοιχτό βλέμμα', en: 'Open gaze' }, path: '/practice/space/soft-eyes' },
        { title: { el: 'Εναλλάξ εστίαση', en: 'Alternating focus' }, path: '/practice/focus/alternate-focus' },
      ],
    },
  ],
};

// How many times the check-in has been used; the second step appears after 3.
const USES_KEY = 'n_mindfulness_checkin_uses';
export const DETAIL_AFTER_USES = 3;

export function readCheckinUses(): number {
  try { return parseInt(localStorage.getItem(USES_KEY) || '0', 10) || 0; } catch { return 0; }
}

export function countCheckinUse(): number {
  const n = readCheckinUses() + 1;
  try { localStorage.setItem(USES_KEY, String(n)); } catch { /* ignore */ }
  return n;
}
