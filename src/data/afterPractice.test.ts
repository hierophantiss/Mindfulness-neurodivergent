import { describe, it, expect } from 'vitest';
import {
  AXIS_CHAPTER, PRACTICES, SECTIONS, SOS_ROUTE, afterPractice, beforeFrom, beforeState, sectionHref,
  type AfterAction, type AfterRoute, type PracticeLink, type SectionLink,
} from './afterPractice';
import { CHAPTERS_DATA } from './chapters';
import { BREATH_PATTERNS, breathName } from './breathPatterns';
import { GUIDED_EXERCISES } from './guidedExercises';
import { PRACTICE_CATALOG, CHECKIN_TAGS } from './practiceCatalog';
import type { CheckinChoice } from './stateCheckin';
import type { Axis } from './types';

const CHOICES: CheckinChoice[] = ['hyper', 'balanced', 'hypo', 'unsure'];
const AXES: Axis[] = ['body', 'breath', 'attention', 'space'];
const BEFORES: (CheckinChoice | null)[] = [null, ...CHOICES];

// Every practice of the app, as the one just done, and the Swaying page.
const DONE = [...PRACTICE_CATALOG.map(i => ({ axis: i.axis, path: i.path })), { axis: 'body' as Axis, path: '/practice/swaying' }];

function* everyRoute(): Generator<{ now: CheckinChoice; before: CheckinChoice | null; axis: Axis; path: string; route: AfterRoute }> {
  for (const now of CHOICES) for (const before of BEFORES) for (const { axis, path } of DONE) {
    yield { now, before, axis, path, route: afterPractice(now, { axis, path, before }) };
  }
}
const actions = (r: AfterRoute): AfterAction[] => [r.main, ...r.secondary];
const practicePaths = (r: AfterRoute) => actions(r).flatMap(a => (a.kind === 'practice' ? [a.practice.to] : a.kind === 'sos' ? [SOS_ROUTE] : []));
const sectionsOf = (r: AfterRoute): SectionLink[] => actions(r).flatMap(a => (a.kind === 'chapter' || a.kind === 'animation' ? [a.link] : []));

const ALL_SECTIONS: SectionLink[] = [
  ...Object.values(SECTIONS),
  ...AXES.flatMap(a => [AXIS_CHAPTER[a].read, AXIS_CHAPTER[a].animation]),
];

describe('"How are you now?": the chapters it opens', () => {
  it('every section exists in Greek and in English, under the name it is given', () => {
    for (const s of ALL_SECTIONS) {
      for (const lang of ['el', 'en'] as const) {
        const ch = CHAPTERS_DATA[lang].find(c => c.num === s.chapter);
        expect(ch, `chapter ${s.chapter} (${lang})`).toBeTruthy();
        expect(ch!.theorySections[s.section - 1]?.title, `chapter ${s.chapter}, section ${s.section} (${lang})`).toBe(s.title[lang]);
      }
    }
  });

  it('the sections the design names are the ones linked', () => {
    expect(SECTIONS.barometer).toMatchObject({ chapter: 8, title: { el: expect.stringMatching(/^Το Βαρόμετρο/) } });
    expect(SECTIONS.afterWave).toMatchObject({ chapter: 8, title: { el: 'Μετά το Κύμα' } });
    expect(SECTIONS.shutdown).toMatchObject({ chapter: 6, title: { el: expect.stringMatching(/^Όταν το σύστημα σβήνει/) } });
    expect(SECTIONS.winds).toMatchObject({ chapter: 2, title: { el: 'Οι Άνεμοι του Συναισθήματος' } });
    expect(SECTIONS.gusts).toMatchObject({ chapter: 2, title: { el: 'Ριπές, Συστήματα, Κλίμα' } });
  });

  it('the axis chapter is the one the guide card opens, and its animation is on the page linked', () => {
    const n: Record<Axis, number> = { body: 1, breath: 2, attention: 3, space: 4 };
    for (const a of AXES) {
      expect(AXIS_CHAPTER[a].read.chapter).toBe(n[a]);
      expect(AXIS_CHAPTER[a].animation.chapter).toBe(n[a]);
      expect(AXIS_CHAPTER[a].animation.section).not.toBe(AXIS_CHAPTER[a].read.section);
      for (const lang of ['el', 'en'] as const) {
        const ch = CHAPTERS_DATA[lang].find(c => c.num === n[a])!;
        expect(ch.theorySections[AXIS_CHAPTER[a].animation.section - 1].interactive, `${a} (${lang})`).toBeTruthy();
      }
    }
  });

  it('the links open the chapter at the section, and «Άκου» starts there', () => {
    expect(sectionHref(SECTIONS.afterWave)).toBe('/chapters/8?s=5');
    expect(sectionHref(SECTIONS.shutdown, { listen: true })).toBe('/chapters/6?s=6&listen=1');
    expect(sectionHref(AXIS_CHAPTER.breath.animation, { animation: true })).toBe('/chapters/2?s=2&anim=1');
  });
});

