import { describe, it, expect } from 'vitest';
import { audioUrl, audioVersion, type ChapterTiming } from './chapterAudio';

describe('chapter audio address', () => {
  it('without a version, the plain file (as in the page metadata)', () => {
    expect(audioUrl('el', 3)).toBe('/audio/app-el-03.mp3');
  });

  it('changes when the audio is made again, so an old recording is never played against a new map', () => {
    const before = { duration: 409.567 } as ChapterTiming;
    const after = { duration: 431.2 } as ChapterTiming;
    expect(audioUrl('el', 1, audioVersion(before))).toBe('/audio/app-el-01.mp3?v=409.567');
    expect(audioUrl('el', 1, audioVersion(after))).not.toBe(audioUrl('el', 1, audioVersion(before)));
    expect(audioVersion(null)).toBeUndefined();
  });
});
