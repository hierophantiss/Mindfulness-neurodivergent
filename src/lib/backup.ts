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
import { isNative } from './native';

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
const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const strings = (x: unknown) => Array.isArray(x) && x.every((s) => typeof s === 'string');
/** A Journal day: the fields the Journal reads, each of its kind. */
const journalDay = json((x) => isObj(x)
  && (x.text === undefined || typeof x.text === 'string')
  && (x.mood == null || typeof x.mood === 'number')
  && (x.state == null || typeof x.state === 'string')
  && (x.stateOff === undefined || typeof x.stateOff === 'boolean')
  && (x.axes === undefined || strings(x.axes))
  && (x.axesOff === undefined || strings(x.axesOff))
  && (x.timestamp === undefined || typeof x.timestamp === 'number'));
/** What the cat keeps: reading place per chapter, the program day, where it sits. */
const companionShape = (x: unknown) => isObj(x)
  && (x.chapterProgress === undefined || isObj(x.chapterProgress))
  && (x.programProgress === undefined || (isObj(x.programProgress) && typeof x.programProgress.week === 'number' && typeof x.programProgress.day === 'number'))
  && (x.lastChapter == null || typeof x.lastChapter === 'number')
  && (x.fabPos == null || (isObj(x.fabPos) && typeof x.fabPos.x === 'number' && typeof x.fabPos.y === 'number'));
/** Progress: the lists of what was completed. */
const progressShape = json((x) => isObj(x)
  && (x.completedChapters === undefined || Array.isArray(x.completedChapters))
  && (x.completedLessons === undefined || Array.isArray(x.completedLessons)));

const KEYS: Record<string, Check> = {
  // Progress and record
  awareness_progress: progressShape,
  [COMPANION_KEY]: json(companionShape),
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
  n_mindfulness_vibration: flag,
  n_mindfulness_bell: flag,
  n_mindfulness_program_days: object,
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
  [/^journal_v2_\d{4}-\d{2}-\d{2}$/, journalDay],
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
export function backupText(storage: Storage = deviceStorage(), now: Date = new Date()): string {
  // savedAt: the day of the copy, shown before a restore writes anything.
  return JSON.stringify({ app: APP, version: 2, savedAt: now.toISOString(), data: collectBackup(storage) });
}

/**
 * Saves the file (as given: plain or locked). Only when it was saved does the
 * monthly reminder's count start again. In the Android app the share sheet
 * opens; if the person closes it, or it fails, nothing was saved: false.
 */
export async function saveBackupFile(text: string, locked: boolean): Promise<boolean> {
  const blob = new Blob([text], { type: 'application/json' });
  const name = `mindfulness-backup-${new Date().toISOString().split('T')[0]}${locked ? '-locked' : ''}.json`;
  if (isNative()) {
    try {
      const { shareBlob } = await import('./nativeApp');
      await shareBlob(blob, name);
    } catch {
      return false;
    }
    markBackupSaved();
    return true;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  markBackupSaved();
  return true;
}

const looksLikeCompanion = (o: Record<string, unknown>) =>
  'chapterProgress' in o || 'programProgress' in o || 'dailyLogs' in o;

export interface RestoreResult { format: BackupFormat; restored: number; left: number }

/**
 * Writes all of them, or none: if one does not fit (a full storage), what was
 * already written is put back as it was, and the error goes on.
 */
function writeAll(storage: Storage, entries: [string, string][]): void {
  const before = entries.map(([k]) => [k, storage.getItem(k)] as const);
  try {
    for (const [k, v] of entries) storage.setItem(k, v);
  } catch (e) {
    for (const [k, v] of before) {
      try { if (v === null) storage.removeItem(k); else storage.setItem(k, v); } catch { /* as much as it can */ }
    }
    throw e;
  }
}

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

  // The older Settings backup: the companion object itself (checked too).
  if (looksLikeCompanion(parsed)) {
    if (!companionShape(parsed)) throw new Error('not a backup');
    writeAll(storage, [[COMPANION_KEY, JSON.stringify(parsed)]]);
    return { format: 'companion', restored: 1, left: 0 };
  }

  // The full backup, with or without the { app, version, data } wrapper.
  const data = parsed.app === APP && parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data) ? parsed.data : parsed;
  const all = Object.entries(data as Record<string, unknown>).filter(([k]) => !(data === parsed && (k === 'app' || k === 'version' || k === 'savedAt')));
  const good = all.filter(([k, v]) => acceptable(k, v)) as [string, string][];
  if (!good.length) throw new Error('nothing to restore');
  writeAll(storage, good);
  // A backup from before the one activity record: bring it up to date on the
  // next start (lib/activityLog.ts folds its older histories in).
  if (!good.some(([k]) => k === RECORD_VERSION_KEY)) storage.removeItem(RECORD_VERSION_KEY);
  return { format: 'full', restored: good.length, left: all.length - good.length };
}

/** What a (plain) backup holds, in words a person can check before it is written. */
export interface BackupPreview {
  /** The day the copy was made, if known (newer copies say it; older ones by their file name). */
  savedAt: Date | null;
  journalDays: number;
  progress: boolean;
  record: boolean;
  settings: boolean;
}

const PROGRESS_KEYS = new Set(['awareness_progress', COMPANION_KEY, 'n_mindfulness_reader_pos', 'n_mindfulness_program_days']);
const RECORD_KEYS = new Set(['neurodivergent_mindfulness_detailed_activity_logs', 'breath_history', 'n_mindfulness_checkin_days', 'n_mindfulness_checkin_uses', 'n_mindfulness_state', 'n_mindfulness_data_since', RECORD_VERSION_KEY]);

/**
 * Reads a plain backup without writing anything: what restoring it would
 * replace. Throws, as restoreBackup does, if it is not a backup of the app.
 * `fileName` gives the day of older copies (mindfulness-backup-2026-11-03.json).
 */
export function previewBackup(text: string, fileName = ''): BackupPreview {
  if (text.length > MAX_FILE) throw new Error('too large');
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not a backup');
  if (isLocked(parsed)) throw new Error('locked');
  const fromName = /(\d{4})-(\d{2})-(\d{2})/.exec(fileName);
  const stamped = typeof parsed.savedAt === 'string' && !Number.isNaN(Date.parse(parsed.savedAt)) ? new Date(parsed.savedAt) : null;
  const savedAt = stamped ?? (fromName ? new Date(Number(fromName[1]), Number(fromName[2]) - 1, Number(fromName[3])) : null);
  if (looksLikeCompanion(parsed)) {
    if (!companionShape(parsed)) throw new Error('not a backup');
    return { savedAt, journalDays: 0, progress: true, record: false, settings: false };
  }
  const data = parsed.app === APP && parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data) ? parsed.data : parsed;
  const good = Object.entries(data as Record<string, unknown>).filter(([k, v]) => acceptable(k, v)).map(([k]) => k);
  if (!good.length) throw new Error('nothing to restore');
  const journalDays = good.filter(k => /^journal_(v2|papyrus)_\d{4}-\d{2}-\d{2}$/.test(k)).length;
  const isJournal = (k: string) => /^journal_/.test(k);
  return {
    savedAt,
    journalDays,
    progress: good.some(k => PROGRESS_KEYS.has(k)),
    record: good.some(k => RECORD_KEYS.has(k)),
    settings: good.some(k => !isJournal(k) && !PROGRESS_KEYS.has(k) && !RECORD_KEYS.has(k)),
  };
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
