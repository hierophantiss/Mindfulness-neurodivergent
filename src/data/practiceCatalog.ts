// Every practice in the app in one list, each marked with the check-in
// states it suits: hyper = tension, hypo = numbness, balanced = calm,
// unsure = "I don't know" (a short look at the body).
// An item without tags still exists in the app; it is just never offered
// by the check-in.

import type { Axis } from './types';
import { MICRODOSES_EXERCISES } from './microdoses';
import { BREATH_PATTERNS } from './breathPatterns';
import { GUIDED_EXERCISES } from './guidedExercises';

export type CheckinTag = 'hyper' | 'hypo' | 'balanced' | 'unsure';
export type PracticeKind = 'dose' | 'breath' | 'voice' | 'movement' | 'guided';
type T = { el: string; en: string };

export interface CatalogItem {
  id: string;
  kind: PracticeKind;
  axis: Axis;
  title: T;
  path: string;
  seconds: number;
  dur: T;
  tags: CheckinTag[];
}

const H: CheckinTag = 'hyper', L: CheckinTag = 'hypo', B: CheckinTag = 'balanced', U: CheckinTag = 'unsure';

// Left without tags on purpose: sky imagery and the elements, which the
// method no longer uses (sky-gazing-micro, thoughts-as-objects,
// spacious-metta, samatha-micro, sky-clouds) — and delta, which is for sleep.
export const CHECKIN_TAGS: Record<string, CheckinTag[]> = {
  // microdoses — body
  'axis-pause': [H, B, U], 'soft-belly': [H], 'unlocked-knees': [H], 'contact-observe': [H, L, U],
  'shoulder-drop': [H], 'hand-weight': [H], 'pelvis-root': [H, B], 'jaw-release': [H], 'gravity-sink': [H],
  // microdoses — breath
  'rhythm-5-5': [B, L], 'nostril-touch': [L, B], 'stealth-breath': [H, B], 'breath-path': [L, B],
  'humming-vibration': [H], 'breath-4-2-7': [H], 'ocean-breath': [H],
  // microdoses — attention
  'anchor-7-sec': [L, B], 'triple-anchor': [L, H], 'alternate-focus': [L], 'gentle-return': [L, B],
  'eye-horizon': [L, H], 'one-sound': [L, H], 'sensory-54321': [L, H, U],
  // microdoses — space
  'short-moment': [B], 'tilopa-rest': [B], 'silence-background': [B], 'open-presence': [H, B],
  // breathing patterns
  '4-2-6-1': [H], '4-2-7-1': [H], '4-7-8': [H], 'box-breathing': [L, B], 'sos-breath': [H],
  // movement
  '5-5': [B, L], 'deep-bow-5-5': [L, B], 'lotus-bloom-5-5': [B], 'be-like-a-flower-5-5': [L, B],
  'tai-chi-cloud-hands': [H, L], 'qigong-lifting-sky': [L],
  'taichi-fourfold': [B, H], 'taichi-box': [L, B], 'taichi-resonant': [B, H], 'taichi-active': [L],
  'lotus-fourfold': [B], 'lotus-box': [L, B], 'lotus-resonant': [B, H], 'lotus-active': [L],
  // voice
  'bhramari-humming': [H], 'aum-resonance': [H, B], 'a-major-resonance': [B], 'c-major-resonance': [H],
  'throat-chakra-humming': [B], 'om-pure-resonance': [B], 'om-resonance-throat': [B],
  // guided exercises
  'body-scan': [H, B, U], 'grounding-scan': [H, U], 'sound-focus': [L, H], 'vertical-axis': [B, L],
  'gravity-surrender': [H], 'mindful-swaying': [H, L], 'mindful-walking': [L, H], 'belly-breathing': [H],
  'exhale-rhythm': [H], 'nadi-shodhana': [H, B], 'attention-observation': [B], 'fixed-point': [L],
  'labeling-technique': [H, B],
};

const AXIS_SEGMENT: Record<Axis, string> = { body: 'body', breath: 'breath', attention: 'focus', space: 'space' };

const minutes = (s: number): T => {
  const m = Math.max(1, Math.round(s / 60));
  return { el: `${m} λεπτ${m === 1 ? 'ό' : 'ά'}`, en: `${m} min` };
};

function build(): CatalogItem[] {
  const items: CatalogItem[] = [];

  for (const m of MICRODOSES_EXERCISES) {
    items.push({
      id: m.id, kind: 'dose', axis: m.axis, title: m.title, path: m.link,
      seconds: m.maxSeconds, dur: m.dur, tags: CHECKIN_TAGS[m.id] || [],
    });
  }

  for (const p of BREATH_PATTERNS) {
    const kind: PracticeKind = p.category === 'vocal' ? 'voice' : p.category === 'breath' ? 'breath' : 'movement';
    const sub = p.subtitle;
    items.push({
      id: p.id, kind, axis: p.axis,
      title: p.title.el === sub.el || !sub.el ? p.title : { el: `${p.title.el} · ${sub.el}`, en: `${p.title.en} · ${sub.en}` },
      path: `/practice/breath/${p.id}`,
      seconds: 180, dur: { el: 'λίγα λεπτά', en: 'a few min' }, tags: CHECKIN_TAGS[p.id] || [],
    });
  }

  // Guided exercises that a microdose card already opens are not listed twice.
  const openedByDose = new Set(MICRODOSES_EXERCISES.map(m => m.link.split('/').pop()));
  for (const [id, g] of Object.entries(GUIDED_EXERCISES)) {
    if (openedByDose.has(id) || !g.axis) continue;
    const axis = g.axis as Axis;
    items.push({
      id, kind: 'guided', axis, title: g.title, path: `/practice/${AXIS_SEGMENT[axis]}/${id}`,
      seconds: g.duration || 300, dur: minutes(g.duration || 300), tags: CHECKIN_TAGS[id] || [],
    });
  }

  return items;
}

export const PRACTICE_CATALOG: CatalogItem[] = build();

export const KIND_LABEL: Record<PracticeKind, T> = {
  dose: { el: 'Μικρο-δόσεις', en: 'Microdoses' },
  breath: { el: 'Αναπνοή', en: 'Breathing' },
  voice: { el: 'Φωνή & ήχος', en: 'Voice & sound' },
  movement: { el: 'Κίνηση', en: 'Movement' },
  guided: { el: 'Καθοδηγούμενες', en: 'Guided' },
};

export const forTag = (tag: CheckinTag) => PRACTICE_CATALOG.filter(i => i.tags.includes(tag));

export const dayOfYear = (date = new Date()) => {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86400000);
};

// One practice of each requested kind for this state, the same all day and
// a different one tomorrow.
export function pickForTag(tag: CheckinTag, kinds: PracticeKind[], exclude: string[] = [], day = dayOfYear()): CatalogItem[] {
  const pool = forTag(tag).filter(i => !exclude.includes(i.path));
  const out: CatalogItem[] = [];
  kinds.forEach((kind, k) => {
    const ofKind = pool.filter(i => i.kind === kind && !out.includes(i));
    if (ofKind.length) out.push(ofKind[(day + k * 7) % ofKind.length]);
  });
  return out;
}
