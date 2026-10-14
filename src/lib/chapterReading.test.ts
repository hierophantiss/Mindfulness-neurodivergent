import { describe, expect, it } from 'vitest';
import { CHAPTERS_DATA } from '../data/chapters';
import { CHAPTER_TAKEAWAYS } from '../data/takeaways';
import { buildChapterSegments, toSentences, toSpeech } from './chapterReading';

describe('toSpeech', () => {
  it('drops markers, markup, links and icons', () => {
    const out = toSpeech('Η γείωση{{grounding}} <strong>ξεκινά</strong> **εδώ** 🌊 https://x.org/a', 'el');
    expect(out).toBe('Η γείωση ξεκινά εδώ.');
  });

  it('reads breathing rhythms as numbers, not as a minus', () => {
    expect(toSpeech('Ρυθμός 4-7-8 και 4-6', 'el')).toBe('Ρυθμός 4, 7, 8 και 4, 6.');
  });

  it('does not read slashes out', () => {
    expect(toSpeech('Αναπνοή / Αέρας: στάσου όρθιος/η (γρήγορη/αργή)', 'el')).toBe('Αναπνοή, Αέρας: στάσου όρθιος (γρήγορη ή αργή)');
    expect(toSpeech('fast/slow, 1979/2014', 'en')).toBe('fast or slow, 1979, 2014.');
  });

  it('turns lines into sentences', () => {
    expect(toSpeech('• Πρώτο\n• Δεύτερο;\n1. Τρίτο', 'el')).toBe('Πρώτο. Δεύτερο; Τρίτο.');
  });
});

describe('toSentences', () => {
  it('keeps every piece short', () => {
    const long = Array.from({ length: 30 }, (_, i) => `κομμάτι ${i}`).join(', ') + '.';
    const parts = toSentences(`Πρώτη πρόταση. ${long} Τρίτη;`);
    expect(parts[0]).toBe('Πρώτη πρόταση.');
    expect(parts.at(-1)).toBe('Τρίτη;');
    parts.forEach((p) => expect(p.length).toBeLessThanOrEqual(230));
  });
});

describe('buildChapterSegments', () => {
  for (const lang of ['el', 'en'] as const) {
    for (const chapter of CHAPTERS_DATA[lang]) {
      it(`${lang} chapter ${chapter.num} reads cleanly, page by page`, () => {
        const segs = buildChapterSegments(chapter, CHAPTER_TAKEAWAYS[lang][chapter.num], lang);
        const lastPage = chapter.theorySections.length + (chapter.exercise || chapter.insight || chapter.reflection ? 1 : 0);
        expect(new Set(segs.map((s) => s.key)).size).toBe(segs.length);
        let prevPage = 0;
        for (const s of segs) {
          expect(s.text.length).toBeGreaterThan(0);
          expect(s.text).not.toMatch(/[{}<>*/]|https?:/);
          expect(s.page).toBeGreaterThanOrEqual(prevPage);
          expect(s.page).toBeLessThanOrEqual(lastPage);
          prevPage = s.page;
        }
        if (chapter.exercise) {
          expect(segs.filter((s) => s.kind === 'step')).toHaveLength(chapter.exercise.steps.length);
        }
      });
    }
  }
});
