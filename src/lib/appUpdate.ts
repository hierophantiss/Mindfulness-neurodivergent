// A new version of the app has been downloaded and waits. It is applied at a
// calm moment (when you go back to the home page), or on the next start,
// never in the middle of a practice or while a chapter is being read.

let apply: ((reload?: boolean) => Promise<void>) | null = null;
let waiting = false;

export function setUpdater(fn: (reload?: boolean) => Promise<void>) {
  apply = fn;
}

export function markUpdateWaiting() {
  waiting = true;
}

export function isUpdateWaiting() {
  return waiting;
}

/** Applies a waiting version (the page reloads). */
export function applyWaitingUpdate() {
  if (!waiting || !apply) return;
  waiting = false;
  apply(true).catch(() => { waiting = true; });
}
