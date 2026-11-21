import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_CONCEPTS } from './concepts';
import { GUIDED_EXERCISES } from './guidedExercises';
import { COURSE_EL } from './course-el';
import { COURSE_EN } from './course-en';
import { KNOWLEDGE_FAQ } from './faq';

// Greek and English say the same things: the same parts, the same number of
// steps and questions, pointing to the same places. (The types say what each
// part is; these say the two languages have not drifted apart.)
describe('Greek and English, side by side', () => {
  it('each concept has the same parts in both', () => {
    for (const [id, c] of Object.entries(KNOWLEDGE_CONCEPTS)) {
      expect(Object.keys(c.el).sort(), id).toEqual(Object.keys(c.en).sort());
      for (const k of Object.keys(c.el) as (keyof typeof c.el)[]) {
        expect(c.el[k]?.trim(), `${id}.el.${k}`).toBeTruthy();
        expect(c.en[k]?.trim(), `${id}.en.${k}`).toBeTruthy();
      }
      for (const r of c.related ?? []) expect(KNOWLEDGE_CONCEPTS[r], `${id} → ${r}`).toBeTruthy();
    }
  });

  it('each guided exercise has the same number of steps in both', () => {
    for (const [id, g] of Object.entries(GUIDED_EXERCISES)) {
      expect(g.instructions.el.length, id).toBe(g.instructions.en.length);
      expect(g.instructions.el.length, id).toBeGreaterThan(0);
    }
  });

  it('the program has the same weeks, days and steps in both', () => {
    expect(Object.keys(COURSE_EL)).toEqual(Object.keys(COURSE_EN));
    for (const w of Object.keys(COURSE_EL).map(Number)) {
      const el = COURSE_EL[w], en = COURSE_EN[w];
      expect(el.days.length, `week ${w}`).toBe(en.days.length);
      el.days.forEach((d, i) => expect(d.exercise.steps.length, `week ${w} day ${i + 1}`).toBe(en.days[i].exercise.steps.length));
    }
  });

  it('the FAQ asks the same questions in both, pointing to the same places', () => {
    for (const [n, f] of Object.entries(KNOWLEDGE_FAQ)) {
      expect(f.el.length, `faq ${n}`).toBe(f.en.length);
      f.el.forEach((q, i) => {
        const e = f.en[i];
        expect([q.depth, q.relatedChapter, q.relatedConcept, q.relatedExercise, q.relatedPage, !!q.followUp], `faq ${n} #${i + 1}`)
          .toEqual([e.depth, e.relatedChapter, e.relatedConcept, e.relatedExercise, e.relatedPage, !!e.followUp]);
      });
    }
  });
});
