import { describe, it, expect } from 'vitest';
import { TRY_NOW_PRACTICE, TRY_NOW_DOSES, tryNow } from './tryNow';
import { GUIDED_EXERCISES } from './guidedExercises';
import { PRACTICE_CATALOG } from './practiceCatalog';

// "Try it now" leads to one practice that exists, and names it as its page does.
describe('"Try it now" on a chapter', () => {
  it('chapters 1–4 open one practice of their own, by its own name', () => {
    for (const n of [1, 2, 3, 4]) {
      const { to, title } = TRY_NOW_PRACTICE[n];
      const id = to.split('/').pop()!;
      const shown = to.startsWith('/practice/breath/')
        ? PRACTICE_CATALOG.find(i => i.path === to)?.title
        : GUIDED_EXERCISES[id]?.title;
      expect(shown, `chapter ${n}: ${to}`).toEqual(title);
    }
  });

  it('chapters 5, 6 and 11 open the small doses of their axis', () => {
    for (const n of TRY_NOW_DOSES) expect(tryNow(n, 'el')?.to, `chapter ${n}`).toMatch(/^\/practice\/microdoses\?tab=(body|breath|focus|space)$/);
  });

  it('chapters 7–10 keep their card instead', () => {
    for (const n of [7, 8, 9, 10]) expect(tryNow(n, 'en'), `chapter ${n}`).toBeNull();
  });
});
