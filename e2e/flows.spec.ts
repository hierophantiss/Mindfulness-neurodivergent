import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
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
    await expect(page.getByText(/Σελίδα 2 από/).filter({ visible: true })).toBeVisible();
  }
});

test('a chapter says once that its pages turn like a book, and where you are', async ({ page, isMobile }) => {
  await page.goto('/el/chapters/1', { waitUntil: 'networkidle' });
  const hint = page.getByRole('note').filter({ hasText: 'Σαν βιβλίο' });
  await expect(hint).toBeVisible();
  await expect(hint).toContainText(isMobile ? 'σύρε προς τα αριστερά' : 'βελάκια');
  await expect(page.getByText(/^Σελίδα 1 από \d+$/).filter({ visible: true })).toBeVisible();
  await page.getByRole('button', { name: /Επόμενη σελίδα/ }).click();
  await expect(page.getByText(/^Σελίδα 2 από \d+$/).filter({ visible: true })).toBeVisible();
  await expect(hint).toHaveCount(0);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.getByRole('note').filter({ hasText: 'Σαν βιβλίο' })).toHaveCount(0);
});

test('a Rabbit Hole text: the next page opens at its top', async ({ page }) => {
  await page.goto('/el/rabbithole/wave-and-sea', { waitUntil: 'networkidle' });
  const text = page.getByRole('dialog').getByRole('region', { name: 'Το κείμενο' });
  await expect(text).toBeVisible();
  await text.evaluate(el => { el.scrollTop = el.scrollHeight; });
  expect(await text.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Επόμενη σελίδα' }).click();
  await expect.poll(() => text.evaluate(el => el.scrollTop)).toBe(0);
});

test('a breath starts without sound and counts', async ({ page }) => {
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('breath-phase-word')).toHaveText('Εισπνοή');
  await expect(page.getByText(/Εκπνοή 6/)).toBeVisible();
});

test('SOS starts at once, with no window in between, and the sound stays one tap away', async ({ page }) => {
  await page.goto('/el/practice/breath/sos-breath', { waitUntil: 'networkidle' });
  // What will happen, before starting: the cycle and the steps.
  await expect(page.getByTestId('breath-cycle')).toContainText('Εισπνοή 4');
  await expect(page.getByRole('heading', { name: 'Πώς γίνεται' })).toBeVisible();
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByTestId('breath-phase')).toHaveText('Εισπνοή');
  await expect(page.getByRole('button', { name: 'Παύση', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Τέλος', exact: true })).toBeVisible();
  // The sound window opens only from «Ήχος»: «Χωρίς ήχο» first, and chosen.
  await page.getByTestId('breath-sound').click();
  const dialog = page.getByRole('dialog', { name: 'Ήχος για την άσκηση' });
  const choices = dialog.getByRole('button').filter({ hasText: /Χωρίς ήχο|Ήχος φύσης|Binaural/ });
  await expect(choices.first()).toContainText('Χωρίς ήχο');
  await expect(choices.first()).toHaveAttribute('aria-pressed', 'true');
  // The help line points on to people, 112 first.
  await dialog.getByRole('button', { name: 'Κλείσιμο' }).click();
  await expect(page.getByText(/το επόμενο βήμα είναι ένας άνθρωπος/)).toBeVisible();
});

test('with «No sound» nothing rings at the end, and vibration follows its switch', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __buzz: unknown[]; __oscs: number };
    w.__buzz = []; w.__oscs = 0;
    (navigator as unknown as { vibrate: (p: unknown) => boolean }).vibrate = (p: unknown) => { w.__buzz.push(p); return true; };
    const orig = AudioContext.prototype.createOscillator;
    AudioContext.prototype.createOscillator = function (this: AudioContext) { w.__oscs++; return orig.call(this); };
  });
  await page.clock.install();
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  // Vibration off from the practice's own switch.
  const vib = page.getByRole('switch', { name: 'Δόνηση' });
  await expect(vib).toHaveAttribute('aria-checked', 'true');
  await vib.click();
  await expect(vib).toHaveAttribute('aria-checked', 'false');
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await page.clock.runFor(12_000);
  await page.getByRole('button', { name: 'Τέλος', exact: true }).click();
  await page.clock.runFor(1_000);
  const seen = await page.evaluate(() => {
    const w = window as unknown as { __buzz: unknown[]; __oscs: number };
    return { buzz: w.__buzz.length, oscs: w.__oscs };
  });
  expect(seen).toEqual({ buzz: 0, oscs: 0 });
  // The same setting in Settings.
  await page.goto('/el/settings', { waitUntil: 'networkidle' });
  await expect(page.getByRole('switch', { name: /^Δόνηση/ })).toHaveAttribute('aria-checked', 'false');
});

