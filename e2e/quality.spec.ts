import { test, expect, type Page } from '@playwright/test';
import { asReturningVisitor } from './helpers';

// What the quality reviews of 21/11/2026 asked for: nothing covers SOS, a
// clear "delete all", a restore that asks first, a gentle word after a week
// done in a rush, and the Book tab opening where you left off.

test('the cat\'s bubble never covers the SOS of the «Ένταση» suggestion, and the first tap closes it', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ένταση' }).click();
  // The cat speaks a moment after the page settles (if it can without covering anything).
  await page.waitForTimeout(2200);
  const bubble = page.getByTestId('companion-bubble');
  if (await bubble.count()) {
    const b = await bubble.boundingBox();
    expect(b).not.toBeNull();
    const pressables = page.locator('main a[href], main button, a[href$="/practice/breath/sos-breath"]');
    const n = await pressables.count();
    for (let i = 0; i < n; i++) {
      const r = await pressables.nth(i).boundingBox();
      if (!r || !b || r.width === 0) continue;
      const overlap = b.x < r.x + r.width && b.x + b.width > r.x && b.y < r.y + r.height && b.y + b.height > r.y;
      expect(overlap, `the bubble covers «${(await pressables.nth(i).innerText()).slice(0, 40)}»`).toBe(false);
    }
    await page.mouse.click(10, 300);
    await expect(bubble).toHaveCount(0);
  }
  await expect(page.locator('a[href$="/practice/breath/sos-breath"]').filter({ visible: true }).first()).toBeVisible();
});

test('someone new finds the three welcome cards on the home page, without the cat', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  const line = page.getByTestId('home-welcome');
  await line.getByRole('button', { name: /Γνώρισε την εφαρμογή σε 3 κάρτες/ }).click();
  await expect(page.locator('#onboarding-title')).toBeVisible();
});

