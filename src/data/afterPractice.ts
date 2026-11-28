// "How are you now?" at the end of a practice: where each answer leads.
// Only links and short words here, no chapter text (the chapter page finds
// the section itself, from ?s=). The answer is not kept anywhere and does not
// change what the app suggests later (it never reaches pickWithUsage): it only
// decides what this one screen shows. The "before" is the answer given in the
// home check-in, when the person came from there; it travels in the link
// (router state) and nowhere else.
// The section titles and the practices' names are checked against the
// chapters and the practices by a test (afterPractice.test.ts).

import type { Axis } from './types';
import type { CheckinChoice } from './stateCheckin';

type T = { el: string; en: string };

/** A theory section of a chapter: `section` is its number among the chapter's sections (1 = the first), as ?s= takes it. */
export interface SectionLink { chapter: number; section: number; title: T }

export interface PracticeLink { to: string; title: T; dur?: T; axis?: Axis }

export type AfterAction =
  | { kind: 'practice'; practice: PracticeLink }
  | { kind: 'sos' }
  // The chapter, opened at a section: read or listen (listenFirst: «Άκου» in front, as in fog).
  | { kind: 'chapter'; link: SectionLink; later?: boolean; listenFirst?: boolean }
  | { kind: 'animation'; link: SectionLink }
  | { kind: 'journal' };

export interface AfterRoute {
  /** The book's note for drifting away (Space practice, then numbness): first of all. */
  drift: boolean;
  /** What it says, in order: words of observation, never praise. */
  lines: T[];
  main: AfterAction;
  /** At most two. */
  secondary: AfterAction[];
}

export const SOS_ROUTE = '/practice/breath/sos-breath';

// ── Where the answers lead ────────────────────────────────────────────────

export const SECTIONS = {
  barometer: { chapter: 8, section: 1, title: { el: 'Το Βαρόμετρο: Πριν από την Καταιγίδα', en: 'The Barometer: Before the Storm' } },
  afterWave: { chapter: 8, section: 5, title: { el: 'Μετά το Κύμα', en: 'After the Wave' } },
  shutdown: { chapter: 6, section: 6, title: { el: 'Όταν το σύστημα σβήνει (ήπια ενεργοποίηση)', en: 'When the system shuts down (gentle activation)' } },
  winds: { chapter: 2, section: 5, title: { el: 'Οι Άνεμοι του Συναισθήματος', en: 'The Winds of Emotion' } },
  gusts: { chapter: 2, section: 6, title: { el: 'Ριπές, Συστήματα, Κλίμα', en: 'Gusts, Systems, Climate' } },
} satisfies Record<string, SectionLink>;

/**
 * The axis chapter (the one today's «Στον οδηγό» card opens): the section
 * that says what the practice does and why, and the section with the
 * chapter's animation.
 */
export const AXIS_CHAPTER: Record<Axis, { read: SectionLink; animation: SectionLink }> = {
  body: {
    read: { chapter: 1, section: 1, title: { el: 'Η Αρχή: Χαλάρωση και Γείωση', en: 'The Beginning: Relaxation and Grounding' } },
    animation: { chapter: 1, section: 2, title: { el: 'Η Βαρύτητα: Το Αναμφίβολο «Εδώ»', en: 'Gravity: The Undeniable "Here"' } },
  },
  breath: {
    read: { chapter: 2, section: 3, title: { el: 'Οι Τρεις Ρυθμοί', en: 'The Three Rhythms' } },
    animation: { chapter: 2, section: 2, title: { el: 'Η Πράξη της Παρατήρησης — Εσωτερική Αφή', en: 'The Act of Observation — Inner Touch' } },
  },
  attention: {
    read: { chapter: 3, section: 3, title: { el: 'Η Τετραπλή Προσοχή', en: 'Fourfold Attention' } },
    animation: { chapter: 3, section: 1, title: { el: 'Οι Τέσσερις Μορφές Προσοχής', en: 'The Four Forms of Attention' } },
  },
  space: {
    read: { chapter: 4, section: 2, title: { el: 'Το Σημείο και το Πεδίο', en: 'The Point and the Field' } },
    animation: { chapter: 4, section: 6, title: { el: 'Ο Ρυθμός της Ανοιχτής Προσοχής', en: 'The Rhythm of Open Attention' } },
  },
};