test('vibration is on until turned off, and then the breath does not buzz', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __buzz: unknown[] };
    w.__buzz = [];
    (navigator as unknown as { vibrate: (p: unknown) => boolean }).vibrate = (p: unknown) => { w.__buzz.push(p); return true; };
  });
  await page.clock.install();
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await page.clock.runFor(5_000);
  expect(await page.evaluate(() => (window as unknown as { __buzz: unknown[] }).__buzz.length)).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Παύση', exact: true }).click();
  await page.goto('/el/settings', { waitUntil: 'networkidle' });
  await page.getByRole('switch', { name: /^Δόνηση/ }).click();
  await page.goto('/el/practice/breath/breath-4-6', { waitUntil: 'networkidle' });
  await page.evaluate(() => { (window as unknown as { __buzz: unknown[] }).__buzz = []; });
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  await page.clock.runFor(12_000);
  expect(await page.evaluate(() => (window as unknown as { __buzz: unknown[] }).__buzz.length)).toBe(0);
});

test('the offline note closes with its ×', async ({ page, context }) => {
  await page.goto('/en', { waitUntil: 'networkidle' });
  // The page itself first (not the text it arrived with): the note listens
  // for the change only once the app is on screen.
  await expect(page.getByRole('heading', { name: 'How do you feel right now?' })).toBeVisible();
  // Offline, the rest of the app comes from the service worker: wait until it
  // has taken the page, or a part that loads late could fail and reload it.
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return;
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>(r => { navigator.serviceWorker.addEventListener('controllerchange', () => r(), { once: true }); setTimeout(r, 4000); });
  });
  // The note may start listening a moment after the page shows: if the change
  // came too early for it, make the change again.
  await expect(async () => {
    await context.setOffline(false);
    await context.setOffline(true);
    await expect(page.getByRole('heading', { name: 'Offline Mode' })).toBeVisible({ timeout: 2500 });
  }).toPass({ timeout: 30000 });
  // The note slides in and leaves by itself after a few seconds: click it as soon
  // as it is there, without waiting for the slide to settle (on a busy machine
  // it could be gone first).
  await page.getByRole('button', { name: 'Close', exact: true }).last().click({ force: true });
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
  await page.getByRole('button', { name: /Αποθήκευση αντιγράφου/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Αντίγραφο των δεδομένων σου' });
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: 'Αποθήκευση αντιγράφου' }).click();
  expect((await download).suggestedFilename()).toMatch(/^mindfulness-backup-\d{4}-\d{2}-\d{2}\.json$/);
  await expect(dialog.getByText('Το αντίγραφο αποθηκεύτηκε.')).toBeVisible();
  await dialog.getByRole('button', { name: 'Κλείσιμο' }).click();
  await expect(page.getByText(/Τελευταίο:/)).toBeVisible();
});

