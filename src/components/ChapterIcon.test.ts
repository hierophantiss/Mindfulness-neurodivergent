import { describe, it, expect } from 'vitest';
import { iconColor } from './ChapterIcon';
import { axisOfChapter } from '../lib/axisOfChapter';

describe('chapter marks', () => {
  it('lifts only the colours too deep to read', () => {
    expect(iconColor('#1A5F6E')).toContain('color-mix');
    expect(iconColor('#2E8B9A')).toBe('#2E8B9A');
    expect(iconColor('#C8922A')).toBe('#C8922A');
  });
  it('maps chapters 1–4 to the four axes, in order', () => {
    expect([1, 2, 3, 4, 5].map(axisOfChapter)).toEqual(['body', 'breath', 'attention', 'space', null]);
  });
});
