import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { asReturningVisitor } from './helpers';

// Accessibility (axe, WCAG A/AA, contrast included) on the main pages.
const PAGES = ['/el', '/en', '/el/chapters/2', '/el/practice', '/el/practice/breath/breath-5-5', '/el/sanctuary', '/el/program', '/el/settings', '/el/privacy', '/en/faq', '/el/glossary', '/en/about'];

test.beforeEach(async ({ page }) => asReturningVisitor(page));

for (const p of PAGES) {
  test(`${p} has no accessibility problems`, async ({ page }) => {
    await page.goto(p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const r = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  });
}

// «Πώς είσαι τώρα;» at the end of a practice, with an answer open (calm: the most links).
for (const answer of ['Ηρεμία', 'Μούδιασμα']) {
  test(`the question after a practice (${answer}) has no accessibility problems`, async ({ page }) => {
    await page.goto('/el/practice/breath/breath-5-5', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
    await page.getByRole('button', { name: 'Τέλος', exact: true }).click();
    await page.getByRole('button', { name: answer, exact: true }).click();
    await page.waitForTimeout(800);
    const r = await new AxeBuilder({ page: page as never }).include('[data-testid="after-practice"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
  });
}
