import { describe, it, expect } from 'vitest';
import { COURSE_EL } from './course-el';
import { COURSE_EN } from './course-en';
import { KNOWLEDGE_CONCEPTS } from './concepts';

const weeks = Object.keys(COURSE_EL);
const links = (s: string) => [...s.matchAll(/\[\[([^|\]]+)\|([^\]]+)\]\]/g)].map(m => m[2]);

describe('the 8-week program', () => {
  it('has the same days and steps in Greek and English', () => {
    expect(Object.keys(COURSE_EN)).toEqual(weeks);
    for (const w of weeks) {
      expect(COURSE_EN[w as any].days.length).toBe(COURSE_EL[w as any].days.length);
      COURSE_EL[w as any].days.forEach((d: any, i: number) => {
        expect(COURSE_EN[w as any].days[i].exercise.steps.length, `${w}.${i + 1}`).toBe(d.exercise.steps.length);
      });
    }
  });

  it('links method words only to windows that exist', () => {
    for (const C of [COURSE_EL, COURSE_EN]) {
      for (const w of weeks) {
        for (const d of C[w as any].days) {
          for (const s of d.exercise.steps) {
            for (const id of links(s)) expect(KNOWLEDGE_CONCEPTS[id], id).toBeTruthy();
          }
        }
      }
    }
  });

  it('weeks 7 and 8 start from gravity', () => {
    // Every day of the Space weeks names gravity, grounding or the axis in its steps.
    for (const w of ['7', '8']) {
      COURSE_EL[w as any].days.forEach((d: any, i: number) => {
        const text = d.exercise.steps.join(' ');
        expect(/βαρύτητ|βάρος|γείωσ|γειωμέν|άξον/i.test(text), `${w}.${i + 1}`).toBe(true);
      });
    }
  });

  it('says nothing against the book (pedagogical review, 19/11/2026)', () => {
    // Metta and Tilopa's six points are out (the author's decision); no yes/no
    // success questions ("Did I manage…"); the exhale, not the inhale, is the
    // tool; no sleep question; no DMN or "proprioceptive centre" on day one.
    const el = JSON.stringify(COURSE_EL), en = JSON.stringify(COURSE_EN);
    for (const bad of [/metta/i, /Είθε/, /στοργή/, /Τιλόπα/, /Tilopa/i, /Μην σκέφτεσαι/, /Κατάφερα/, /Μπόρεσα/, /Μπορούσα/, /DMN/, /Προεπιλεγμένης/, /ιδιοδεκτικ/, /υποσυνείδητ/, /βιολογική υπογραφή/, /Διεσταλμένη Εισπνοή/, /εισπνοή ως άνοιγμα/i, /τον ύπνο μου/, /είσαι αυτός ο Ανοιχτός Ορίζοντας/]) {
      expect(el, String(bad)).not.toMatch(bad);
    }
    for (const bad of [/metta/i, /May (I|all) be/, /tenderness/i, /Tilopa/i, /Do not think/, /Did I manage/, /Could I/, /DMN/, /Default Mode/, /propriocept/i, /subconscious/i, /biological signature/i, /Expanded Inhale/i, /inhale as an opening/i, /help my sleep/i, /you are this Open Horizon/i]) {
      expect(en, String(bad)).not.toMatch(bad);
    }
  });

  it('keeps out the claims the author removed', () => {
    const all = JSON.stringify([COURSE_EL, COURSE_EN]);
    for (const bad of ['έχτισες νευροπλαστικότητα', 'built neuroplasticity', 'κέντρου ελέγχου', 'control center', '4-7-8', 'Πνευμόνια', 'Binaural Beats" μας', 'συναντά τη νευροφυσιολογία', 'meets neurophysiology']) {
      expect(all.includes(bad), bad).toBe(false);
    }
  });
});
