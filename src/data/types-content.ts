// Standalone types for the content: the 8-week program and the FAQ.

/** One day of the 8-week program. */
export interface CourseDay {
  title: string;
  /** How long it takes, in words ("10 λεπτά"). */
  dur: string;
  /** Where to do it. */
  where: string;
  lesson: string;
  breathing: string;
  exercise: { title: string; steps: string[] };
  insight: string;
  reflection: string;
}

/** One week of the program. */
export interface CourseWeek {
  title: string;
  days: CourseDay[];
}

/** The program in one language: week number → week. */
export type Course = Record<number, CourseWeek>;

/** One question and its answer. */
export interface FaqItem {
  q: string;
  a: string;
  /** 1 a first question … 3 a deeper one. */
  depth: number;
  tags: string[];
  /** Where to read more: a concept, a chapter or an exercise. */
  relatedConcept?: string;
  relatedChapter?: number;
  relatedExercise?: string;
  /** A page of the app that answers more fully (e.g. '/methodology'). */
  relatedPage?: string;
  /** A question to ask next. */
  followUp?: string;
}

/** The FAQ: chapter (or group) number → its questions in both languages. */
export type Faq = Record<number, { el: FaqItem[]; en: FaqItem[] }>;
