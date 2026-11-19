import { describe, expect, it } from 'vitest';
import { animAudioUrl, breathAt, markedClock, sceneAt, sceneLength, type AnimTiming } from './animVoice';
import narration from '../data/narration.json';

const T: AnimTiming = {
  v: 1, id: 'gravity', lang: 'el', rate: 0.85, duration: 70,
  scenes: [{ t0: 0.4, e: 10 }, { t0: 13, e: 21 }, { t0: 24, e: 52 }, { t0: 55, e: 66 }],
  breaths: [{ t: 27, phase: 'in', len: 4 }, { t: 31, phase: 'out', len: 6 }],
};

describe('the voice of the animations', () => {
  it('finds the scene and how far into it', () => {
    expect(sceneAt(T, 0)).toEqual({ scene: 0, clock: 0 });
    expect(sceneAt(T, 14)).toEqual({ scene: 1, clock: 1 });
    expect(sceneAt(T, 69).scene).toBe(3);
    expect(sceneLength(T, 1)).toBe(11);
    expect(sceneLength(T, 3)).toBe(15);
  });

  it('moves the breath with the spoken "in" and "out"', () => {
    expect(breathAt(T, 26).active).toBe(false);
    expect(breathAt(T, 26).down).toBe(0);
    const midIn = breathAt(T, 29);
    expect(midIn.rising).toBe(true);
    expect(midIn.force).toBeCloseTo(0.5, 5);
    const midOut = breathAt(T, 34);
    expect(midOut.rising).toBe(false);
    expect(midOut.down).toBeCloseTo(0.5, 5);
    // After the exhale the weight stays down.
    expect(breathAt(T, 40)).toMatchObject({ active: false, down: 1 });
  });

  it('asks for a new recording when the voice is made again', () => {
    expect(animAudioUrl('gravity', 'en', 70)).toBe('/audio/anim-gravity-en.mp3?v=70');
  });

  it('has the same scenes in Greek and English, each with something to say', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string }[][]>>).gravity;
    expect(g.el).toHaveLength(4);
    expect(g.en).toHaveLength(4);
    for (const lang of ['el', 'en']) {
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      expect(g[lang].flat().filter(st => st.breath).map(st => st.breath)).toEqual(['in', 'out', 'in', 'out']);
    }
  });

  it('guides "Inner touch" (Chapter 2) through five scenes, saying where to notice, never when to breathe', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string }[][]>>).innertouch;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(5);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      expect(g[lang].flat().some(st => st.breath)).toBe(false);
    }
  });

  it('guides "The four forms of attention" (Chapter 3) through five scenes, never setting the breath', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string }[][]>>).attention;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(5);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      expect(g[lang].flat().some(st => st.breath)).toBe(false);
    }
  });

  it('guides the Samatha page (Chapter 3) through its ten phases', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string }[][]>>).samatha;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(10);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
    }
  });

  it('guides "Open awareness" (Chapter 4) through its four scenes, never setting the breath', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string }[][]>>).openawareness;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(4);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      expect(g[lang].flat().some(st => st.breath)).toBe(false);
    }
  });

  it('guides "The racing mind" (Chapters 3 and 5) through its four scenes, never setting the breath', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string }[][]>>).racingmind;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(4);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      expect(g[lang].flat().some(st => st.breath)).toBe(false);
    }
  });

  it('guides "The metronome of presence" (Chapter 6): two scenes, "right" and "left" on the sides of the swaying', () => {
    const g = (narration as unknown as Record<string, Record<string, { say?: string; breath?: string; ms?: number }[][]>>).metronome;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(2);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      expect(g[lang][0].some(st => st.breath)).toBe(false);
      const sides = g[lang][1].filter(st => st.breath);
      expect(sides.map(st => st.breath)).toEqual(['in', 'out', 'in', 'out']);
      expect(new Set(sides.map(st => st.ms)).size).toBe(1); // each side as long as the other
    }
  });

  it('bends the picture\'s clock so its moments meet the marked words', () => {
    const t: AnimTiming = { ...T, scenes: [{ t0: 0.4, e: 10 }, { t0: 20, e: 40 }], marks: [
      { scene: 1, name: 'thought', t: 26 }, { scene: 1, name: 'label', t: 30 }, { scene: 0, name: 'thought', t: 5 },
    ] };
    const keys = { thought: 3, label: 6 };
    expect(markedClock(t, 1, 0, keys)).toBe(0);
    expect(markedClock(t, 1, 6, keys)).toBeCloseTo(3, 5);   // "thought" is said 6 s into the scene
    expect(markedClock(t, 1, 8, keys)).toBeCloseTo(4.5, 5);
    expect(markedClock(t, 1, 10, keys)).toBeCloseTo(6, 5);  // "label"
    expect(markedClock(t, 1, 13, keys)).toBeCloseTo(9, 5);  // then at the voice's pace
    // No marks for the scene: the voice's clock.
    expect(markedClock({ ...T }, 1, 7, keys)).toBe(7);
  });

  it('guides "The four stages" (Chapter 10): five scenes, 4-6 breaths, the marks the picture follows', () => {
    type Step = { say?: string; breath?: string; ms?: number; mark?: string };
    const g = (narration as unknown as Record<string, Record<string, Step[][]>>).journey;
    for (const lang of ['el', 'en']) {
      expect(g[lang]).toHaveLength(5);
      for (const scene of g[lang]) expect(scene.some(st => st.say)).toBe(true);
      const br = g[lang].flat().filter(st => st.breath);
      expect(br.map(st => `${st.breath}${st.ms}`)).toEqual(['in4000', 'out6000', 'in4000', 'out6000', 'in4000', 'out6000']);
      expect(g[lang][3].filter(st => st.mark).map(st => st.mark)).toEqual(['thought', 'label', 'return']);
      expect(g[lang][4].filter(st => st.mark).map(st => st.mark)).toEqual(['right', 'left', 'up', 'down', 'all']);
    }
  });
});
