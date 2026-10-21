// A soft bell for the end of a quiet practice, made with Web Audio (no file).
// Browsers, iPhones above all, only allow sound after a tap: call prepareBell()
// inside the tap that starts the practice, and ringBell() when it ends.

let ctx: AudioContext | null = null;

export function prepareBell() {
  try {
    if (!ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      ctx = new Ctx();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  } catch {
    ctx = null;
  }
}

/** A single bowl-like note that fades over about four seconds. */
export function ringBell() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([30, 60, 30]);
  if (!ctx) return;
  try {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const t = ctx.currentTime + 0.05;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
    out.connect(ctx.destination);
    // A fundamental and two soft overtones, like a small singing bowl.
    for (const [f, g] of [[528, 1], [1056, 0.28], [1584, 0.12]] as const) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
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
