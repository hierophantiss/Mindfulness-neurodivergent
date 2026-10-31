// When something breaks, the app keeps a short note of it on this device
// (the last 20, nothing else), so the person can send it to the creator if
// they choose: Settings → Diagnostics → "Send it to the creator" (email).
// Nothing is ever sent on its own.

export const ERROR_LOG_KEY = 'n_mindfulness_error_log';
const MAX = 20;

export type LoggedError = {
  t: number;        // when it last happened
  kind: string;     // 'page' (a page failed), 'script', 'promise'
  msg: string;
  where: string;    // the address
  stack?: string;   // the first few lines
  count: number;    // how many times, same message on the same address
};

// Noise from browsers and extensions that says nothing about the app.
const IGNORE = [/ResizeObserver loop/i, /^Script error\.?$/i, /extension:\/\//i, /AbortError/i];

export function readErrors(storage: Storage = localStorage): LoggedError[] {
  try {
    const list = JSON.parse(storage.getItem(ERROR_LOG_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function clearErrors(storage: Storage = localStorage): void {
  try { storage.removeItem(ERROR_LOG_KEY); } catch { /* storage unavailable */ }
}

export function recordError(kind: string, error: unknown, storage: Storage = localStorage, now = Date.now()): void {
  try {
    const e = error as { message?: string; stack?: string } | undefined;
    const msg = String(e?.message ?? error ?? '').slice(0, 300);
    if (!msg || IGNORE.some(r => r.test(msg))) return;
    const where = typeof location !== 'undefined' ? location.pathname + location.search : '';
    const stack = e?.stack ? e.stack.split('\n').slice(0, 4).join('\n').slice(0, 600) : undefined;
    const list = readErrors(storage);
    const same = list.find(x => x.msg === msg && x.where === where);
    if (same) {
      same.count += 1;
      same.t = now;
    } else {
      list.push({ t: now, kind, msg, where, stack, count: 1 });
    }
    list.sort((a, b) => a.t - b.t);
    storage.setItem(ERROR_LOG_KEY, JSON.stringify(list.slice(-MAX)));
  } catch {
    /* never let the log itself break anything */
  }
}

/** Listens for errors anywhere in the app (once, at start). */
export function installErrorLog(): void {
  window.addEventListener('error', (ev) => recordError('script', ev.error ?? ev.message));
  window.addEventListener('unhandledrejection', (ev) => recordError('promise', ev.reason));
}

/** The text of the email: the errors, and what the device is. No personal data. */
export function errorReport(lang: 'el' | 'en', errors: LoggedError[] = readErrors()): string {
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches ? 'installed' : 'browser';
  const head = [
    lang === 'el' ? 'Σφάλματα της εφαρμογής (από τη συσκευή μου):' : 'App errors (from my device):',
    '',
    `App: ${typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '?'} · ${standalone} · ${lang}`,
    `Device: ${navigator.userAgent}`,
    `Screen: ${window.innerWidth}×${window.innerHeight}`,
    '',
  ];
  const lines = errors.slice().reverse().map(x =>
    `${new Date(x.t).toISOString().slice(0, 16).replace('T', ' ')} · ${x.where} · ${x.kind}${x.count > 1 ? ` ×${x.count}` : ''}\n${x.msg}${x.stack ? '\n' + x.stack : ''}`);
  // An email address in a link has a length limit: keep the newest that fit.
  let body = head.join('\n');
  for (const l of lines) {
    if ((body + '\n\n' + l).length > 1800) break;
    body += '\n\n' + l;
  }
  return body;
}