describe('"How are you now?": the practices it suggests', () => {
  it('each practice exists and is named as its page names it', () => {
    for (const [key, p] of Object.entries(PRACTICES) as [string, PracticeLink][]) {
      if (p.to === '/practice/swaying') {
        expect(p.title).toEqual({ el: 'Λίκνισμα', en: 'Swaying' });
        continue;
      }
      const id = p.to.split('/').pop()!;
      const pattern = BREATH_PATTERNS.find(b => b.id === id);
      if (pattern) {
        // The page shows the subtitle and the name; the name alone is enough here.
        expect([breathName(pattern), pattern.title], key).toContainEqual(p.title);
      } else {
        expect(GUIDED_EXERCISES[id]?.title, key).toEqual(p.title);
        const m = GUIDED_EXERCISES[id].duration / 60;
        expect(p.dur, key).toEqual({ el: `${m} λεπτ${m === 1 ? 'ό' : 'ά'}`, en: `${m} min` });
      }
      expect(PRACTICE_CATALOG.some(i => i.path === p.to) || p.to === '/practice/swaying', key).toBe(true);
    }
  });

  it('in tension, only body and breath, and never a breath with a hold', () => {
    for (const { route, before, path } of [...everyRoute()].filter(r => r.now === 'hyper')) {
      for (const to of practicePaths(route)) {
        const id = to.split('/').pop()!;
        const pattern = BREATH_PATTERNS.find(b => b.id === id);
        if (pattern) {
          const hold = pattern.phases.some(ph => ph.armFrom === ph.armTo);
          expect(hold, `${to} after ${path} (before: ${before})`).toBe(false);
        }
        const item = PRACTICE_CATALOG.find(i => i.path === to);
        expect(item, to).toBeTruthy();
        expect(['body', 'breath'], to).toContain(item!.axis);
        expect(CHECKIN_TAGS[item!.id], to).toContain('hyper');
      }
    }
  });

  it('after a breath practice, tension goes to the body (another door); otherwise to 4-6', () => {
    const t = (axis: Axis, path: string) => {
      const m = afterPractice('hyper', { axis, path }).main;
      return m.kind === 'practice' ? m.practice.to : m.kind;
    };
    expect(t('breath', '/practice/breath/breath-5-5')).toBe(PRACTICES.gravity.to);
    expect(t('breath', '/practice/breath/breath-4-6')).toBe(PRACTICES.gravity.to);
    expect(t('body', '/practice/body/grounding-scan')).toBe(PRACTICES.longExhale.to);
    expect(t('attention', '/practice/focus/labeling-technique')).toBe(PRACTICES.longExhale.to);
  });

  it('never suggests the practice just done as the next one', () => {
    for (const { route, path, now, before } of everyRoute()) {
      const m = route.main;
      if (m.kind === 'practice') expect(m.practice.to, `${now} after ${path} (before: ${before})`).not.toBe(path);
    }
  });

  it('numbness: Swaying or Humming, then Chapter 6 with «Άκου» first', () => {
    const after = (path: string) => afterPractice('hypo', { axis: 'body', path });
    expect(after('/practice/breath/breath-5-5').main).toEqual({ kind: 'practice', practice: PRACTICES.swaying });
    expect(after('/practice/swaying').main).toEqual({ kind: 'practice', practice: PRACTICES.humming });
    expect(after('/practice/swaying').secondary).toEqual([{ kind: 'chapter', link: SECTIONS.shutdown, later: true, listenFirst: true }]);
  });
});

