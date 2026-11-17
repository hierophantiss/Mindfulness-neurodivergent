// Reading and writing what the app keeps on this device, safely: a full or
// blocked storage (private browsing, a phone with no space) never breaks a
// page. A write that does not fit returns false, and the caller decides what
// to do (the activity record makes room, see lib/activityLog.ts).
//
// Where the browser blocks site data ("block all cookies", some embedded
// views), even reading `localStorage` throws. So nothing in the app touches it
// directly outside a try: it goes through these, or through deviceStorage().

// Kept only while the page is open, when the browser keeps nothing.
const memory = new Map<string, string>();
const memoryStorage: Storage = {
  get length() { return memory.size; },
  clear: () => memory.clear(),
  getItem: (k) => memory.get(k) ?? null,
  key: (i) => [...memory.keys()][i] ?? null,
  removeItem: (k) => { memory.delete(k); },
  setItem: (k, v) => { memory.set(k, String(v)); },
};

/** The device's storage, or, when the browser blocks it, one that lasts only
 *  while the page is open: code that needs a Storage never throws for that. */
export function deviceStorage(): Storage {
  try {
    const s = window.localStorage;
    void s.length;
    return s;
  } catch {
    return memoryStorage;
  }
}

/** Whether the browser lets the app keep anything on this device at all. */
export function canKeepData(): boolean {
  try {
    const s = window.localStorage;
    s.setItem('__keep_probe', '1');
    s.removeItem('__keep_probe');
    return true;
  } catch {
    return false;
  }
}

/** A text value as saved, or null (not saved, or storage blocked). */
export function readText(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Returns whether it was saved. */
export function writeText(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** Everything the app keeps on this device, gone (Settings, "Clear data"). */
export function clearAll(): void {
  try {
    localStorage.clear();
  } catch {
    /* nothing kept that can be reached */
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** Returns whether it was saved. */
export function writeJSON(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* nothing to do */
  }
}
