import { beforeEach, describe, expect, it } from 'vitest';
import {
  backupReminderDue, hasDataWorthKeeping, markBackupSaved, snoozeBackupReminder,
  DATA_SINCE_KEY, FIRST_REMINDER_DAYS, REMINDER_EVERY_DAYS,
} from './dataSafety';

const DAY = 24 * 60 * 60 * 1000;
const T0 = Date.UTC(2026, 9, 1);

describe('backup reminder', () => {
  beforeEach(() => localStorage.clear());

  it('says nothing while there is nothing to keep', () => {
    expect(hasDataWorthKeeping()).toBe(false);
    expect(backupReminderDue(T0 + 100 * DAY)).toBe(false);
    expect(localStorage.getItem(DATA_SINCE_KEY)).toBeNull();
  });

  it('counts a journal entry, a finished chapter or a chapter begun', () => {
    localStorage.setItem('journal_v2_2026-10-01', '{"note":"x"}');
    expect(hasDataWorthKeeping()).toBe(true);
    localStorage.clear();
    localStorage.setItem('awareness_progress', JSON.stringify({ completedChapters: [1] }));
    expect(hasDataWorthKeeping()).toBe(true);
    localStorage.clear();
    localStorage.setItem('mindful_companion_v5', JSON.stringify({ chapterProgress: { 2: { page: 3 } } }));
    expect(hasDataWorthKeeping()).toBe(true);
  });

  it('waits two weeks from the first thing worth keeping', () => {
    localStorage.setItem('journal_v2_2026-10-01', '{"note":"x"}');
    expect(backupReminderDue(T0)).toBe(false);
    expect(backupReminderDue(T0 + (FIRST_REMINDER_DAYS - 1) * DAY)).toBe(false);
    expect(backupReminderDue(T0 + FIRST_REMINDER_DAYS * DAY)).toBe(true);
  });

  it('a copy or "Not now" means a month of quiet', () => {
    localStorage.setItem('journal_v2_2026-10-01', '{"note":"x"}');
    backupReminderDue(T0);
    const later = T0 + 20 * DAY;
    markBackupSaved(later);
    expect(backupReminderDue(later + (REMINDER_EVERY_DAYS - 1) * DAY)).toBe(false);
    expect(backupReminderDue(later + REMINDER_EVERY_DAYS * DAY)).toBe(true);
    const snoozed = later + REMINDER_EVERY_DAYS * DAY;
    snoozeBackupReminder(snoozed);
    expect(backupReminderDue(snoozed + 10 * DAY)).toBe(false);
    expect(backupReminderDue(snoozed + REMINDER_EVERY_DAYS * DAY)).toBe(true);
  });
});