describe('"How are you now?": what it says', () => {
  it('one main action and at most two others, always', () => {
    for (const { route } of everyRoute()) {
      expect(route.main).toBeTruthy();
      expect(route.secondary.length).toBeLessThanOrEqual(2);
      expect(route.lines.length).toBeGreaterThan(0);
      for (const l of route.lines) expect(l.el && l.en).toBeTruthy();
    }
  });

  it('calm opens the axis chapter (read or listen), its animation and the Journal', () => {
    const r = afterPractice('balanced', { axis: 'breath', path: '/practice/breath/breath-5-5' });
    expect(r.main).toEqual({ kind: 'chapter', link: AXIS_CHAPTER.breath.read });
    expect(r.secondary).toEqual([{ kind: 'animation', link: AXIS_CHAPTER.breath.animation }, { kind: 'journal' }]);
    expect(r.lines.map(l => l.el)).toEqual(['Μοιάζει να υπάρχει ηρεμία. Καλή στιγμή να δεις τι έκανες και γιατί.']);
  });

  it('before and now: self-regulation, the long winds, another door, the drifting note', () => {
    const el = (r: AfterRoute) => r.lines.map(l => l.el);
    expect(el(afterPractice('balanced', { axis: 'breath', before: 'hyper' }))[0]).toBe('Αυτό που μόλις έγινε λέγεται αυτορρύθμιση.');
    expect(el(afterPractice('balanced', { axis: 'breath', before: 'hypo' }))[0]).toBe('Αυτό που μόλις έγινε λέγεται αυτορρύθμιση.');
    expect(el(afterPractice('balanced', { axis: 'breath', before: 'balanced' }))).toHaveLength(1);

    const again = afterPractice('hyper', { axis: 'breath', before: 'hyper' });
    expect(el(again)).toContain('Κάποιοι άνεμοι κρατούν περισσότερο. Δεν απέτυχες.');
    expect(sectionsOf(again)).toEqual([SECTIONS.gusts]);
    expect(sectionsOf(afterPractice('hyper', { axis: 'breath' }))).toEqual([SECTIONS.barometer]);

    for (const now of ['hyper', 'hypo'] as const) {
      const r = afterPractice(now, { axis: 'breath', path: '/practice/breath/breath-5-5', before: 'balanced' });
      expect(el(r)).toContain('Αν η άσκηση σε ανέβασε ή σε θόλωσε, άλλαξε πόρτα.');
      expect(r.main).toEqual({ kind: 'practice', practice: PRACTICES.contact });
    }

    expect(afterPractice('hypo', { axis: 'space' }).drift).toBe(true);
    for (const now of ['hyper', 'balanced', 'unsure'] as const) expect(afterPractice(now, { axis: 'space' }).drift).toBe(false);
    expect(afterPractice('hypo', { axis: 'body' }).drift).toBe(false);
  });

  it('words of observation: no praise, no scores', () => {
    const words = [...everyRoute()].flatMap(({ route }) => route.lines.flatMap(l => [l.el, l.en])).join(' ');
    expect(words).not.toMatch(/Μπράβο|Βελτιώθηκ|Τέλεια|Εξαιρετικ|Well done|Great|Bravo|improved|%|score/i);
  });

  it('the answer leaves nothing behind (a plain function of what is shown)', () => {
    localStorage.clear();
    for (const _ of everyRoute()) void _;
    expect(localStorage.length).toBe(0);
  });
});

describe('the "before" from the home check-in', () => {
  it('travels in the link state only, and only as one of the four answers', () => {
    for (const c of CHOICES) expect(beforeFrom(beforeState(c))).toBe(c);
    for (const bad of [null, undefined, 'hyper', {}, { checkinBefore: 'happy' }, { checkinBefore: 3 }]) expect(beforeFrom(bad)).toBeNull();
  });
});