test('a copy locked with a passphrase comes back only with it, and the journal returns', async ({ page }) => {
  await page.goto('/el/settings', { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.setItem('journal_v2_2026-11-17', JSON.stringify({ text: 'κάτι ιδιωτικό', mood: null, state: null, axes: [], timestamp: 1 })));
  // Save, locked.
  await page.getByRole('button', { name: /Αποθήκευση αντιγράφου/ }).click();
  const save = page.getByRole('dialog', { name: 'Αντίγραφο των δεδομένων σου' });
  await save.getByLabel('Κλείδωσε το με κωδικό').check();
  await expect(save.getByText(/Αν ξεχάσεις τον κωδικό/)).toBeVisible();
  const a11y = await new AxeBuilder({ page: page as never }).include('[role=dialog]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(a11y.violations.map(v => v.id)).toEqual([]);
  const button = save.getByRole('button', { name: 'Αποθήκευση αντιγράφου' });
  await save.getByLabel('Κωδικός', { exact: true }).fill('ένας καλός κωδικός');
  await save.getByLabel('Ξανά ο κωδικός').fill('ένας άλλος');
  await expect(button).toBeDisabled();
  await save.getByLabel('Ξανά ο κωδικός').fill('ένας καλός κωδικός');
  const download = page.waitForEvent('download');
  await button.click();
  const d = await download;
  expect(d.suggestedFilename()).toMatch(/-locked\.json$/);
  const file = await d.path();
  const text = (await import('node:fs')).readFileSync(file!, 'utf8');
  expect(text).not.toContain('ιδιωτικό');
  await save.getByRole('button', { name: 'Κλείσιμο' }).click();

  // Gone from the device; restore with a wrong, then the right passphrase.
  await page.evaluate(() => localStorage.removeItem('journal_v2_2026-11-17'));
  await page.getByRole('button', { name: /Επαναφορά από αντίγραφο/ }).click();
  const restore = page.getByRole('dialog', { name: 'Επαναφορά από αντίγραφο' });
  await restore.locator('input[type=file]').setInputFiles({ name: 'copy.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  await restore.getByLabel('Κωδικός').fill('λάθος κωδικός');
  await restore.getByRole('button', { name: 'Άνοιγμα', exact: true }).click();
  await expect(restore.getByText(/Ο κωδικός δεν ταιριάζει/)).toBeVisible({ timeout: 20_000 });
  expect(await page.evaluate(() => localStorage.getItem('journal_v2_2026-11-17'))).toBeNull();
  await restore.getByLabel('Κωδικός').fill('ένας καλός κωδικός');
  await restore.getByRole('button', { name: 'Άνοιγμα', exact: true }).click();
  // First what the copy holds and its day; nothing written yet.
  await expect(restore.getByText(/^Αντίγραφο της /)).toBeVisible({ timeout: 20_000 });
  await expect(restore.getByText(/Ημερολόγιο: 1 μέρα/)).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('journal_v2_2026-11-17'))).toBeNull();
  await restore.getByRole('button', { name: 'Ναι, επανάφερέ το' }).click();
  // The app starts again at once and says, on that start, that it was done.
  await expect(page.getByRole('status').filter({ hasText: 'Η επαναφορά από το αντίγραφο έγινε' })).toBeVisible({ timeout: 20_000 });
  await expect.poll(() => page.evaluate(() => localStorage.getItem('journal_v2_2026-11-17')), { timeout: 10_000 }).toContain('κάτι ιδιωτικό');
});

test('restoring a file that is not a copy changes nothing', async ({ page }) => {
  await page.goto('/el/settings', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Επαναφορά από αντίγραφο/ }).click();
  const restore = page.getByRole('dialog', { name: 'Επαναφορά από αντίγραφο' });
  await restore.locator('input[type=file]').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ n_mindfulness_app_bundle_next: 'evil' })) });
  await expect(restore.getByText(/δεν είναι αντίγραφο της εφαρμογής/)).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('n_mindfulness_app_bundle_next'))).toBeNull();
});

test('the language changes to English', async ({ page, isMobile }) => {
  await page.goto('/el/practice', { waitUntil: 'networkidle' });
  if (isMobile) await page.getByRole('button', { name: 'Μενού' }).click();
  await page.getByRole('button', { name: 'Switch to English' }).first().click();
  await expect(page).toHaveURL(/\/en\/practice/);
  await expect(page.locator('h1').first()).toHaveText('Practice');
});

