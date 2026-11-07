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

test('the offline note closes with its ×', async ({ page, context }) => {
  await page.goto('/en', { waitUntil: 'networkidle' });
  await context.setOffline(true);
  await expect(page.getByRole('heading', { name: 'Offline Mode' })).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).last().click();
  await expect(page.getByRole('heading', { name: 'Offline Mode' })).toHaveCount(0);
  await context.setOffline(false);
});

test('the menu leads to Settings', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /^(Μενού|Περισσότερα)/ }).first().click();
  await page.getByRole('button', { name: 'Ρυθμίσεις', exact: true }).click();
  await expect(page).toHaveURL(/\/settings/);
  await expect(page.getByRole('heading', { name: 'Ρυθμίσεις' })).toBeVisible();
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

test("the Journal already knows the day's \"How do you feel\"", async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ένταση' }).first().click();
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  await expect(page.getByRole('button', { name: 'Ένταση' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Από το «Πώς νιώθεις» της αρχικής')).toBeVisible();
});

test('Settings makes a daily calendar reminder', async ({ page }) => {
  await page.goto('/el/settings', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Υπενθύμιση στο ημερολόγιο/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Υπενθύμιση στο ημερολόγιο' });
  await expect(dialog).toBeVisible();
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /Πρόσθεσε στο ημερολόγιο/ }).click();
  expect((await download).suggestedFilename()).toBe('ypenthymisi.ics');
});

test('the chapter list offers the audio for listening offline', async ({ page }) => {
  await page.goto('/el/chapters', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Ακρόαση χωρίς σύνδεση' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Κατέβασε/ })).toBeVisible();
});

test('the Journal makes a PDF of the week', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ηρεμία' }).first().click();
  await page.evaluate(() => {
    const d = new Date();
    const key = `journal_v2_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    localStorage.setItem(key, JSON.stringify({ text: 'Τάι Τσι στο μπαλκόνι.', mood: null, axes: ['body'], timestamp: Date.now() }));
  });
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Εβδομάδα και παλιότερες μέρες' }).click();
  const card = page.getByRole('region', { name: 'Η εβδομάδα μου' });
  await expect(card).toBeVisible();
  await expect(card.getByRole('img')).toHaveAttribute('aria-label', /Ηρεμία/);
  await expect(card.getByRole('button', { name: 'Επόμενη εβδομάδα' })).toBeDisabled();
  await card.getByRole('radio', { name: 'Με τις σημειώσεις' }).click();
  const download = page.waitForEvent('download');
  await card.getByRole('button', { name: 'Κατέβασε PDF' }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/^evdomada-\d{4}-\d{2}-\d{2}\.pdf$/);
  const { readFile } = await import('fs/promises');
  const bytes = await readFile((await file.path())!);
  expect(bytes.subarray(0, 5).toString()).toBe('%PDF-');
  // an earlier week, nothing in it yet
  await card.getByRole('button', { name: 'Προηγούμενη εβδομάδα' }).click();
  await expect(card.getByText(/Δεν έχει ακόμα τίποτα/)).toBeVisible();
});
