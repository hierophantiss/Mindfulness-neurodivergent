import { describe, it, expect } from 'vitest';
import { PUBLIC_PREFIXES } from './publicRoutes';

describe('PUBLIC_PREFIXES regression guard', () => {
  it('contains every route that must be reachable by first-time visitors', () => {
    const required = ['/method', '/methodology', '/rabbithole', '/chapters', '/faq', '/practice', '/program', '/sanctuary'];
    for (const r of required) {
      expect(PUBLIC_PREFIXES).toContain(r);
    }
  });
});
