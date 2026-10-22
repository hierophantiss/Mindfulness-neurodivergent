// The app's one source of sound for short cues: the bell at the end of a
// practice or a chapter, the metronome's tick. The background sounds (rain,
// waves, binaural, chanting) use the same audio engine, so once sound has been
// allowed for one of them it is allowed for all.
//
// Browsers, iPhones above all, only allow sound after a tap. The first tap
// anywhere in the app wakes the engine quietly (see listenForFirstTap), so a
// bell that comes later, at the end of a practice, can be heard.

let ctx: AudioContext | null = null;

/** The shared audio engine, or null where there is none. Never throws. */
export function getAudioContext(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  } catch {
    ctx = null;
    return null;
  }
}

/** Call inside a tap (for example the one that starts a practice). */
export function prepareSound(): void {
  getAudioContext();
}

let listening = false;
/** Wakes the engine on the first tap, silently; called once at start. */
export function listenForFirstTap(): void {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  const wake = () => {
    prepareSound();
    window.removeEventListener('pointerdown', wake, true);
    window.removeEventListener('keydown', wake, true);
  };
  window.addEventListener('pointerdown', wake, { capture: true, passive: true });
  window.addEventListener('keydown', wake, true);
}

export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(pattern);
  } catch {
    /* not available */
  }
}

/**
 * A single bowl-like note that fades over about four seconds, with a short
 * vibration. `soft` is for small moments (a chapter finished), quieter than the
 * end of a practice.
 */
export function ringBell({ soft = false }: { soft?: boolean } = {}): void {
  vibrate(soft ? 20 : [30, 60, 30]);
  const c = ctx; // only if sound has already been allowed: never wakes it by itself
  if (!c) return;
  try {
    if (c.state === 'suspended') c.resume().catch(() => {});
    const t = c.currentTime + 0.05;
    const out = c.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(soft ? 0.1 : 0.22, t + 0.02);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
    out.connect(c.destination);
    // A fundamental and two soft overtones, like a small singing bowl.
    for (const [f, g] of [[528, 1], [1056, 0.28], [1584, 0.12]] as const) {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(g, t);
      osc.connect(gain);
      gain.connect(out);
      osc.start(t);
      osc.stop(t + 4.3);
    }
  } catch {
    /* no sound available: the vibration and the screen still say it is over */
  }
}

/** A very short tick, like a woodblock metronome. */
export function tick(): void {
  const c = getAudioContext();
  if (!c) return;
  try {
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  } catch {
    /* no sound available */
  }
}
