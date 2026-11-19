import { expect, test } from '@playwright/test';
import { asReturningVisitor } from './helpers';

// The bridges of the pedagogical review (19/11/2026): a reflection opens the
// Journal with its question, and the Program and the chapters lead to each other.

test.beforeEach(async ({ page }) => asReturningVisitor(page));

test('a chapter\'s reflection opens the Journal with its question, keeping what is written', async ({ page }) => {
  // Something already written today.
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  const text = page.getByRole('textbox', { name: 'Τι παρατήρησα σήμερα' });
  await text.fill('Ήδη γραμμένο.');

  // The last page of Chapter 1 (the practice), and its reflection.
  await page.goto('/el/chapters/1?p=99', { waitUntil: 'networkidle' });
  const question = 'Μετά την άσκηση, τι παρατήρησα στο σώμα μου;';
  await expect(page.getByText(question, { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Γράψε στο Ημερολόγιο' }).click();

  await expect(page).toHaveURL(/\/el\/journal$/);
  await expect(page.getByText('Ερώτηση της ημέρας')).toBeVisible();
  await expect(page.getByText(question, { exact: true })).toBeVisible();
  await expect(text).toHaveValue('Ήδη γραμμένο.');

  // "Write about it" adds the question under what was there.
  await page.getByRole('button', { name: 'Γράψε γι\' αυτήν' }).click();
  await expect(text).toHaveValue(`Ήδη γραμμένο.\n\n~ ${question}\n`);
});

test('a Program day\'s reflection opens the Journal with its question', async ({ page }) => {
  await page.goto('/el/program/week/1', { waitUntil: 'networkidle' });
  // Lesson → exercise → breathing → reflection, one slide at a time.
  const question = 'Πώς ένιωσα επανενεργοποιώντας την αίσθηση της βαρύτητας;';
  for (const shown of ['Νιώσε τη Βαρύτητα:', 'Καμία απαίτηση']) {
    await page.getByRole('button', { name: 'Συνέχεια' }).click();
    await expect(page.getByText(shown, { exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Συνέχεια' }).click();
  await expect(page.getByText(question, { exact: true })).toBeVisible();
  await expect(page.getByText('Με μια φράση', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Γράψε στο Ημερολόγιο' }).click();
  await expect(page).toHaveURL(/\/el\/journal$/);
  await expect(page.getByText(question, { exact: true })).toBeVisible();
});

test('week 1 of the Program leads to Chapter 1, and Chapter 1 back to its weeks', async ({ page }) => {
  await page.goto('/el/program/week/1', { waitUntil: 'networkidle' });
  const toChapter = page.getByRole('link', { name: /Κεφάλαιο 1 · Σώμα/ });
  await expect(toChapter).toHaveAttribute('href', '/el/chapters/1');

  await page.goto('/el/chapters/1?p=99', { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: /Εβδομάδα 1/ })).toHaveAttribute('href', '/el/program/week/1');
  await expect(page.getByRole('link', { name: /Εβδομάδα 2/ })).toHaveAttribute('href', '/el/program');
});

test('in English too: week 7 leads to Chapter 4 and shows the way back from drifting', async ({ page }) => {
  // Someone who has reached week 7.
  await page.addInitScript(() => {
    localStorage.setItem('mindful_companion_v5', JSON.stringify({ programProgress: { week: 7, day: 0, lastVisit: null } }));
  });
  await page.goto('/en/program/week/7', { waitUntil: 'networkidle' });
  await expect(page.getByRole('link', { name: /Chapter 4 · Space/ })).toHaveAttribute('href', '/en/chapters/4');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('note', { name: /drifting away/ })).toBeVisible();
});
