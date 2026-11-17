// One backup for the whole app: what it keeps on this device (progress,
// journal, reading place, settings). Used by the menu, Settings and the home
// page's monthly reminder (components/BackupDialog.tsx).
//
// - Only the app's own keys go into a backup and come back from one, each
//   checked for its shape; anything else in a file is left out, so a changed
//   or foreign file cannot write what the app never wrote (for example what
//   the Android app reads to switch to an update).
// - A backup can be locked with a passphrase (AES-GCM, key from PBKDF2), all
//   on the device. Without the passphrase it cannot be opened, by anyone.
//
// Restoring also accepts the older backups: the menu's plain map of keys, and
// the Settings one that held only the companion data.

import { RECORD_VERSION_KEY } from './activityLog';
import { deviceStorage } from './storage';
import { markBackupSaved } from './dataSafety';

const COMPANION_KEY = 'mindful_companion_v5';
const APP = 'neurodivergent-mindfulness';

// ── Which keys, and what each may hold ──
type Check = (v: string) => boolean;
const json = (ok: (x: unknown) => boolean): Check => (v) => { try { return ok(JSON.parse(v)); } catch { return false; } };
const object = json((x) => !!x && typeof x === 'object' && !Array.isArray(x));
const list = json(Array.isArray);
const number = json((x) => typeof x === 'number' && Number.isFinite(x));
const anyJSON = json(() => true);
const oneOf = (...values: string[]): Check => (v) => values.includes(v);
const like = (re: RegExp, max = 200): Check => (v) => v.length <= max && re.test(v);
const flag = oneOf('true', 'false');

const KEYS: Record<string, Check> = {
  // Progress and record
  awareness_progress: object,
  [COMPANION_KEY]: object,
  neurodivergent_mindfulness_detailed_activity_logs: list,
  [RECORD_VERSION_KEY]: number,
  breath_history: anyJSON,          // older records, folded in on the next start
  journal_history: anyJSON,
  n_mindfulness_data_since: like(/^\d{1,15}$/),
  // "How do you feel"
  n_mindfulness_checkin_days: object,
  n_mindfulness_checkin_uses: like(/^\d{1,9}$/),
  n_mindfulness_state: object,
  n_mindfulness_intention: like(/^[^<>]*$/, 300),
  // Reading
  n_mindfulness_reader_pos: object,
  n_mindfulness_reader_settings: object,
  n_mindfulness_easy_read: flag,
  n_mindfulness_dyslexic_font: flag,
  n_mindfulness_airy_text: flag,
  // Settings
  n_mindfulness_reduce_motion: flag,
  mindfulness_lang: oneOf('el', 'en'),
  n_mindfulness_reminder_time: like(/^\d{2}:\d{2}$/),
  vocal_pitch: oneOf('high', 'low'),
  hide_binaural_banner: oneOf('true'),
  anim_voice: oneOf('1'),
  'sanctuary-my-mix': list,
  'sanctuary-binaural-nature': like(/^[a-z-]{1,20}$/),
  // The companion and the first steps
  companion_quiet: oneOf('1'),
  companion_tips_seen: list,
  onboarding_completed: oneOf('true'),
  hasCompletedOnboarding: oneOf('true'),
  N_MINDFULNESS_SEEN_COMPANION_TUTORIAL: oneOf('true'),
  n_mindfulness_quiet_axis_hidden: like(/^\d{4}-\d{2}-\d{2}$/),
};
const PREFIXES: [RegExp, Check][] = [
  [/^journal_v2_\d{4}-\d{2}-\d{2}$/, object],
  [/^journal_papyrus_\d{4}-\d{2}-\d{2}$/, (v) => v.length <= 200_000],   // the older journal
  [/^binaural_pref_[a-z0-9-]{1,60}$/, like(/^[a-z-]{1,20}$/)],
];
const MAX_VALUE = 5_000_000;   // characters, for one key (the record can grow)
const MAX_FILE = 30_000_000;

/** Whether this key, with this value, may be in a backup and come back from one. */
export function acceptable(key: string, value: unknown): value is string {
  if (typeof value !== 'string' || value.length > MAX_VALUE) return false;
  const check = Object.prototype.hasOwnProperty.call(KEYS, key) ? KEYS[key] : PREFIXES.find(([re]) => re.test(key))?.[1];
  return !!check && check(value);
}

