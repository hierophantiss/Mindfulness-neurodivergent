// The sounds of the background mixer (rain, waves, wind, fire…), made with
// Web Audio, without recordings. They load only when one of them first plays
// (contexts/AudioContext.tsx), so they are not in the piece every page loads.
import { BREATH_WAVE_SECONDS, type AmbientLayer } from '../data/types-breath';

// ---------------------------------------------------------------------------
// Noise buffer generators
// ---------------------------------------------------------------------------

function createWhiteNoiseBuffer(ctx: globalThis.AudioContext, duration = 2.0): AudioBuffer {
  const size = Math.floor(ctx.sampleRate * duration);
  const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Paul Kellet refined pink noise — all 7 state vars declared together. */
function createPinkNoiseBuffer(ctx: globalThis.AudioContext, duration = 3.0): AudioBuffer {
  const size = Math.floor(ctx.sampleRate * duration);
  const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < size; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856;
    b4 = 0.55000 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

/** Brown noise via leaky integration — gain tuned to avoid clipping. */
function createBrownNoiseBuffer(ctx: globalThis.AudioContext, duration = 4.0): AudioBuffer {
  const size = Math.floor(ctx.sampleRate * duration);
  const buf  = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < size; i++) {
    const w = Math.random() * 2 - 1;
    data[i] = last = (last + 0.02 * w) / 1.02;
    data[i] *= 2.8;
  }
  return buf;
}

// ---------------------------------------------------------------------------
// Helper: safe oscillator start/stop
// ---------------------------------------------------------------------------
function startOsc(osc: OscillatorNode, ctx: globalThis.AudioContext): () => void {
  osc.start(ctx.currentTime + 0.05);
  return () => { try { osc.stop(); } catch (_) {} };
}

function startSource(src: AudioBufferSourceNode, ctx: globalThis.AudioContext): () => void {
  src.start(ctx.currentTime + 0.05);
  return () => { try { src.stop(); } catch (_) {} };
}

/** Fade a gain node in from 0 to target over fadeTime seconds. */
function fadeIn(gain: GainNode, ctx: globalThis.AudioContext, target: number, fadeTime = 2.0) {
  gain.gain.value = 0;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(target, ctx.currentTime + fadeTime);
}

// ---------------------------------------------------------------------------
// RAIN — multi-layer: body noise + high drip shimmer + low rumble
// ---------------------------------------------------------------------------
function setupRain(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const stoppers: Array<() => void> = [];

  // --- Layer 1: main rain body (pink noise through lowpass) ---
  const bodyBuf = createPinkNoiseBuffer(ctx, 4.0);
  const bodySrc = ctx.createBufferSource();
  bodySrc.buffer = bodyBuf;
  bodySrc.loop   = true;

  const bodyFilter = ctx.createBiquadFilter();
  bodyFilter.type            = 'lowpass';
  bodyFilter.frequency.value = 2200;
  bodyFilter.Q.value         = 0.3;

  const bodyGain = ctx.createGain();
  fadeIn(bodyGain, ctx, 0.65, 2.0);

  bodySrc.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(dest);
  stoppers.push(startSource(bodySrc, ctx));

  // --- Layer 2: high-frequency drip shimmer (white noise, highpass) ---
  const dripBuf = createWhiteNoiseBuffer(ctx, 2.0);
  const dripSrc = ctx.createBufferSource();
  dripSrc.buffer = dripBuf;
  dripSrc.loop   = true;

  const dripFilter = ctx.createBiquadFilter();
  dripFilter.type            = 'highpass';
  dripFilter.frequency.value = 4000;
  dripFilter.Q.value         = 0.5;

  // Gentle shimmer LFO so it doesn't feel static
  const shimmerLfo = ctx.createOscillator();
  shimmerLfo.type            = 'sine';
  shimmerLfo.frequency.value = 0.3;
  const shimmerLfoGain = ctx.createGain();
  shimmerLfoGain.gain.value  = 600;
  shimmerLfo.connect(shimmerLfoGain);
  shimmerLfoGain.connect(dripFilter.frequency);

  const dripGain = ctx.createGain();
  fadeIn(dripGain, ctx, 0.15, 2.5);

  dripSrc.connect(dripFilter);
  dripFilter.connect(dripGain);
  dripGain.connect(dest);
  stoppers.push(startSource(dripSrc, ctx));
  stoppers.push(startOsc(shimmerLfo, ctx));

  // --- Layer 3: low rumble (brown noise, gives weight/depth) ---
  const rumbleBuf = createBrownNoiseBuffer(ctx, 4.0);
  const rumbleSrc = ctx.createBufferSource();
  rumbleSrc.buffer = rumbleBuf;
  rumbleSrc.loop   = true;

  const rumbleFilter = ctx.createBiquadFilter();
  rumbleFilter.type            = 'lowpass';
  rumbleFilter.frequency.value = 180;

  const rumbleGain = ctx.createGain();
  fadeIn(rumbleGain, ctx, 0.18, 3.0);

  rumbleSrc.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(dest);
  stoppers.push(startSource(rumbleSrc, ctx));

  // --- Layer 4: slow intensity breath LFO on body ---
  const breathLfo = ctx.createOscillator();
  breathLfo.type            = 'sine';
  breathLfo.frequency.value = 0.05; // Very slow rain intensity swell
  const breathDepth = ctx.createGain();
  breathDepth.gain.value = 0.12;
  breathLfo.connect(breathDepth);
  breathDepth.connect(bodyGain.gain);
  stoppers.push(startOsc(breathLfo, ctx));

  return () => stoppers.forEach(s => s());
}

// ---------------------------------------------------------------------------
// OCEAN — multi-layer: deep swell + surface foam + sub-bass thump
// ---------------------------------------------------------------------------
function setupOcean(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const stoppers: Array<() => void> = [];

  // --- Layer 1: deep wave swell (brown noise + slow LFO sweep) ---
  const swellBuf = createBrownNoiseBuffer(ctx, 6.0);
  const swellSrc = ctx.createBufferSource();
  swellSrc.buffer = swellBuf;
  swellSrc.loop   = true;

  const swellFilter = ctx.createBiquadFilter();
  swellFilter.type            = 'lowpass';
  swellFilter.frequency.value = 350;

  // Wave motion: slowly sweeps filter freq up/down
  const waveLfo = ctx.createOscillator();
  waveLfo.type            = 'sine';
  waveLfo.frequency.value = 0.08; // ~12 second wave cycle
  const waveLfoGain = ctx.createGain();
  waveLfoGain.gain.value = 220;
  waveLfo.connect(waveLfoGain);
  waveLfoGain.connect(swellFilter.frequency);

  // Volume swell in sync with wave
  const swellGain = ctx.createGain();
  fadeIn(swellGain, ctx, 0.7, 3.0);

  const swellVolLfo = ctx.createOscillator();
  swellVolLfo.type            = 'sine';
  swellVolLfo.frequency.value = 0.08;
  const swellVolDepth = ctx.createGain();
  swellVolDepth.gain.value = 0.22;
  swellVolLfo.connect(swellVolDepth);
  swellVolDepth.connect(swellGain.gain);

  swellSrc.connect(swellFilter);
  swellFilter.connect(swellGain);
  swellGain.connect(dest);
  stoppers.push(startSource(swellSrc, ctx));
  stoppers.push(startOsc(waveLfo, ctx));
  stoppers.push(startOsc(swellVolLfo, ctx));

  // --- Layer 2: surface foam (pink noise, bandpass, faster shimmer) ---
  const foamBuf = createPinkNoiseBuffer(ctx, 3.0);
  const foamSrc = ctx.createBufferSource();
  foamSrc.buffer = foamBuf;
  foamSrc.loop   = true;

  const foamFilter = ctx.createBiquadFilter();
  foamFilter.type            = 'bandpass';
  foamFilter.frequency.value = 800;
  foamFilter.Q.value         = 0.6;

  const foamLfo = ctx.createOscillator();
  foamLfo.type            = 'sine';
  foamLfo.frequency.value = 0.13;
  const foamLfoGain = ctx.createGain();
  foamLfoGain.gain.value = 400;
  foamLfo.connect(foamLfoGain);
  foamLfoGain.connect(foamFilter.frequency);

  const foamGain = ctx.createGain();
  fadeIn(foamGain, ctx, 0.25, 3.5);

  foamSrc.connect(foamFilter);
  foamFilter.connect(foamGain);
  foamGain.connect(dest);
  stoppers.push(startSource(foamSrc, ctx));
  stoppers.push(startOsc(foamLfo, ctx));

  return () => stoppers.forEach(s => s());
}

// ---------------------------------------------------------------------------
// WIND — multi-layer: base whoosh + high whistle + gusty breath
// ---------------------------------------------------------------------------
function setupWind(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const stoppers: Array<() => void> = [];

  // --- Layer 1: base wind whoosh (pink noise, bandpass) ---
  const baseBuf = createPinkNoiseBuffer(ctx, 4.0);
  const baseSrc = ctx.createBufferSource();
  baseSrc.buffer = baseBuf;
  baseSrc.loop   = true;

  const baseFilter = ctx.createBiquadFilter();
  baseFilter.type            = 'bandpass';
  baseFilter.frequency.value = 500;
  baseFilter.Q.value         = 1.2;

  // Gust LFO — irregular-feeling by using a slow sine
  const gustLfo = ctx.createOscillator();
  gustLfo.type            = 'sine';
  gustLfo.frequency.value = 0.05;
  const gustLfoGain = ctx.createGain();
  gustLfoGain.gain.value = 280;
  gustLfo.connect(gustLfoGain);
  gustLfoGain.connect(baseFilter.frequency);

  const baseGain = ctx.createGain();
  fadeIn(baseGain, ctx, 0.45, 2.5);

  // Volume gust envelope
  const volGustLfo = ctx.createOscillator();
  volGustLfo.type            = 'sine';
  volGustLfo.frequency.value = 0.07;
  const volGustDepth = ctx.createGain();
  volGustDepth.gain.value = 0.2;
  volGustLfo.connect(volGustDepth);
  volGustDepth.connect(baseGain.gain);

  baseSrc.connect(baseFilter);
  baseFilter.connect(baseGain);
  baseGain.connect(dest);
  stoppers.push(startSource(baseSrc, ctx));
  stoppers.push(startOsc(gustLfo, ctx));
  stoppers.push(startOsc(volGustLfo, ctx));

  // --- Layer 2: high whistle (white noise, narrow highpass) ---
  const whistleBuf = createWhiteNoiseBuffer(ctx, 2.0);
  const whistleSrc = ctx.createBufferSource();
  whistleSrc.buffer = whistleBuf;
  whistleSrc.loop   = true;

  const whistleFilter = ctx.createBiquadFilter();
  whistleFilter.type            = 'bandpass';
  whistleFilter.frequency.value = 2800;
  whistleFilter.Q.value         = 3.0; // Narrow for whistle effect

  const whistleLfo = ctx.createOscillator();
  whistleLfo.type            = 'sine';
  whistleLfo.frequency.value = 0.09;
  const whistleLfoGain = ctx.createGain();
  whistleLfoGain.gain.value = 800;
  whistleLfo.connect(whistleLfoGain);
  whistleLfoGain.connect(whistleFilter.frequency);

  const whistleGain = ctx.createGain();
  fadeIn(whistleGain, ctx, 0.10, 3.0);

  whistleSrc.connect(whistleFilter);
  whistleFilter.connect(whistleGain);
  whistleGain.connect(dest);
  stoppers.push(startSource(whistleSrc, ctx));
  stoppers.push(startOsc(whistleLfo, ctx));

  // --- Layer 3: deep low whoosh (brown noise, adds mountain heaviness) ---
  const deepBuf = createBrownNoiseBuffer(ctx, 5.0);
  const deepSrc = ctx.createBufferSource();
  deepSrc.buffer = deepBuf;
  deepSrc.loop   = true;

  const deepFilter = ctx.createBiquadFilter();
  deepFilter.type            = 'lowpass';
  deepFilter.frequency.value = 220;

  const deepGain = ctx.createGain();
  fadeIn(deepGain, ctx, 0.22, 3.5);

  deepSrc.connect(deepFilter);
  deepFilter.connect(deepGain);
  deepGain.connect(dest);
  stoppers.push(startSource(deepSrc, ctx));

  return () => stoppers.forEach(s => s());
}

// ---------------------------------------------------------------------------
// Seamless loops: the end of the buffer flows into its start, so a steady
// noise heard on its own has no click where the loop repeats.
// ---------------------------------------------------------------------------
function seamless(ctx: globalThis.AudioContext, make: (c: globalThis.AudioContext, d: number) => AudioBuffer, duration: number, fade = 0.5): AudioBuffer {
  const src  = make(ctx, duration + fade).getChannelData(0);
  const len  = Math.floor(ctx.sampleRate * duration);
  const n    = Math.min(Math.floor(ctx.sampleRate * fade), src.length - len);
  const buf  = ctx.createBuffer(1, len, ctx.sampleRate);
  const out  = buf.getChannelData(0);
  out.set(src.subarray(0, len));
  for (let i = 0; i < n; i++) {
    const a = i / n;
    // Equal-power blend of the start with what follows the end.
    out[i] = src[i] * Math.sqrt(a) + src[len + i] * Math.sqrt(1 - a);
  }
  return buf;
}

// ---------------------------------------------------------------------------
// BREATH WAVE — a slow wave to breathe with: 5 s rising (in), 5 s falling (out)
// ---------------------------------------------------------------------------

function setupBreathWave(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const stoppers: Array<() => void> = [];
  const t0 = ctx.currentTime + 0.05;

  // One cycle that starts at its lowest point: -cos(2πft).
  const shape = ctx.createPeriodicWave(new Float32Array([0, -1]), new Float32Array([0, 0]), { disableNormalization: true });
  const lfo = ctx.createOscillator();
  lfo.setPeriodicWave(shape);
  lfo.frequency.value = 1 / BREATH_WAVE_SECONDS;

  // Body of the wave: brown noise; the filter opens as it comes in.
  const body = ctx.createBufferSource();
  body.buffer = seamless(ctx, createBrownNoiseBuffer, 8);
  body.loop = true;
  const bodyFilter = ctx.createBiquadFilter();
  bodyFilter.type = 'lowpass';
  bodyFilter.frequency.value = 520;
  const bodySweep = ctx.createGain();
  bodySweep.gain.value = 300; // 220 Hz … 820 Hz
  lfo.connect(bodySweep);
  bodySweep.connect(bodyFilter.frequency);

  const bodyGain = ctx.createGain();
  bodyGain.gain.value = 0.5;
  const bodyDepth = ctx.createGain();
  bodyDepth.gain.value = 0.38; // 0.12 … 0.88
  lfo.connect(bodyDepth);
  bodyDepth.connect(bodyGain.gain);

  // Foam on top, strongest at the crest.
  const foam = ctx.createBufferSource();
  foam.buffer = seamless(ctx, createPinkNoiseBuffer, 6);
  foam.loop = true;
  const foamFilter = ctx.createBiquadFilter();
  foamFilter.type = 'bandpass';
  foamFilter.frequency.value = 900;
  foamFilter.Q.value = 0.7;
  const foamGain = ctx.createGain();
  foamGain.gain.value = 0.1;
  const foamDepth = ctx.createGain();
  foamDepth.gain.value = 0.09; // 0.01 … 0.19
  lfo.connect(foamDepth);
  foamDepth.connect(foamGain.gain);

  // The whole layer fades in once, over the first in-breath.
  const layer = ctx.createGain();
  fadeIn(layer, ctx, 1.0, 4.0);

  body.connect(bodyFilter); bodyFilter.connect(bodyGain); bodyGain.connect(layer);
  foam.connect(foamFilter); foamFilter.connect(foamGain); foamGain.connect(layer);
  layer.connect(dest);

  body.start(t0); foam.start(t0); lfo.start(t0);
  stoppers.push(
    () => { try { body.stop(); } catch (_) {} },
    () => { try { foam.stop(); } catch (_) {} },
    () => { try { lfo.stop(); } catch (_) {} },
  );
  return () => stoppers.forEach(s => s());
}

// ---------------------------------------------------------------------------
// PINK / BROWN standalone
// ---------------------------------------------------------------------------
function setupPinkNoise(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const buf = seamless(ctx, createPinkNoiseBuffer, 6.0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop   = true;
  const gain = ctx.createGain();
  fadeIn(gain, ctx, 0.55, 1.5);
  src.connect(gain);
  gain.connect(dest);
  return startSource(src, ctx);
}

function setupGreenNoise(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const buf = createPinkNoiseBuffer(ctx, 4.0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop   = true;
  
  // Green noise: mid-range nature-like frequencies
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1200; // Centered at 1.2kHz
  bandpass.Q.value = 0.5; // Wide range
  
  const gain = ctx.createGain();
  fadeIn(gain, ctx, 0.35, 2.0);
  
  src.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(dest);
  return startSource(src, ctx);
}

function setupBrownNoise(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const buf = seamless(ctx, createBrownNoiseBuffer, 8.0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop   = true;
  const gain = ctx.createGain();
  fadeIn(gain, ctx, 0.45, 1.5);
  src.connect(gain);
  gain.connect(dest);
  return startSource(src, ctx);
}


// ---------------------------------------------------------------------------
// FIRE, STREAM, CRICKETS, STORM, PURR — the Sanctuary's newer sounds.
// The steady part is a looped noise; the living part (crackles, bubbles,
// chirps, a far roll of thunder) is scheduled a moment ahead, at random, so
// it never repeats. Each rises over two seconds, like the others, and none
// has a sharp onset: the thunder swells and fades, it never cracks.
// ---------------------------------------------------------------------------

/** Calls `fn` every `ms` with a time slightly ahead (only while the sound runs). */
function every(ctx: globalThis.AudioContext, ms: number, fn: (at: number) => void): () => void {
  const id = window.setInterval(() => { if (ctx.state === 'running') fn(ctx.currentTime + 0.05); }, ms);
  return () => window.clearInterval(id);
}

// The noise of the newer sounds is made once per kind and length, then reused
// (making it is the one heavy moment, on an old phone a few tenths of a second).
type NoiseMaker = (c: globalThis.AudioContext, d: number) => AudioBuffer;
const loopCache = new WeakMap<globalThis.AudioContext, Map<NoiseMaker, Map<number, AudioBuffer>>>();
function cachedLoop(ctx: globalThis.AudioContext, make: NoiseMaker, secs: number): AudioBuffer {
  let byMaker = loopCache.get(ctx);
  if (!byMaker) { byMaker = new Map(); loopCache.set(ctx, byMaker); }
  let m = byMaker.get(make);
  if (!m) { m = new Map(); byMaker.set(make, m); }
  let b = m.get(secs);
  if (!b) { b = seamless(ctx, make, secs); m.set(secs, b); }
  return b;
}

/** A looped noise through a chain of filters, into its own gain. */
function loopNoise(
  ctx: globalThis.AudioContext, dest: AudioNode,
  make: (c: globalThis.AudioContext, d: number) => AudioBuffer, secs: number,
  filters: Array<[BiquadFilterType, number, number?]>, gain: number,
): { gain: GainNode; stop: () => void } {
  const src = ctx.createBufferSource();
  src.buffer = cachedLoop(ctx, make, secs);
  src.loop = true;
  let node: AudioNode = src;
  for (const [type, freq, q] of filters) {
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    node.connect(f); node = f;
  }
  const g = ctx.createGain(); g.gain.value = gain;
  node.connect(g); g.connect(dest);
  // From a different place in the loop each time, so two layers of one noise never line up.
  src.start(ctx.currentTime + 0.05, Math.random() * secs);
  return { gain: g, stop: () => { try { src.stop(); } catch (_) {} } };
}

/** A slow wobble on a parameter. */
function wobble(ctx: globalThis.AudioContext, param: AudioParam, rate: number, depth: number): () => void {
  const o = ctx.createOscillator(); o.frequency.value = rate;
  const g = ctx.createGain(); g.gain.value = depth;
  o.connect(g); g.connect(param);
  return startOsc(o, ctx);
}

function panner(ctx: globalThis.AudioContext, v: number): AudioNode {
  if (!ctx.createStereoPanner) return ctx.createGain();
  const p = ctx.createStereoPanner(); p.pan.value = v; return p;
}

const whiteCache = new WeakMap<globalThis.AudioContext, AudioBuffer>();
function whiteBuf(ctx: globalThis.AudioContext): AudioBuffer {
  let b = whiteCache.get(ctx);
  if (!b) { b = createWhiteNoiseBuffer(ctx, 2.0); whiteCache.set(ctx, b); }
  return b;
}

/** A short burst of noise through a band: a crackle, a drop. */
function burst(ctx: globalThis.AudioContext, dest: AudioNode, at: number, o: { freq: number; q: number; peak: number; dur: number; pan: number }) {
  const s = ctx.createBufferSource(); s.buffer = whiteBuf(ctx);
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = o.freq; f.Q.value = o.q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(o.peak, at + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, at + o.dur);
  const p = panner(ctx, o.pan);
  s.connect(f); f.connect(g); g.connect(p); p.connect(dest);
  s.start(at, Math.random() * 1.5, o.dur + 0.05);
}

/** The sound's own level, rising over two seconds; its parts connect here. */
function level(ctx: globalThis.AudioContext, dest: AudioNode, target: number): GainNode {
  const g = ctx.createGain();
  fadeIn(g, ctx, target, 2.0);
  g.connect(dest);
  return g;
}

function setupFire(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const out = level(ctx, dest, FIRE_LEVEL);
  const s: Array<() => void> = [];
  const roar = loopNoise(ctx, out, createBrownNoiseBuffer, 7, [['lowpass', 480]], 0.5);
  s.push(roar.stop, wobble(ctx, roar.gain.gain, 0.17, 0.12), wobble(ctx, roar.gain.gain, 0.43, 0.06));
  s.push(loopNoise(ctx, out, createWhiteNoiseBuffer, 4, [['highpass', 3500]], 0.012).stop);
  s.push(every(ctx, 45, (t) => {
    if (Math.random() >= 0.38) return;
    const big = Math.random() < 0.12;
    burst(ctx, out, t + Math.random() * 0.04, big
      ? { freq: 900 + Math.random() * 900, q: 0.8, peak: 0.35 + Math.random() * 0.25, dur: 0.05 + Math.random() * 0.05, pan: Math.random() * 1.2 - 0.6 }
      : { freq: 1800 + Math.random() * 4200, q: 1.4, peak: 0.04 + Math.random() ** 2 * 0.3, dur: 0.004 + Math.random() * 0.025, pan: Math.random() * 1.2 - 0.6 });
  }));
  return () => { s.forEach(f => f()); };
}

function setupStream(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const out = level(ctx, dest, STREAM_LEVEL);
  const s: Array<() => void> = [];
  const a = loopNoise(ctx, out, createWhiteNoiseBuffer, 5, [['bandpass', 850, 0.7]], 0.32);
  const b = loopNoise(ctx, out, createWhiteNoiseBuffer, 5, [['bandpass', 2300, 1.1]], 0.14);
  const c = loopNoise(ctx, out, createPinkNoiseBuffer, 6, [['lowpass', 500]], 0.25);
  s.push(a.stop, b.stop, c.stop,
    wobble(ctx, a.gain.gain, 0.9, 0.08), wobble(ctx, a.gain.gain, 2.3, 0.05),
    wobble(ctx, b.gain.gain, 1.7, 0.05), wobble(ctx, b.gain.gain, 3.1, 0.03), wobble(ctx, c.gain.gain, 0.2, 0.05));
  // Bubbles: a short tone that rises.
  s.push(every(ctx, 40, (t) => {
    if (Math.random() >= 0.45) return;
    const at = t + Math.random() * 0.04, f0 = 450 + Math.random() * 900, dur = 0.025 + Math.random() * 0.05;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(f0, at); o.frequency.exponentialRampToValueAtTime(f0 * (1.4 + Math.random() * 0.6), at + dur);
    const g = ctx.createGain(); const pk = 0.015 + Math.random() * 0.045;
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(pk, at + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    const p = panner(ctx, Math.random() * 1.4 - 0.7);
    o.connect(g); g.connect(p); p.connect(out); o.start(at); o.stop(at + dur + 0.02);
  }));
  return () => { s.forEach(f => f()); };
}

function setupCrickets(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const out = level(ctx, dest, CRICKETS_LEVEL);
  const s: Array<() => void> = [];
  s.push(loopNoise(ctx, out, createPinkNoiseBuffer, 6, [['lowpass', 700]], 0.12).stop);
  // Three crickets, near and far, each with its own pitch and pace.
  for (const c of [
    { f: 4150, gain: 0.05, pan: -0.45, every: 0.62, pulses: 3 },
    { f: 4480, gain: 0.025, pan: 0.5, every: 0.81, pulses: 4 },
    { f: 3900, gain: 0.014, pan: 0.1, every: 0.97, pulses: 3 },
  ]) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = c.f;
    const g = ctx.createGain(); g.gain.value = 0;
    const p = panner(ctx, c.pan);
    o.connect(g); g.connect(p); p.connect(out);
    s.push(startOsc(o, ctx));
    let next = ctx.currentTime + 0.3 + Math.random() * c.every;
    s.push(every(ctx, 60, (t) => {
      if (next < t - 1) next = t;               // after a pause in the background, start again from now
      while (next < t + 0.2) {
        if (Math.random() > 0.08) {
          for (let k = 0; k < c.pulses; k++) {
            const at = next + k * 0.032;
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(c.gain, at + 0.006);
            g.gain.linearRampToValueAtTime(c.gain * 0.7, at + 0.014);
            g.gain.linearRampToValueAtTime(0, at + 0.02);
          }
        }
        next += c.every * (0.94 + Math.random() * 0.12);
      }
    }));
  }
  return () => { s.forEach(f => f()); };
}

function setupStorm(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const out = level(ctx, dest, STORM_LEVEL);
  const s: Array<() => void> = [];
  s.push(loopNoise(ctx, out, createWhiteNoiseBuffer, 5, [['lowpass', 2600], ['highpass', 380]], 0.26).stop);
  s.push(loopNoise(ctx, out, createPinkNoiseBuffer, 6, [['lowpass', 900]], 0.2).stop);
  s.push(every(ctx, 35, (t) => {
    if (Math.random() < 0.5) burst(ctx, out, t + Math.random() * 0.03, { freq: 3000 + Math.random() * 4000, q: 2, peak: 0.01 + Math.random() * 0.03, dur: 0.008 + Math.random() * 0.015, pan: Math.random() * 1.6 - 0.8 });
  }));
  // The thunder, far away: a slow swell, a second one, a long tail.
  const brown = createBrownNoiseBuffer(ctx, 4.0);
  const roll = (at: number) => {
    const src = ctx.createBufferSource(); src.buffer = brown; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 120 + Math.random() * 60;
    const g = ctx.createGain(); const pk = 0.7 + Math.random() * 0.4, len = 7 + Math.random() * 5;
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(pk * 0.6, at + 1.4);
    g.gain.linearRampToValueAtTime(pk, at + 2.4);
    g.gain.linearRampToValueAtTime(pk * 0.55, at + 3.6);
    g.gain.linearRampToValueAtTime(pk * 0.8, at + 4.6);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    const p = panner(ctx, Math.random() * 1.2 - 0.6);
    src.connect(lp); lp.connect(g); g.connect(p); p.connect(out);
    src.start(at, Math.random() * 3); src.stop(at + len + 0.1);
  };
  let next = ctx.currentTime + 6;
  s.push(every(ctx, 500, (t) => {
    if (next < t - 1) next = t + 4;
    if (next < t + 1) { roll(next); next += 18 + Math.random() * 20; }
  }));
  return () => { s.forEach(f => f()); };
}

const purrCache = new WeakMap<globalThis.AudioContext, AudioBuffer>();
/** Three breaths of a purr, a little different each, made once and looped. */
function purrBuffer(ctx: globalThis.AudioContext): AudioBuffer {
  const cached = purrCache.get(ctx);
  if (cached) return cached;
  const sr = ctx.sampleRate;
  const parts: Array<[number, number, number]> = [];
  for (let k = 0; k < 3; k++) parts.push([2.3 + Math.random() * 0.4, 25 + Math.random() * 2, 1], [0.25, 0, 0], [2.5 + Math.random() * 0.4, 23 + Math.random() * 2, 0.8], [0.35, 0, 0]);
  const len = Math.floor(parts.reduce((a, p) => a + p[0], 0) * sr);
  const b = ctx.createBuffer(1, len, sr), d = b.getChannelData(0);
  let i = 0, low = 0;
  for (const [secs, rate, amp] of parts) {
    const n = Math.floor(secs * sr);
    for (let j = 0; j < n && i < len; j++, i++) {
      low = low * 0.92 + (Math.random() * 2 - 1) * 0.08;
      if (!rate) { d[i] = 0; continue; }
      const ph = ((j / sr) * rate) % 1;
      const pulse = Math.exp(-ph * 6.5) * (0.6 + 0.4 * Math.sin(Math.PI * Math.min(1, ph * 4)));
      const breath = Math.sin(Math.PI * (j / n)) ** 0.6;
      d[i] = low * pulse * breath * amp * 5;
    }
  }
  purrCache.set(ctx, b);
  return b;
}

function setupPurr(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const out = level(ctx, dest, PURR_LEVEL);
  const src = ctx.createBufferSource(); src.buffer = purrBuffer(ctx); src.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
  const warm = ctx.createBiquadFilter(); warm.type = 'peaking'; warm.frequency.value = 140; warm.gain.value = 6;
  src.connect(lp); lp.connect(warm); warm.connect(out);
  return startSource(src, ctx);
}

// Their levels next to the older sounds (set by ear and by measure: about as loud as the rain).
// Measured in the Sanctuary: the rain -38 dB, the waves -40, the wind -48.
const FIRE_LEVEL = 1.5;      // about -40
const STREAM_LEVEL = 1.7;    // about -40
const CRICKETS_LEVEL = 2.8;  // about -47: a night sound, quieter than the rest
const STORM_LEVEL = 1.6;     // about -40, the thunder above it now and then
const PURR_LEVEL = 1.15;     // about -41

/** Each background sound: starts it into `dest` and returns how to stop it. */
export const AMBIENT_LAYERS: Record<AmbientLayer, (c: globalThis.AudioContext, d: AudioNode) => () => void> = {
  rain:  setupRain,
  ocean: setupOcean,
  wind:  setupWind,
  pink:  setupPinkNoise,
  brown: setupBrownNoise,
  green: setupGreenNoise,
  breath: setupBreathWave,
  fire: setupFire,
  stream: setupStream,
  crickets: setupCrickets,
  storm: setupStorm,
  purr: setupPurr,
};
