import { expect, test } from '@playwright/test';

// The two pieces people use most, end to end in a real browser: a breath
// practice (its phases in time, the count, finishing, the record) and the
// Journal (what is written stays, day by day, and can be found again).
// The clock is the test's own, so a minute of breathing takes a moment.

const phase = (page: import('@playwright/test').Page) => page.getByTestId('breath-phase');

test('a breath practice keeps its time, counts the cycles, and is recorded when completed', async ({ page }) => {
  // Half a minute of breathing, every frame drawn: it takes a while.
  test.setTimeout(150_000);
  await page.clock.install();
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  const close = page.getByRole('button', { name: 'Κλείσιμο', exact: true });
  if (await close.count()) await close.first().click();

  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await expect(phase(page)).toHaveText('Εισπνοή');
  await page.clock.runFor(4_300);
  await expect(phase(page)).toHaveText('Εκπνοή');
  await page.clock.runFor(6_000);
  await expect(phase(page)).toHaveText('Εισπνοή');
  await expect(page.getByText('Κύκλοι')).toBeVisible();

  // Three cycles in all (30 s), then Space pauses (as the button does).
  const count = page.locator('text=Κύκλοι').locator('..');
  await page.clock.runFor(19_800);
  for (let i = 0; i < 10 && !(await count.textContent())?.includes('3'); i++) await page.clock.runFor(100);
  await expect(count).toContainText('3');
  await page.keyboard.press('Space');
  await expect(phase(page)).toHaveText('');
  await expect(page.getByRole('button', { name: 'Συνέχισε', exact: true }).first()).toBeVisible();

  await page.getByRole('button', { name: 'Τέλος', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Τέλος. Πάρε μια στιγμή' })).toBeVisible();
  const record = await page.evaluate(() => JSON.parse(localStorage.getItem('neurodivergent_mindfulness_detailed_activity_logs') || '[]'));
  const last = record[record.length - 1];
  expect(last).toMatchObject({ itemId: 'breath-4-6', completed: true });
  expect(last.durationSeconds).toBeGreaterThanOrEqual(30);
});

test('a practice stopped in the first seconds is not recorded', async ({ page }) => {
  await page.clock.install();
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  const close = page.getByRole('button', { name: 'Κλείσιμο', exact: true });
  if (await close.count()) await close.first().click();
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await page.clock.runFor(5_000);
  await page.getByRole('button', { name: 'Παύση', exact: true }).click();
  const record = await page.evaluate(() => JSON.parse(localStorage.getItem('neurodivergent_mindfulness_detailed_activity_logs') || '[]'));
  expect(record.filter((r: { itemId: string }) => r.itemId === 'breath-4-6')).toEqual([]);
});

test('the Journal keeps each day\'s writing, apart from the others, and finds it again', async ({ page }) => {
  await page.goto('/el/journal', { waitUntil: 'networkidle' });
  const text = page.getByRole('textbox', { name: 'Τι παρατήρησα σήμερα' });

  // Today.
  await text.fill('Σήμερα πρόσεξα το βάρος στα πόδια.');
  await page.getByRole('group', { name: 'Πώς ένιωθα' }).getByRole('button').first().click();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(text).toHaveValue('Σήμερα πρόσεξα το βάρος στα πόδια.');
  await expect(page.getByRole('group', { name: 'Πώς ένιωθα' }).getByRole('button').first()).toHaveAttribute('aria-pressed', 'true');

  // Yesterday: its own page.
  await page.getByRole('button', { name: 'Προηγούμενη μέρα' }).click();
  await expect(text).toHaveValue('');
  await text.fill('Χθες: μια ανάσα πριν απαντήσω.');
  await page.getByRole('button', { name: 'Επόμενη μέρα' }).click();
  await expect(text).toHaveValue('Σήμερα πρόσεξα το βάρος στα πόδια.');

  // Found again among the earlier days.
  await page.getByRole('button', { name: 'Εβδομάδα και παλιότερες μέρες' }).click();
  await page.getByLabel('Αναζήτηση στις μέρες').fill('ανάσα');
  const found = page.getByRole('button', { name: /μια ανάσα πριν απαντήσω/ });
  await expect(found).toHaveCount(1);
  await expect(page.getByRole('button', { name: /βάρος στα πόδια/ })).toHaveCount(0);
  await found.click();
  await expect(text).toHaveValue('Χθες: μια ανάσα πριν απαντήσω.');

  // Emptied, a day keeps nothing.
  await text.fill('');
  const kept = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('journal_v2_')).length);
  expect(kept).toBe(1);
});