test('Practice: "not sure" asks how you feel, and Microdoses open without a lock', async ({ page }) => {
  await page.goto('/el/practice', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Δεν ξέρεις από πού/ }).click();
  await page.getByRole('button', { name: /Ένταση/ }).first().click();
  await expect(page.getByText('Πρόταση για τώρα').first()).toBeVisible();
  await page.getByRole('button', { name: /^Μικροδόσεις/ }).click();
  await expect(page).toHaveURL(/\/practice\/microdoses/);
  await expect(page.locator('h1').first()).toHaveText('Μικροδόσεις');
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
  await page.getByRole('button', { name: /Υπενθύμιση στην ατζέντα/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Υπενθύμιση στην ατζέντα του κινητού' });
  await expect(dialog).toBeVisible();
  const download = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /Πρόσθεσε στην ατζέντα/ }).click();
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

test('the cat guides someone new: how you feel, and a first step', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  // (The first-visit line to the welcome is for someone who has not seen it.)
  await expect(page.getByTestId('home-welcome')).toHaveCount(0);
  await page.getByRole('button', { name: 'Συνοδός: τι κάνω τώρα;' }).click();
  const sheet = page.getByRole('dialog', { name: 'Συνοδός' });
  await expect(sheet.getByRole('heading', { name: 'Πώς νιώθεις τώρα;' })).toBeVisible();
  await sheet.getByRole('link', { name: /Βύθιση στη Βαρύτητα/ }).click();
  await expect(page).toHaveURL(/\/practice\/body\/gravity-sink/);
});

test('the cat shows the home page around: four stops, at your pace', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Συνοδός: τι κάνω τώρα;' }).click();
  await page.getByRole('button', { name: 'Δείξε μου την αρχική' }).click();
  const tour = page.getByRole('dialog', { name: 'Ξενάγηση στην αρχική' });
  await expect(tour.getByText('1 / 4')).toBeVisible();
  for (let i = 0; i < 3; i++) await tour.getByRole('button', { name: 'Επόμενο' }).click();
  await expect(tour.getByText('4 / 4')).toBeVisible();
  await tour.getByRole('button', { name: 'Τέλος' }).click();
  await expect(tour).toHaveCount(0);
});