test.describe('as a returning visitor', () => {
  test.beforeEach(async ({ page }) => asReturningVisitor(page));

  test('«Delete all data» says what goes, offers a copy first, and needs a clear yes', async ({ page }) => {
    await page.goto('/el/settings', { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.setItem('journal_v2_2026-11-17', JSON.stringify({ text: 'κάτι', timestamp: 1 })));
    await page.getByRole('button', { name: /Διαγραφή όλων των δεδομένων/ }).click();
    const dialog = page.getByRole('alertdialog', { name: 'Διαγραφή όλων των δεδομένων' });
    await expect(dialog.getByTestId('delete-all-list')).toContainText('Το Ημερολόγιο');
    await expect(dialog.getByTestId('delete-all-list')).toContainText('Μειωμένη κίνηση');
    await expect(dialog.getByTestId('delete-all-list')).toContainText('πρόοδό σου');
    await expect(dialog.getByText(/χωρίς αναίρεση/)).toBeVisible();
    // A copy first: the backup window.
    await dialog.getByRole('button', { name: 'Κράτα πρώτα ένα αντίγραφο' }).click();
    await expect(page.getByRole('dialog', { name: 'Αντίγραφο των δεδομένων σου' })).toBeVisible();
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => localStorage.getItem('journal_v2_2026-11-17'))).not.toBeNull();
    // Then the clear yes.
    await page.getByRole('button', { name: /Διαγραφή όλων των δεδομένων/ }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Ναι, διάγραψέ τα όλα' }).click();
    await expect(page).toHaveURL(/\/(el)?\/?$/);
    expect(await page.evaluate(() => localStorage.getItem('journal_v2_2026-11-17'))).toBeNull();
    // Only in Settings: the menu has no second way.
  });

  test('a restore shows the copy\'s day and what it replaces before writing anything', async ({ page }) => {
    await page.goto('/el/settings', { waitUntil: 'networkidle' });
    const file = JSON.stringify({
      app: 'neurodivergent-mindfulness', version: 2, savedAt: '2026-11-03T10:00:00.000Z',
      data: { 'journal_v2_2026-11-02': JSON.stringify({ text: 'παλιό', timestamp: 1 }), awareness_progress: '{"completedChapters":["1"]}', mindfulness_lang: 'el' },
    });
    await page.getByRole('button', { name: /Επαναφορά από αντίγραφο/ }).click();
    const restore = page.getByRole('dialog', { name: 'Επαναφορά από αντίγραφο' });
    await restore.locator('input[type=file]').setInputFiles({ name: 'copy.json', mimeType: 'application/json', buffer: Buffer.from(file) });
    await expect(restore.getByText('Αντίγραφο της 3 Νοεμβρίου 2026.')).toBeVisible();
    await expect(restore.getByText(/Ημερολόγιο: 1 μέρα/)).toBeVisible();
    await expect(restore.getByText(/^Πρόοδος/)).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem('journal_v2_2026-11-02'))).toBeNull();
    await restore.getByRole('button', { name: 'Άκυρο' }).click();
    expect(await page.evaluate(() => localStorage.getItem('journal_v2_2026-11-02'))).toBeNull();
  });

  async function weekAlmostDone(page: Page, when: string) {
    await page.addInitScript((iso) => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      const days: Record<string, string> = {};
      const lessons: string[] = [];
      for (let d = 1; d <= 6; d++) { days[`1-${d}`] = iso; lessons.push(`1-${d}`); }
      localStorage.setItem('n_mindfulness_program_days', JSON.stringify(days));
      localStorage.setItem('awareness_progress', JSON.stringify({ completedLessons: lessons, completedChapters: [], chapterScheme: 2 }));
      localStorage.setItem('mindful_companion_v5', JSON.stringify({ chapterProgress: {}, programProgress: { week: 1, day: 6, lastVisit: null }, lastChapter: null, chapterScheme: 2, fabPos: null }));
    }, when);
    await page.goto('/el/program/week/1', { waitUntil: 'networkidle' });
    for (let i = 0; i < 6; i++) {
      const done = page.getByRole('button', { name: 'Ολοκλήρωση', exact: true });
      if (await done.count()) break;
      await page.getByRole('button', { name: 'Συνέχεια', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Ολοκλήρωση', exact: true }).click();
  }

  test('a week done in a day gets a gentle word, and both ways stay open', async ({ page }) => {
    await weekAlmostDone(page, new Date().toISOString());
    const note = page.getByTestId('quick-week');
    await expect(note).toContainText('Η μέθοδος γίνεται δική σου όταν την εξασκείς λίγο λίγο');
    await note.getByRole('button', { name: 'Μένω λίγο ακόμα εδώ' }).click();
    await expect(note).toHaveCount(0);
    await expect(page).toHaveURL(/\/program\/week\/1/);
  });

  test('a week done slowly goes on as before, with no word', async ({ page }) => {
    await weekAlmostDone(page, new Date(Date.now() - 6 * 86400000).toISOString());
    await expect(page).toHaveURL(/\/program$/, { timeout: 5000 });
  });

  test('the Book tab opens a chapter where it was left, with a way back to page 1', async ({ page }) => {
    await page.addInitScript(() => {
      if (sessionStorage.getItem('seeded')) return;
      sessionStorage.setItem('seeded', '1');
      localStorage.setItem('mindful_companion_v5', JSON.stringify({
        chapterProgress: { 2: { scrollPct: 0.3, page: 2, timeSpent: 0, lastVisit: new Date().toISOString(), completed: false, visits: 1 } },
        programProgress: { week: 0, day: 0, lastVisit: null }, lastChapter: 2, chapterScheme: 2, fabPos: null,
      }));
    });
    await page.goto('/el/chapters', { waitUntil: 'networkidle' });
    const card = page.locator('a[href$="/chapters/2"]').first();
    await expect(card).toContainText('σελ. 3 από');
    await card.click();
    await expect(page.getByText(/^Σελίδα 3 από \d+$/).filter({ visible: true })).toBeVisible();
    const note = page.getByTestId('chapter-resumed');
    await expect(note).toContainText('Συνεχίζεις από τη σελίδα 3');
    await note.getByRole('button', { name: 'Από την αρχή' }).click();
    await expect(page.getByText(/^Σελίδα 1 από \d+$/).filter({ visible: true })).toBeVisible();
  });
});
