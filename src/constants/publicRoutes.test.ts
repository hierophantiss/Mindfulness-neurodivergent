import { describe, it, expect } from 'vitest';
import { PUBLIC_PREFIXES } from './publicRoutes';
import prerenderPaths from '../prerender-paths.json';

describe('public routes must stay prerendered', () => {
  it('every public prefix has /el and /en prerendered entries', () => {
    for (const prefix of PUBLIC_PREFIXES) {
      for (const lang of ['el', 'en']) {
        const expected = `/${lang}${prefix}`;
        const covered = (prerenderPaths as string[]).some(
          p => p === expected || p.startsWith(expected + '/')
        );
        expect(covered, `missing prerender coverage for ${expected}`).toBe(true);
      }
    }
  });
});
