import { expect, test, type Page } from '@playwright/test';
import { asReturningVisitor } from './helpers';

// «Πώς είσαι τώρα;» at the end of a practice (approved 28/11/2026): the answer
// leads to one next step; the chapter opens at the section; SOS has its light
// version; from the home check-in the "before" shows, and nothing is kept.

test.beforeEach(async ({ page }) => asReturningVisitor(page));

const question = (page: Page) => page.getByRole('heading', { name: 'Πώς είσαι τώρα;' });

/** Starts the practice on screen and brings it to its end (the clock is the test's own; runFor, not fastForward,
 *  which leaves the next page change waiting in the test browser). */
async function finishPractice(page: Page) {
  await page.getByRole('button', { name: /^Ξεκίνα/ }).first().click();
  const end = page.getByRole('button', { name: 'Τέλος', exact: true });
  for (let i = 0; i < 400 && !(await question(page).isVisible()); i++) {
    if (await end.isVisible()) { await end.click(); break; }
    await page.clock.runFor(1_000);
  }
  await expect(question(page)).toBeVisible();
}

test('after a breath practice: no answer keeps the guide card; «Ηρεμία» opens the chapter at its section', async ({ page }) => {
  await page.clock.install();
  await page.goto('/el/practice/breath/breath-5-5', { waitUntil: 'networkidle' });
  await finishPractice(page);
  const keys = await page.evaluate(() => Object.keys(localStorage).sort());

  // Not compulsory: the card of the guide, as before.
  await expect(page.getByRole('link', { name: /Στον οδηγό/ })).toHaveAttribute('href', '/el/chapters/2');

  await page.getByRole('button', { name: 'Ηρεμία', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ηρεμία', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('after-answer')).toContainText('Μοιάζει να υπάρχει ηρεμία.');
  await expect(page.getByRole('link', { name: /Στον οδηγό/ })).toHaveCount(0);
  // The answer is not kept anywhere.
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual(keys);

  await page.getByRole('link', { name: /^Διάβασε: Κεφάλαιο 2/ }).click();
  await expect(page).toHaveURL(/\/el\/chapters\/2\?s=3$/);
  await expect(page.getByRole('heading', { name: 'Οι Τρεις Ρυθμοί', exact: true })).toBeVisible();
  await expect(page.getByTestId('chapter-resumed')).toHaveCount(0);
});

test('in tension, one more regulation without a hold, SOS, and the chapter for later', async ({ page }) => {
  await page.clock.install();
  await page.goto('/el/practice/body/gravity-sink', { waitUntil: 'networkidle' });
  await finishPractice(page);
  await page.getByRole('button', { name: 'Ένταση', exact: true }).click();
  const answer = page.getByTestId('after-answer');
  await expect(answer).toContainText('Πρώτα το σώμα, το διάβασμα αργότερα.');
  await expect(answer.getByRole('link', { name: /Στην Κορύφωση · 4-6/ })).toHaveAttribute('href', '/el/practice/breath/breath-4-6');
  await expect(answer.getByRole('link', { name: 'SOS', exact: true })).toBeVisible();
  // (Opened afresh: after the test clock has run, the test browser leaves a page change waiting.)
  const later = answer.getByRole('link', { name: /Για αργότερα · Κεφάλαιο 8/ });
  await expect(later).toHaveAttribute('href', '/el/chapters/8?s=1');
  await page.goto('/el/chapters/8?s=1', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Το Βαρόμετρο: Πριν από την Καταιγίδα' })).toBeVisible();
});

test('SOS: «Ακόμα ένταση» gives «Ξανά» and the numbers; «Πέρασε» gives «Μετά το κύμα»', async ({ page }) => {
  await page.goto('/el/practice/breath/sos-breath', { waitUntil: 'networkidle' });
  await finishPractice(page);
  await page.getByRole('button', { name: 'Ακόμα ένταση', exact: true }).click();
  const answer = page.getByTestId('after-answer');
  await expect(answer.getByRole('button', { name: 'Ξανά', exact: true })).toBeVisible();
  await expect(answer.getByRole('link', { name: '1018' })).toHaveAttribute('href', 'tel:1018');
  await expect(answer.getByRole('link', { name: /Κεφάλαιο/ })).toHaveCount(0);

  await page.getByRole('button', { name: 'Πέρασε', exact: true }).click();
  await expect(answer).toContainText('Μετά το κύμα: νερό, φαγητό, ξεκούραση.');
  await answer.getByRole('link', { name: /Μετά το Κύμα/ }).click();
  await expect(page).toHaveURL(/\/el\/chapters\/8\?s=5$/);
  await expect(page.getByRole('heading', { name: 'Μετά το Κύμα', exact: true })).toBeVisible();
});

test('from the home check-in: «Πριν: Ένταση → Τώρα: Ηρεμία», and the Journal gets the line without losing what is written', async ({ page }) => {
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  const text = page.getByRole('textbox', { name: 'Τι παρατήρησα σήμερα' });
  await text.fill('Ήδη γραμμένο.');

  await page.clock.install();
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('group', { name: 'Πώς νιώθεις τώρα;' }).getByRole('button', { name: 'Ένταση' }).click();
  await page.getByRole('link', { name: /Πρόταση για τώρα/ }).first().click();
  await finishPractice(page);

  await page.getByRole('button', { name: 'Ηρεμία', exact: true }).click();
  const change = page.getByTestId('after-change');
  await expect(change).toContainText('Πριν: Ένταση');
  await expect(change).toContainText('Τώρα: Ηρεμία');
  await expect(page.getByTestId('after-answer')).toContainText('Αυτό που μόλις έγινε λέγεται αυτορρύθμιση.');

  await page.getByRole('link', { name: 'Γράψε στο Ημερολόγιο' }).click();
  await expect(page).toHaveURL(/\/el\/journal$/);
  await expect(page.getByText('Πριν: Ένταση → Τώρα: Ηρεμία', { exact: true })).toBeVisible();
  await expect(text).toHaveValue('Ήδη γραμμένο.');
  // Nothing of the answer was kept.
  const kept = await page.evaluate(() => Object.entries(localStorage).filter(([, v]) => v.includes('Τώρα')).map(([k]) => k));
  expect(kept).toEqual([]);
});

test('without the check-in there is no "before"', async ({ page }) => {
  await page.clock.install();
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  await finishPractice(page);
  await page.getByRole('button', { name: 'Ηρεμία', exact: true }).click();
  await expect(page.getByTestId('after-change')).toHaveCount(0);
});

test('in English, numbness after Swaying: Humming, and Chapter 6 to listen first', async ({ page }) => {
  await page.clock.install();
  await page.goto('/en/practice/swaying', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await page.clock.runFor(14_000);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'How are you now?' })).toBeVisible();
  await page.getByRole('button', { name: 'Numbness', exact: true }).click();
  const answer = page.getByTestId('after-answer');
  await expect(answer.getByRole('link', { name: /Humming \(Bhramari\)/ })).toHaveAttribute('href', '/en/practice/breath/bhramari-humming');
  await expect(answer.getByRole('link', { name: /^Listen: Chapter 6/ })).toHaveAttribute('href', '/en/chapters/6?s=6&listen=1');
  await expect(answer.getByRole('link', { name: /^Read: Chapter 6/ })).toHaveAttribute('href', '/en/chapters/6?s=6');
  await page.goto('/en/chapters/6?s=6', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'When the system shuts down (gentle activation)' })).toBeVisible();
});
