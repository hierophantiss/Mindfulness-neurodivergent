// Reading and writing what the app keeps on this device, safely: a full or
// blocked storage (private browsing, a phone with no space) never breaks a
// page. A write that does not fit returns false, and the caller decides what
// to do (the activity record makes room, see lib/activityLog.ts).

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
