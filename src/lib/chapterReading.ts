import type { Chapter } from '../data/types';

export type ReadLang = 'el' | 'en';

/**
 * How a piece of the chapter is spoken:
 * - heading: a title, followed by a short pause
 * - theory: ordinary reading
 * - card: a boxed note (key points, insight, reflection), introduced by its label
 * - practice: the exercise title, preceded by a longer pause
 * - step: one exercise step, read more slowly and followed by silence
 */
export type SegmentKind = 'heading' | 'theory' | 'card' | 'practice' | 'step';

export interface ReadSegment {
  /** Stable id, also used as `data-read-key` on the element that shows this text. */
  key: string;
  /** The chapter page (intro = 0, one per theory section, then the exercise page). */
  page: number;
  kind: SegmentKind;
  text: string;
}

const LABELS: Record<ReadLang, Record<string, string>> = {
  el: {
    keyPoints: 'Βασικά σημεία.',
    practice: 'Πρακτική άσκηση.',
    insight: 'Επίγνωση.',
    reflection: 'Αναστοχασμός.',
  },
  en: {
    keyPoints: 'Key points.',
    practice: 'Practice.',
    insight: 'Insight.',
    reflection: 'Reflection.',
  },
};

const PICTOGRAPHS = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

/** Turns display text into text a voice can read well. */
export function toSpeech(raw: string, lang: ReadLang): string {
  let s = raw || '';
  s = s.replace(/\{\{[^}]+\}\}/g, ''); // concept markers render as icons, not words
  s = s.replace(/https?:\/\/\S+/g, '');
  s = s.replace(/\b(?:doi:\s*)?10\.\d{4,9}\/\S+/gi, '');
  s = s.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '');
  s = s.replace(/\*\*|\*/g, '');
  s = s.replace(PICTOGRAPHS, '');
  s = s.replace(/[•★†∞☀]/g, '');
  s = s.replace(/\s*(?:→|—|–)\s*/g, ', ');
  // A slash is read out, so: όρθιος/η → όρθιος, γρήγορη/αργή → γρήγορη ή αργή.
  s = s.replace(/(\p{L}+)\/\p{L}{1,3}(?!\p{L})/gu, '$1');
  s = s.replace(/(\p{L}+)\/(?=\p{L})/gu, lang === 'el' ? '$1 ή ' : '$1 or ');
  s = s.replace(/\s*\/\s*/g, ', ');
  s = s.replace(/\b(\d+(?:-\d+)+)\b/g, (m) => m.split('-').join(', ')); // 4-7-8 → 4, 7, 8
  if (lang === 'el') s = s.replace(/\bet al\.?/g, 'και συνεργάτες');
  // A line break is a pause; give lines without end punctuation a full stop.
  s = s
    .split(/\n+/)
    .map((l) => l.trim().replace(/^\d+\.\s+/, ''))
    .filter(Boolean)
    .map((l) => (/[.!?;·:…»"')]$/.test(l) ? l : `${l}.`))
    .join(' ');
  s = s.replace(/\s+([,.;:!?·])/g, '$1').replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ');
  return s.trim();
}

/**
 * Splits text into short pieces for the speech engine. Short utterances avoid
 * the cut-off some browsers apply to long ones and let pause/resume restart
 * from the current sentence.
 */
export function toSentences(text: string, max = 220): string[] {
  const sentences = text.match(/[^.!?;·…]+(?:[.!?;·…]+["»')]*|$)/g) || [];
  const out: string[] = [];
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    if (sentence.length <= max) {
      out.push(sentence);
      continue;
    }
    let buf = '';
    for (const part of sentence.split(/(?<=,)\s+/)) {
      if (buf && (buf + ' ' + part).length > max) {
        out.push(buf);
        buf = part;
      } else {
        buf = buf ? `${buf} ${part}` : part;
      }
    }
    if (buf) out.push(buf);
  }
  return out;
}

/** The chapter as the reader speaks it, in the order of the chapter pages. */
export function buildChapterSegments(
  chapter: Chapter,
  takeaways: string[] | undefined,
  lang: ReadLang
): ReadSegment[] {
  const L = LABELS[lang];
  const segs: ReadSegment[] = [];
  const add = (key: string, page: number, kind: SegmentKind, raw: string) => {
    const text = toSpeech(raw, lang);
    if (text) segs.push({ key, page, kind, text });
  };

  add('intro-title', 0, 'heading', `${chapter.title}. ${chapter.sub}`);
  add('intro-summary', 0, 'theory', chapter.summary);
  if (chapter.tldr) add('intro-tldr', 0, 'theory', chapter.tldr);

  const sections = chapter.theorySections || [];
  sections.forEach((sec, i) => {
    const page = i + 1;
    add(`s${i}-title`, page, 'heading', sec.title);
    sec.paragraphs?.forEach((p, j) => add(`s${i}-p${j}`, page, 'theory', p));
    // The key-points card repeats on every theory page; it is read once, on the last one.
    if (i === sections.length - 1 && takeaways?.length) {
      add(`s${i}-key`, page, 'card', `${L.keyPoints}\n${takeaways.slice(0, 3).join('\n')}`);
    }
  });

  if (chapter.exercise || chapter.insight || chapter.reflection) {
    const page = sections.length + 1;
    if (chapter.exercise) {
      add('ex-title', page, 'practice', `${L.practice} ${chapter.exercise.title}`);
      chapter.exercise.steps.forEach((st, k) => add(`ex-step${k}`, page, 'step', st));
    }
    if (chapter.insight) add('insight', page, 'card', `${L.insight}\n${chapter.insight}`);
    if (chapter.reflection) add('reflection', page, 'card', `${L.reflection}\n${chapter.reflection}`);
  }
  return segs;
}
