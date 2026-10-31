import { test } from '@playwright/test';
import { asReturningVisitor, openCleanly } from './helpers';

// Every main page, in both languages: it opens, has a title, no errors, no sideways scroll.
const PAGES = [
  '', '/chapters', '/chapters/1', '/chapters/7', '/chapters/11',
  '/practice', '/practice?category=breath', '/practice?category=movement', '/practice?category=vocal', '/practice?axis=body',
  '/practice/microdoses', '/practice/movement', '/practice/grounding', '/practice/swaying',
  '/practice/breath/breath-5-5', '/practice/breath/sos-breath', '/practice/breath/tai-chi-cloud-hands', '/practice/breath/bhramari-humming',
  '/sanctuary', '/program', '/program/week/1', '/journal', '/rabbithole', '/method', '/methodology', '/faq', '/settings', '/privacy', '/install',
];

test.beforeEach(async ({ page }) => asReturningVisitor(page));

for (const lang of ['el', 'en']) {
  for (const p of PAGES) {
    test(`${lang}${p || ' home'} opens cleanly`, async ({ page }) => {
      await openCleanly(page, `/${lang}${p}`);
    });
  }
}
