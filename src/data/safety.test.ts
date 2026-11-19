import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHAPTERS_DATA } from './chapters';
import { COURSE_EL } from './course-el';
import { COURSE_EN } from './course-en';
import { GUIDED_EXERCISES } from './guidedExercises';
import { PRACTICE_TEXTS } from './practiceTexts';
import { MICRODOSES_EXERCISES } from './microdoses';
import { BREATH_PATTERNS } from './breathPatterns';
import { KNOWLEDGE_FAQ } from './faq';
import { KNOWLEDGE_CONCEPTS } from './concepts';
import { DRIFT_NOTE } from './safetyNotes';
import { translations } from '../hooks/useLanguage';
import narration from './narration.json';

const book = (lang: 'el' | 'en') => readFileSync(resolve('book', `workbook_${lang}.md`), 'utf-8');
// One line of prose: no quote marks or line breaks of the markdown, no tags.
const flat = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\*\*/g, '').replace(/\n>\s?/g, ' ').replace(/\s+/g, ' ').trim();

// Everything an exercise can say, in both languages.
const SOURCES: Record<string, string> = {
  'chapters.ts': JSON.stringify(CHAPTERS_DATA),
  'course-el.ts': JSON.stringify(COURSE_EL),
  'course-en.ts': JSON.stringify(COURSE_EN),
  'guidedExercises.ts': JSON.stringify(GUIDED_EXERCISES),
  'practiceTexts.ts': JSON.stringify(PRACTICE_TEXTS),
  'microdoses.ts': JSON.stringify(MICRODOSES_EXERCISES),
  'breathPatterns.ts': JSON.stringify(BREATH_PATTERNS),
  'faq.ts': JSON.stringify(KNOWLEDGE_FAQ),
  'concepts.ts': JSON.stringify(KNOWLEDGE_CONCEPTS),
  'narration.json': JSON.stringify(narration),
  'workbook_el.md': book('el'),
  'workbook_en.md': book('en'),
};

describe('"Close your eyes" is always a choice', () => {
  // Every "close your eyes" goes with "if you like" (or offers another way,
  // "or lower your gaze"). Closed eyes can unsettle someone with trauma.
  const EL = /(?<!\p{L})κλε[ιί]σε\s+(?:απαλά\s+)?τα\s+μάτια(?:\s+σου)?([^.;·]*)/giu;
  const EN = /(?<![-\p{L}])close\s+(?:your\s+)?eyes([^.;·]*)/giu;
  const choiceEl = /^\s*,?\s*(αν (θέλεις|σε βοηθά|αυτό σε βοηθάει)|ή\s)/u;
  const choiceEn = /^\s*,?\s*(if (you like|you wish|it helps)|or\s)/iu;

  for (const [name, text] of Object.entries(SOURCES)) {
    it(name, () => {
      const plain = text.replace(/\\n/g, ' ');
      for (const m of plain.matchAll(EL)) expect(m[1], `${name}: «${m[0].slice(0, 60)}»`).toMatch(choiceEl);
      for (const m of plain.matchAll(EN)) expect(m[1], `${name}: "${m[0].slice(0, 60)}"`).toMatch(choiceEn);
    });
  }

  it('the chapter 3 exercise and the body scan say "if you like"', () => {
    const ch3 = (l: 'el' | 'en') => CHAPTERS_DATA[l].find(c => c.num === 3)!.exercise!.steps[0];
    expect(ch3('el')).toContain('Κλείσε τα μάτια, αν θέλεις.');
    expect(ch3('en')).toContain('Close your eyes if you like.');
    expect(book('el')).toContain('Κλείσε τα μάτια, αν θέλεις.');
    expect(book('en')).toContain('Close your eyes if you like.');
  });
});

describe('the book\'s safety notes, word for word', () => {
  it('the note on drifting away (Chapter 4) is the book\'s and the chapter\'s own', () => {
    for (const l of ['el', 'en'] as const) {
      const note = `${DRIFT_NOTE.body[l]} ${DRIFT_NOTE.close[l]}`;
      expect(flat(book(l)), l).toContain(flat(note));
      const ch4 = CHAPTERS_DATA[l].find(c => c.num === 4)!;
      expect(ch4.theorySections.flatMap(s => s.paragraphs).map(flat).join(' '), l).toContain(flat(note));
    }
  });

  it('the welcome says when to stop, as the note at the start of the book', () => {
    for (const l of ['el', 'en'] as const) expect(flat(book(l)), l).toContain(translations['onboarding.stop'][l]);
  });
});