export type BackupFormat = 'full' | 'companion';

export function collectBackup(storage: Storage = deviceStorage()): Record<string, string> {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (!key) continue;
    const value = storage.getItem(key);
    if (acceptable(key, value)) data[key] = value;
  }
  return data;
}

/** The backup as the text of its file (plain JSON). */
export function backupText(storage: Storage = deviceStorage()): string {
  return JSON.stringify({ app: APP, version: 2, data: collectBackup(storage) });
}

/** Saves the file (as given: plain or locked) and starts the monthly reminder's count again. */
export function saveBackupFile(text: string, locked: boolean): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindfulness-backup-${new Date().toISOString().split('T')[0]}${locked ? '-locked' : ''}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  markBackupSaved();
}

const looksLikeCompanion = (o: Record<string, unknown>) =>
  'chapterProgress' in o || 'programProgress' in o || 'dailyLogs' in o;

export interface RestoreResult { format: BackupFormat; restored: number; left: number }

/**
 * Writes a (plain) backup back into storage: only the app's own keys, each
 * with the shape it should have; the rest of the file is left out (`left`).
 * Throws if the file is not a backup of this app, is locked, or holds
 * nothing usable; then nothing is written.
 */
export function restoreBackup(text: string, storage: Storage = deviceStorage()): RestoreResult {
  if (text.length > MAX_FILE) throw new Error('too large');
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not a backup');
  if (isLocked(parsed)) throw new Error('locked');

  // The older Settings backup: the companion object itself.
  if (looksLikeCompanion(parsed)) {
    storage.setItem(COMPANION_KEY, JSON.stringify(parsed));
    return { format: 'companion', restored: 1, left: 0 };
  }

  // The full backup, with or without the { app, version, data } wrapper.
  const data = parsed.app === APP && parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data) ? parsed.data : parsed;
  const all = Object.entries(data as Record<string, unknown>).filter(([k]) => !(data === parsed && (k === 'app' || k === 'version')));
  const good = all.filter(([k, v]) => acceptable(k, v)) as [string, string][];
  if (!good.length) throw new Error('nothing to restore');
  for (const [k, v] of good) storage.setItem(k, v);
  // A backup from before the one activity record: bring it up to date on the
  // next start (lib/activityLog.ts folds its older histories in).
  if (!good.some(([k]) => k === RECORD_VERSION_KEY)) storage.removeItem(RECORD_VERSION_KEY);
  return { format: 'full', restored: good.length, left: all.length - good.length };
}

// ── Locking with a passphrase ──
const ITERATIONS = 600_000;   // PBKDF2-SHA256, as OWASP advises; about a second on a phone

interface Locked { app: string; version: 3; locked: { kdf: 'PBKDF2-SHA256'; iterations: number; salt: string; iv: string; cipher: 'AES-GCM-256'; data: string } }

const b64 = (b: Uint8Array) => { let s = ''; for (const x of b) s += String.fromCharCode(x); return btoa(s); };
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function keyFrom(passphrase: string, salt: Uint8Array, iterations: number) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase.normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}

export function isLocked(parsed: unknown): parsed is Locked {
  return !!parsed && typeof parsed === 'object' && (parsed as Locked).app === APP && !!(parsed as Locked).locked;
}

/** The backup's text, locked with the passphrase. */
export async function lockBackup(plain: string, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFrom(passphrase, salt, ITERATIONS);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain)));
  const file: Locked = { app: APP, version: 3, locked: { kdf: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), cipher: 'AES-GCM-256', data: b64(data) } };
  return JSON.stringify(file);
}

/** The plain backup inside a locked one; throws 'passphrase' if it does not open. */
export async function unlockBackup(lockedText: string, passphrase: string): Promise<string> {
  const f = JSON.parse(lockedText) as unknown;
  if (!isLocked(f)) throw new Error('not locked');
  const { iterations, salt, iv, data } = f.locked;
  if (!Number.isInteger(iterations) || iterations < 100_000 || iterations > 10_000_000) throw new Error('not a backup');
  try {
    const key = await keyFrom(passphrase, unb64(salt), iterations);
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, key, unb64(data));
    return new TextDecoder().decode(plain);
  } catch {
    throw new Error('passphrase');
  }
}