// The practices, by the names their pages show. In tension only body and
// breath, and a breath without a hold (4-6, as in Chapter 8; decision 12/11).
export const PRACTICES = {
  longExhale: { to: '/practice/breath/breath-4-6', title: { el: 'Στην Κορύφωση · 4-6', en: 'At the Peak · 4-6' }, dur: { el: 'χωρίς κράτημα', en: 'no hold' }, axis: 'breath' },
  gravity: { to: '/practice/body/gravity-surrender', title: { el: 'Παράδοση στη Βαρύτητα', en: 'Surrender to Gravity' }, dur: { el: '3 λεπτά', en: '3 min' }, axis: 'body' },
  contact: { to: '/practice/body/contact-observe', title: { el: 'Παρατήρηση Επαφής (Γείωση)', en: 'Contact Observation (Grounding)' }, dur: { el: '2 λεπτά', en: '2 min' }, axis: 'body' },
  bodyGrounding: { to: '/practice/body/body-scan', title: { el: 'Μικρο-Γείωση Σώματος', en: 'Micro Body Grounding' }, dur: { el: '3 λεπτά', en: '3 min' }, axis: 'body' },
  swaying: { to: '/practice/swaying', title: { el: 'Λίκνισμα', en: 'Swaying' }, axis: 'body' },
  humming: { to: '/practice/breath/bhramari-humming', title: { el: 'Βουητό (Bhramari)', en: 'Humming (Bhramari)' }, axis: 'breath' },
} satisfies Record<string, PracticeLink>;

// ── The words (approved by the author, 28/11) ─────────────────────────────

export const AFTER_QUESTION: T = { el: 'Πώς είσαι τώρα;', en: 'How are you now?' };

export const AFTER_WORDS = {
  balanced: { el: 'Μοιάζει να υπάρχει ηρεμία. Καλή στιγμή να δεις τι έκανες και γιατί.', en: 'It sounds like there is calm. A good moment to see what you did, and why.' },
  hyper: { el: 'Η ένταση είναι ακόμα εδώ. Πρώτα το σώμα, το διάβασμα αργότερα.', en: 'The tension is still here. The body first, the reading later.' },
  hypo: { el: 'Μοιάζει να έχει πέσει η ενέργεια. Βοηθάει λίγη κίνηση ή η φωνή.', en: 'It sounds like your energy has dropped. A little movement, or your voice, helps.' },
  unsure: { el: 'Δεν χρειάζεται να το ονομάσεις.', en: 'You do not need to name it.' },
  selfRegulation: { el: 'Αυτό που μόλις έγινε λέγεται αυτορρύθμιση.', en: 'What just happened is called self-regulation.' },
  windsHold: { el: 'Κάποιοι άνεμοι κρατούν περισσότερο. Δεν απέτυχες.', en: 'Some winds last longer. You have not failed.' },
  changeDoor: { el: 'Αν η άσκηση σε ανέβασε ή σε θόλωσε, άλλαξε πόρτα.', en: 'If the practice stirred you up or clouded you, try another door.' },
} satisfies Record<string, T>;

/** The words on the buttons. */
export const ACTION_WORDS = {
  read: { el: 'Διάβασε', en: 'Read' },
  listen: { el: 'Άκου', en: 'Listen' },
  later: { el: 'Για αργότερα', en: 'For later' },
  inGuide: { el: 'Στον οδηγό', en: 'In the guide' },
  animation: { el: 'Δες την κινούμενη εικόνα', en: 'Watch the animation' },
  chapter: { el: 'Κεφάλαιο', en: 'Chapter' },
  before: { el: 'Πριν', en: 'Before' },
  now: { el: 'Τώρα', en: 'Now' },
  again: { el: 'Ξανά', en: 'Again' },
} satisfies Record<string, T>;

// ── SOS: the light version (no chapters now) ──────────────────────────────

export type SosAnswer = 'still' | 'passed';
export const SOS_ANSWERS: { id: SosAnswer; label: T; look: CheckinChoice }[] = [
  { id: 'still', label: { el: 'Ακόμα ένταση', en: 'Still tense' }, look: 'hyper' },
  { id: 'passed', label: { el: 'Πέρασε', en: 'It has passed' }, look: 'balanced' },
];
export const SOS_WORDS: Record<SosAnswer, T> = {
  still: { el: 'Η ένταση είναι ακόμα εδώ.', en: 'The tension is still here.' },
  // Chapter 8, «Μετά το Κύμα», word for word.
  passed: { el: 'Μετά το κύμα: νερό, φαγητό, ξεκούραση.', en: 'After the wave: water, food, rest.' },
};

