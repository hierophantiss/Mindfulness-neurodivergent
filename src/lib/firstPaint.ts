// The page arrives with its text already in it (scripts/prerender.ts), so
// something readable shows before the app's code. When the app starts, that
// text stays on screen until the first page's own code has loaded, instead of
// giving way to an empty screen for a moment and then coming back: one change
// on the screen, not three. Only for the first page of a visit.

let html: string | null = null;

/** Keeps the arriving text (call before the app replaces it). */
export function keepArrivingText() {
  html = document.querySelector('#root > [data-prerendered]')?.outerHTML ?? null;
}

export function arrivingText() {
  return html;
}

/** The first page is on screen: later waits show the quiet dot. */
export function dropArrivingText() {
  html = null;
}