test('"Gravity and thoughts" (Chapter 1) plays its four scenes, with no accessibility problems', async ({ page }) => {
  await page.goto('/el/chapters/1?p=3', { waitUntil: 'networkidle' });
  const anim = page.getByRole('group', { name: 'Βαρύτητα και σκέψεις' });
  await anim.scrollIntoViewIfNeeded();
  await expect(anim.getByRole('heading', { name: 'Οι σκέψεις πληθαίνουν' })).toBeVisible();
  await anim.getByRole('button', { name: /Ξεκίνα/ }).click();
  await expect(anim.getByRole('button', { name: 'Παύση' }).last()).toBeVisible();
  await anim.getByRole('button', { name: 'Επόμενη σκηνή' }).click();
  await expect(anim.getByRole('heading', { name: 'Το τούνελ' })).toBeVisible();
  await anim.getByRole('button', { name: 'Σκηνή 4: Εδώ' }).click();
  await expect(anim.getByRole('heading', { name: 'Εδώ' })).toBeVisible();
  await expect(anim.getByRole('button', { name: 'Επόμενη σκηνή' })).toBeDisabled();
  const r = await new AxeBuilder({ page: page as never }).include('[role="group"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});

test('the last page of a chapter says what you take from it', async ({ page }) => {
  await page.goto('/el/chapters/1?p=99', { waitUntil: 'networkidle' });
  const gains = page.getByRole('region', { name: 'Τι παίρνεις από αυτό το κεφάλαιο' });
  await expect(gains).toBeVisible();
  await expect(gains.getByRole('listitem').first()).toContainText('Μπορείς να βρίσκεις τη γείωση');
  // Only at the chapter's end.
  await page.goto('/el/chapters/1?p=2', { waitUntil: 'networkidle' });
  await expect(page.getByRole('region', { name: 'Τι παίρνεις από αυτό το κεφάλαιο' })).toHaveCount(0);
});

test('"The four stages" (Chapter 10) plays its five scenes, with no accessibility problems', async ({ page }) => {
  await page.goto('/el/chapters/10?p=2', { waitUntil: 'networkidle' });
  const anim = page.getByRole('group', { name: 'Τα τέσσερα στάδια' });
  await anim.scrollIntoViewIfNeeded();
  await expect(anim.getByRole('heading', { name: 'Ο νους τρέχει' })).toBeVisible();
  await anim.getByRole('button', { name: /Ξεκίνα/ }).click();
  await expect(anim.getByRole('button', { name: 'Παύση' }).last()).toBeVisible();
  await anim.getByRole('button', { name: 'Επόμενη σκηνή' }).click();
  await expect(anim.getByRole('heading', { name: 'Νιώσε τη γη' })).toBeVisible();
  await anim.getByRole('button', { name: 'Σκηνή 5: Άνοιξε στον χώρο' }).click();
  await expect(anim.getByRole('heading', { name: 'Άνοιξε στον χώρο' })).toBeVisible();
  await expect(anim.getByRole('button', { name: 'Επόμενη σκηνή' })).toBeDisabled();
  const r = await new AxeBuilder({ page: page as never }).include('[role="group"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});

test('"Inner touch" (Chapter 2) plays its five scenes, with no accessibility problems', async ({ page }) => {
  await page.goto('/el/chapters/2?p=3', { waitUntil: 'networkidle' });
  const anim = page.getByRole('group', { name: 'Εσωτερική αφή' });
  await anim.scrollIntoViewIfNeeded();
  await expect(anim.getByRole('heading', { name: 'Η βαρύτητα' })).toBeVisible();
  await anim.getByRole('button', { name: /Ξεκίνα/ }).click();
  await expect(anim.getByRole('button', { name: 'Παύση' }).last()).toBeVisible();
  await anim.getByRole('button', { name: 'Επόμενη σκηνή' }).click();
  await expect(anim.getByRole('heading', { name: 'Τα ρουθούνια' })).toBeVisible();
  await anim.getByRole('button', { name: 'Σκηνή 5: Όλο το σώμα' }).click();
  await expect(anim.getByRole('heading', { name: 'Όλο το σώμα' })).toBeVisible();
  await expect(anim.getByRole('button', { name: 'Επόμενη σκηνή' })).toBeDisabled();
  const r = await new AxeBuilder({ page: page as never }).include('[role="group"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});

test('"The four forms of attention" (Chapter 3) plays its five scenes, with no accessibility problems', async ({ page }) => {
  await page.goto('/el/chapters/3?p=2', { waitUntil: 'networkidle' });
  const anim = page.getByRole('group', { name: 'Οι τέσσερις μορφές προσοχής' });
  await anim.scrollIntoViewIfNeeded();
  await expect(anim.getByRole('heading', { name: 'Κλειστή προσοχή' })).toBeVisible();
  await anim.getByRole('button', { name: /Ξεκίνα/ }).click();
  await expect(anim.getByRole('button', { name: 'Παύση' }).last()).toBeVisible();
  await anim.getByRole('button', { name: 'Σκηνή 4: Αγκυλωμένη προσοχή' }).click();
  await expect(anim.getByRole('heading', { name: 'Αγκυλωμένη προσοχή' })).toBeVisible();
  await anim.getByRole('button', { name: 'Επόμενη σκηνή' }).click();
  await expect(anim.getByRole('heading', { name: 'Η έξοδος' })).toBeVisible();
  await expect(anim.getByRole('button', { name: 'Επόμενη σκηνή' })).toBeDisabled();
  const r = await new AxeBuilder({ page: page as never }).include('[role="group"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});

test('"The metronome of presence" (Chapter 6) plays its two scenes, with no accessibility problems', async ({ page }) => {
  await page.goto('/el/chapters/6?p=7', { waitUntil: 'networkidle' });
  const anim = page.getByRole('group', { name: 'Ο μετρονόμος της παρουσίας' });
  await anim.scrollIntoViewIfNeeded();
  await expect(anim.getByRole('heading', { name: 'Βρες τον άξονα' })).toBeVisible();
  await anim.getByRole('button', { name: /Ξεκίνα/ }).click();
  await expect(anim.getByRole('button', { name: 'Παύση' }).last()).toBeVisible();
  await anim.getByRole('button', { name: 'Επόμενη σκηνή' }).click();
  await expect(anim.getByRole('heading', { name: 'Ενσυνείδητο λίκνισμα' })).toBeVisible();
  await expect(anim.getByRole('button', { name: 'Επόμενη σκηνή' })).toBeDisabled();
  const r = await new AxeBuilder({ page: page as never }).include('[role="group"]').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
});

test('the Tai Chi practices draw the figure in 3D where the device can', async ({ page }) => {
  // Seen as a phone with a real graphics chip (the test browser draws in software).
  await page.addInitScript(() => {
    for (const P of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const get = P.getParameter;
      P.getParameter = function (this: WebGLRenderingContext, p: number) { return p === 0x9246 ? 'Adreno (TM) 640' : get.call(this, p); };
    }
  });
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  await page.goto('/el/practice/breath/qigong-lifting-sky', { waitUntil: 'networkidle' });
  const webgl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl'));
  test.skip(!webgl, 'no WebGL in this browser');
  await expect(page.locator('.breath-hero canvas')).toHaveCount(1, { timeout: 15_000 });
  await page.getByRole('button', { name: 'Ξεκίνα', exact: true }).first().click();
  // Moving through the breath (after the three seconds to take position).
  await page.waitForTimeout(5000);
  await expect(page.locator('.breath-hero canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('where the device can keep data, there is no note that nothing is kept', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await expect(page.locator('h1').first()).toBeVisible();
  await expect(page.getByText('Δεν κρατιέται τίποτα σε αυτή τη συσκευή')).toHaveCount(0);
});

test('a Rabbit Hole text: the arrow keys stop at its last page, and Tab stays inside it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard');
  await page.goto('/el/rabbithole/alchemical-vessel', { waitUntil: 'networkidle' });
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const counter = dialog.locator('text=/^\\d+\\/\\d+$/').first();
  const total = Number((await counter.textContent())!.split('/')[1]);
  for (let i = 0; i < total + 5; i++) await page.keyboard.press('ArrowRight');
  await expect(counter).toHaveText(`${total}/${total}`);
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true);
  }
});

test('the "More" menu keeps the keyboard inside it and closes with Escape', async ({ page }) => {
  await page.goto('/el/practice', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Μενού' }).first().click();
  const menu = page.getByRole('dialog', { name: 'Περισσότερα' });
  await expect(menu).toBeVisible();
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
});

test('the animation pages are kept for offline use', async ({ request }) => {
  const sw = await (await request.get('/sw.js')).text();
  for (const f of ['racing_mind', 'samatha_attention', 'camera', 'camera-hero']) expect(sw).toContain(`animations/${f}.html`);
});


// The browser's offer to install, as Chrome sends it.
const offerInstall = (page: import('@playwright/test').Page, outcome: 'accepted' | 'dismissed') =>
  page.evaluate((outcome) => {
    const e = new Event('beforeinstallprompt', { cancelable: true }) as Event & Record<string, unknown>;
    e.prompt = async () => { (window as unknown as Record<string, boolean>).__prompted = true; };
    e.userChoice = Promise.resolve({ outcome });
    window.dispatchEvent(e);
  }, outcome);

test('the home page offers the app with one tap once the browser allows it', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  const card = page.getByRole('region', { name: 'Η εφαρμογή στην οθόνη σου' });
  await expect(card).toHaveCount(0);
  await offerInstall(page, 'accepted');
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: 'Εγκατάσταση' }).click();
  expect(await page.evaluate(() => (window as unknown as Record<string, boolean>).__prompted)).toBe(true);
  await expect(page.getByRole('status').filter({ hasText: 'Έγινε' })).toBeVisible();
});

test('"Not now" puts the install card away, and it stays away', async ({ page }) => {
  await page.goto('/el', { waitUntil: 'networkidle' });
  await offerInstall(page, 'dismissed');
  const card = page.getByRole('region', { name: 'Η εφαρμογή στην οθόνη σου' });
  await card.getByRole('button', { name: 'Όχι τώρα' }).click();
  await expect(card).toHaveCount(0);
  await page.reload({ waitUntil: 'networkidle' });
  await offerInstall(page, 'dismissed');
  await expect(page.getByRole('region', { name: 'Η εφαρμογή στην οθόνη σου' })).toHaveCount(0);
});

test.describe('on an iPhone', () => {
  test.use({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
  test('the install card says the two steps, since Safari has no install button', async ({ page }) => {
    await page.goto('/el', { waitUntil: 'networkidle' });
    const card = page.getByRole('region', { name: 'Η εφαρμογή στην οθόνη σου' });
    await expect(card).toBeVisible();
    await expect(card).toContainText('Προσθήκη στην οθόνη αφετηρίας');
    await expect(card.getByRole('button', { name: 'Εγκατάσταση' })).toHaveCount(0);
  });
});
