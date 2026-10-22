// One backup for the whole app: everything it keeps on this device (progress,
// journal, reading place, settings). Used by the menu and by Settings.
//
// Restoring also accepts the older Settings backup, which held only the
// companion data (one object with chapterProgress, programProgress, ...).

import { RECORD_VERSION_KEY } from './activityLog';

const COMPANION_KEY = 'mindful_companion_v5';
const SKIP = (key: string) => key.startsWith('vite') || key.startsWith('workbox');

export type BackupFormat = 'full' | 'companion';

export function collectBackup(storage: Storage = localStorage): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key && !SKIP(key)) data[key] = storage.getItem(key) ?? '';
  }
  return data;
}

export function downloadBackup(): void {
  const blob = new Blob([JSON.stringify({ app: 'neurodivergent-mindfulness', version: 2, data: collectBackup() })], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindfulness-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const looksLikeCompanion = (o: Record<string, unknown>) =>
  'chapterProgress' in o || 'programProgress' in o || 'dailyLogs' in o;

/**
 * Writes a backup back into storage. Returns which kind it was, or throws if
 * the file is not a backup of this app (nothing is written then).
 */
export function restoreBackup(text: string, storage: Storage = localStorage): BackupFormat {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not a backup');

  // The older Settings backup: the companion object itself.
  if (looksLikeCompanion(parsed)) {
    storage.setItem(COMPANION_KEY, JSON.stringify(parsed));
    return 'companion';
  }

  // The full backup, with or without the { app, version, data } wrapper.
  const data = parsed.app === 'neurodivergent-mindfulness' && parsed.data && typeof parsed.data === 'object' ? parsed.data : parsed;
  const entries = Object.entries(data).filter(([k, v]) => typeof v === 'string' && !SKIP(k)) as [string, string][];
  if (!entries.length) throw new Error('empty backup');
  for (const [k, v] of entries) storage.setItem(k, v);
  // A backup from before the one activity record: bring it up to date on the
  // next start (lib/activityLog.ts folds its older histories in).
  if (!(RECORD_VERSION_KEY in data)) storage.removeItem(RECORD_VERSION_KEY);
  return 'full';
}
