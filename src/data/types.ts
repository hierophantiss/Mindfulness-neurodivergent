export interface Axis {
  name: string;
  icon: string;
  weeks: number[];
}

export interface ExerciseDefinition {
  title: string;
  steps: string[];
}

export interface CourseDay {
  title: string;
  where: string;
  dur: string;
  lesson: string;
  exercise?: ExerciseDefinition;
  breathing?: string;
  reflection: string;
  insight: string;
}

export interface CourseWeek {
  title: string;
  days: CourseDay[];
}

export type CourseData = Record<number, CourseWeek>;

export interface TheorySection {
  title: string;
  paragraphs: string[];
  image?: string;
}

export interface Chapter {
  num: number;
  title: string;
  sub: string;
  tag?: string;
  color: string;
  hex: string;
  icon: string;
  video?: string;
  summary: string;
  tldr?: string;
  theorySections: TheorySection[];
  exercise?: ExerciseDefinition;
  insight?: string;
  reflection?: string;
}

export interface Concept {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface CompanionChapterProgress {
  scrollPct: number;
  timeSpent: number;
  lastVisit: string;
  completed: boolean;
  visits: number;
}

export interface CompanionData {
  chapterProgress: Record<number, CompanionChapterProgress>;
  programProgress: { week: number; day: number; lastVisit: string | null };
  moodHistory: any[];
  dailyLogs: any[];
  activeDailyPlan: any | null;
  lastScreen: string;
  lastChapter: number | null;
  firstVisit: string;
  lastSeen: string | null;
  visits: { date: string; screen: string }[];
  bubbleCount: number;
  fabPos: { x: number; y: number } | null;
  dailyOpen: { date: string; count: number };
  posResetV3: boolean;
  introSeen: boolean;
  onboarded?: boolean;
}
