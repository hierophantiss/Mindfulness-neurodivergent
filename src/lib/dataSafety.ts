// What the app keeps (progress, journal, where you stopped reading) lives only
// on this device. Two quiet guards, so nobody loses it:
//
// 1. Ask the browser to keep it (persistent storage), once there is something
//    worth keeping. Without this, a browser may clear it when space runs low,
//    and Safari on iPhone clears a site's data after 7 days without a visit
//    (unless the app was added to the home screen).
// 2. About once a month, a small card on the home page offers to save a copy
//    to a file. Never in the first two weeks, never twice in a month, and
//    "Not now" means a month of quiet.

const DAY = 24 * 60 * 60 * 1000;
export const LAST_BACKUP_KEY = 'n_mindfulness_last_backup';
export const BACKUP_SNOOZE_KEY = 'n_mindfulness_backup_snooze';
export const DATA_SINCE_KEY = 'n_mindfulness_data_since';
export const FIRST_REMINDER_DAYS = 14;
export const REMINDER_EVERY_DAYS = 30;

const num = (storage: Storage, key: string) => Number(storage.getItem(key)) || 0;

/** A journal entry, a finished chapter or program day, or a chapter begun. */
export function hasDataWorthKeeping(storage: Storage = localStorage): boolean {
  try {
    for (let i = 0; i < storage.length; i++) {
      if (storage.key(i)?.startsWith('journal_v2_')) return true;
    }
    const progress = JSON.parse(storage.getItem('awareness_progress') || '{}');
    if ((progress.completedChapters?.length || 0) > 0 || (progress.completedLessons?.length || 0) > 0) return true;
    const companion = JSON.parse(storage.getItem('mindful_companion_v5') || '{}');
    if (companion.chapterProgress && Object.keys(companion.chapterProgress).length > 0) return true;
  } catch {
    /* unreadable: nothing to say */
  }
  return false;
}

/**
 * Whether the home page should offer a copy now. The first time there is
 * something worth keeping, it notes the day (the two quiet weeks start then).
 */
export function backupReminderDue(now = Date.now(), storage: Storage = localStorage): boolean {
  try {
    if (!hasDataWorthKeeping(storage)) return false;
    let since = num(storage, DATA_SINCE_KEY);
    if (!since) {
      since = now;
      storage.setItem(DATA_SINCE_KEY, String(now));
    }
    const last = num(storage, LAST_BACKUP_KEY);
    const snooze = num(storage, BACKUP_SNOOZE_KEY);
    const quietUntil = Math.max(
      since + FIRST_REMINDER_DAYS * DAY,
      last ? last + REMINDER_EVERY_DAYS * DAY : 0,
      snooze ? snooze + REMINDER_EVERY_DAYS * DAY : 0,
    );
    return now >= quietUntil;
  } catch {
    return false;
  }
}

export function markBackupSaved(now = Date.now(), storage: Storage = localStorage): void {
  try { storage.setItem(LAST_BACKUP_KEY, String(now)); } catch { /* storage unavailable */ }
}

export function snoozeBackupReminder(now = Date.now(), storage: Storage = localStorage): void {
  try { storage.setItem(BACKUP_SNOOZE_KEY, String(now)); } catch { /* storage unavailable */ }
}

/** The day of the last copy, or null. */
export function lastBackupDate(storage: Storage = localStorage): Date | null {
  try {
    const t = num(storage, LAST_BACKUP_KEY);
    return t ? new Date(t) : null;
  } catch {
    return null;
  }
}

/** iPhone or iPad, in the browser rather than added to the home screen. */
export function isIOSBrowserTab(): boolean {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return ios && !standalone;
}

/**
 * Asks the browser to keep the app's data. Chrome, Edge and Safari decide on
 * their own, without asking the person; Firefox would show a question at
 * start-up, so there it is left alone (it clears data only when a disk is full).
 */
export async function keepDataOnDevice(): Promise<boolean | null> {
  const storage = navigator.storage;
  if (!storage?.persist || !storage.persisted) return null;
  if (/firefox/i.test(navigator.userAgent)) return null;
  try {
    if (await storage.persisted()) return true;
    if (!hasDataWorthKeeping()) return false;
    return await storage.persist();
  } catch {
    return null;
  }
}
