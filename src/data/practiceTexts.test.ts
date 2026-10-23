import { describe, it, expect } from 'vitest';
import { PRACTICE_TEXTS, GRAVITY_STEP, plainConcepts } from './practiceTexts';
import { PRACTICE_CATALOG } from './practiceCatalog';
import { GUIDED_EXERCISES } from './guidedExercises';
import { MICRODOSES_EXERCISES } from './microdoses';
import { KNOWLEDGE_CONCEPTS } from './concepts';
import { CHAPTER_TITLES } from './chapterTitles';
import { CHAPTERS_DATA } from './chapters';

const offered = PRACTICE_CATALOG.filter(i => (i.kind === 'dose' || i.kind === 'guided') && i.tags.length > 0);
const pageOf = (id: string) => {
  const dose = MICRODOSES_EXERCISES.find(m => m.id === id);
  return GUIDED_EXERCISES[dose ? dose.link.split('/').pop()! : id];
};

describe('the short practices of "How do you feel"', () => {
  it('every practice the check-in offers has its reviewed text, and its own page', () => {
    for (const i of offered) {
      expect(PRACTICE_TEXTS[i.id], i.id).toBeTruthy();
      expect(pageOf(i.id)?.instructions?.el?.length, i.id).toBeGreaterThan(1);
    }
  });

  it('every page starts from gravity (after the position, if there is one)', () => {
    for (const [id, t] of Object.entries(PRACTICE_TEXTS)) {
      const steps = pageOf(id).instructions;
      for (const l of ['el', 'en'] as const) {
        expect(steps[l][t.setup ? 1 : 0], `${id} ${l}`).toBe(GRAVITY_STEP[l]);
        if (t.setup) expect(steps[l][0]).toBe(t.setup[l]);
      }
    }
  });

  it('Greek and English have the same steps', () => {
    for (const [id, t] of Object.entries(PRACTICE_TEXTS)) expect(t.steps.en.length, id).toBe(t.steps.el.length);
  });

  it('every tappable word opens an idea that exists', () => {
    const all = [GRAVITY_STEP.el, GRAVITY_STEP.en, ...Object.values(PRACTICE_TEXTS).flatMap(t => [...t.steps.el, ...t.steps.en])];
    for (const s of all) for (const m of s.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)) expect(KNOWLEDGE_CONCEPTS[m[2]], m[2]).toBeTruthy();
    expect(plainConcepts('Νιώσε τη [[βαρύτητα|gravity]].')).toBe('Νιώσε τη βαρύτητα.');
  });

  it('the Greek speaks to "you" (singular), as the whole app does', () => {
    const plural = /(^|[\s«(])(Σταθείτε|Καθίστε|Κλείστε|Νιώστε|Μείνετε|Αφήστε|Παρατηρήστε|Ξαπλώστε|Τοποθετήστε|Αναπνεύστε|Επιστρέψτε|Περιμένετε|Βάλτε|Κοιτάξτε|Ανοίξτε|Επιλέξτε|Συνεχίστε|Περπατήστε|Ξεκινήστε|Κρατήστε)(?=[\s.,;·!:]|$)/i;
    expect(plural.test('Σταθείτε ή καθίστε.')).toBe(true);
    for (const [id, t] of Object.entries(PRACTICE_TEXTS)) {
      for (const s of [...t.steps.el, t.setup?.el ?? '', t.sub?.el ?? '', t.card?.el ?? '']) expect(plural.test(s), `${id}: ${s}`).toBe(false);
    }
  });

  it('the chapter names used by the idea windows match the book', () => {
    for (const l of ['el', 'en'] as const) for (const c of CHAPTERS_DATA[l]) expect(CHAPTER_TITLES[l][c.num]).toBe(c.title);
  });
});
