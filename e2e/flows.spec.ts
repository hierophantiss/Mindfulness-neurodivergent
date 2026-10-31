import { test, expect } from '@playwright/test';
import { asReturningVisitor } from './helpers';

// The main things a person does, on a phone and on a computer.
test.beforeEach(async ({ page }) => asReturningVisitor(page));

test('"How do you feel" gives a practice for the moment', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ένταση' }).click();
  await expect(page.getByRole('button', { name: 'Ένταση' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Ξεκίνα').first()).toBeVisible();
});

test('the guide opens the first chapter, and the arrow keys turn the page', async ({ page, isMobile }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: /Ξεκίνα|Συνέχισε/ }).first().click();
  await expect(page).toHaveURL(/\/chapters\/1/);
  await expect(page.locator('h1').first()).toContainText('Σώμα');
  if (!isMobile) {
    // On a wide screen the pages of the chapter are listed beside the text.
    const pages = page.getByRole('navigation', { name: 'Σελίδες του κεφαλαίου' });
    await expect(pages).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText(/Σελίδα 2 από/)).toBeVisible();
  }
});

test('a breath starts without sound and counts', async ({ page }) => {
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  const close = page.getByRole('button', { name: 'Κλείσιμο', exact: true });
  if (await close.count()) await close.first().click();
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await page.getByRole('button', { name: 'Χωρίς ήχο', exact: true }).click();
  await expect(page.getByText(/Εκπνοή 6/)).toBeVisible();
});

test('Settings saves a copy of the data to a file', async ({ page }) => {
  await page.goto('/el/settings', { waitUntil: 'networkidle' });
  page.on('dialog', (d) => d.dismiss());
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Αποθήκευση Δεδομένων/ }).click();
  expect((await download).suggestedFilename()).toMatch(/^mindfulness-backup-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(page.getByText(/Τελευταίο:/)).toBeVisible();
});

test('the language changes to English', async ({ page, isMobile }) => {
  await page.goto('/el/practice', { waitUntil: 'networkidle' });
  if (isMobile) await page.getByRole('button', { name: 'Μενού' }).click();
  await page.getByRole('button', { name: 'Switch to English' }).first().click();
  await expect(page).toHaveURL(/\/en\/practice/);
  await expect(page.locator('h1').first()).toHaveText('Practice');
});

test('SOS is one tap away', async ({ page }) => {
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: /SOS/ }).first().click();
  await expect(page).toHaveURL(/sos-breath/);
});

test('an unknown address answers 404 with a way home', async ({ page }) => {
  const res = await page.goto('/el/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('link', { name: /στην αρχική|home/i }).first()).toBeVisible();
});