// ── The route ─────────────────────────────────────────────────────────────

export interface AfterContext {
  /** The axis of the practice just done. */
  axis?: Axis | string;
  /** The practice's own address (without the language), so the next step is another door. */
  path?: string;
  /** The answer in the home check-in, if the person came from there. */
  before?: CheckinChoice | null;
}

const AXES: Axis[] = ['body', 'breath', 'attention', 'space'];
const asAxis = (a: AfterContext['axis']): Axis | undefined => (AXES.includes(a as Axis) ? (a as Axis) : undefined);
const same = (a: string | undefined, b: string) => !!a && a.replace(/\/+$/, '') === b;
const isSwaying = (path?: string) => same(path, PRACTICES.swaying.to) || same(path, '/practice/body/mindful-swaying');
const practice = (p: PracticeLink): AfterAction => ({ kind: 'practice', practice: p });
/** The contact practice, or another body practice if that is the one just done. */
const contactOr = (path?: string) => practice(same(path, PRACTICES.contact.to) ? PRACTICES.bodyGrounding : PRACTICES.contact);

/** What the screen shows for this answer, after this practice. Pure: nothing is read or kept. */
export function afterPractice(now: CheckinChoice, ctx: AfterContext = {}): AfterRoute {
  const axis = asAxis(ctx.axis) ?? 'body';
  const { path, before } = ctx;
  const lines: T[] = [];
  let main: AfterAction;
  let secondary: AfterAction[];

  if (now === 'balanced') {
    if (before === 'hyper' || before === 'hypo') lines.push(AFTER_WORDS.selfRegulation);
    lines.push(AFTER_WORDS.balanced);
    main = { kind: 'chapter', link: AXIS_CHAPTER[axis].read };
    secondary = [{ kind: 'animation', link: AXIS_CHAPTER[axis].animation }, { kind: 'journal' }];
  } else if (now === 'hyper') {
    lines.push(AFTER_WORDS.hyper);
    // One more regulation: 4-6 without a hold; after a breath practice, the body (another door).
    main = practice(axis === 'breath' ? PRACTICES.gravity : PRACTICES.longExhale);
    let later: SectionLink = SECTIONS.barometer;
    if (before === 'hyper') {
      lines.push(AFTER_WORDS.windsHold);
      later = SECTIONS.gusts;
    }
    if (before === 'balanced') {
      lines.push(AFTER_WORDS.changeDoor);
      main = contactOr(path);
    }
    secondary = [{ kind: 'sos' }, { kind: 'chapter', link: later, later: true }];
  } else if (now === 'hypo') {
    lines.push(AFTER_WORDS.hypo);
    main = practice(isSwaying(path) ? PRACTICES.humming : PRACTICES.swaying);
    if (before === 'balanced') {
      lines.push(AFTER_WORDS.changeDoor);
      main = contactOr(path);
    }
    // In fog, listening is easier than reading.
    secondary = [{ kind: 'chapter', link: SECTIONS.shutdown, later: true, listenFirst: true }];
  } else {
    lines.push(AFTER_WORDS.unsure);
    main = contactOr(path);
    secondary = [{ kind: 'chapter', link: SECTIONS.winds }];
  }

  return { drift: axis === 'space' && now === 'hypo', lines, main, secondary: secondary.slice(0, 2) };
}

/** The chapter's address, opened at the section (and «Άκου» starting from there). */
export function sectionHref(link: SectionLink, opts: { listen?: boolean; animation?: boolean } = {}): string {
  return `/chapters/${link.chapter}?s=${link.section}${opts.listen ? '&listen=1' : ''}${opts.animation ? '&anim=1' : ''}`;
}

const CHOICES: CheckinChoice[] = ['hyper', 'balanced', 'hypo', 'unsure'];

/** The "before" from the link's state, if it is one of the four answers. */
export function beforeFrom(state: unknown): CheckinChoice | null {
  if (!state || typeof state !== 'object') return null;
  const v = (state as { checkinBefore?: unknown }).checkinBefore;
  return CHOICES.includes(v as CheckinChoice) ? (v as CheckinChoice) : null;
}

/** The state a check-in link carries to the practice. */
export const beforeState = (choice: CheckinChoice) => ({ checkinBefore: choice });
