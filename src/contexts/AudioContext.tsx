import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AudioConfig {
  base: number;
  beat: number;
  pulse?: number;
  carrierType?: 'sine' | 'triangle' | 'square' | 'sawtooth';
  pulseType?: 'sine';
  disableSynth?: boolean;
  ambientLayers?: ('rain' | 'ocean' | 'wind' | 'brown' | 'pink')[];
  id?: string;
}

export interface AudioContextProps {
  masterPlaying: boolean;
  masterVolume: number;
  toggleMaster: () => void;
  setMasterVolume: (vol: number) => void;
  stopAll: () => void;
  isPlaying: boolean;
  volume: number;
  startAudio: (config: AudioConfig) => void;
  stopAudio: () => void;
  setGlobalVolume: (v: number) => void;
  updateArmPos: (armPos: number) => void;
  updatePhase: (idx: number, label: string) => void;
}

interface SynthNodes {
  masterGain?: GainNode;
  breathGain?: GainNode;
  compressor?: DynamicsCompressorNode;
  vocalGain?: GainNode;
  vocalLowpass?: BiquadFilterNode;
  formantF1?: BiquadFilterNode;
  formantF2?: BiquadFilterNode;
  formantF3?: BiquadFilterNode;
  vOsc1Gain?: GainNode;
  vOsc2Gain?: GainNode;
  vOsc3Gain?: GainNode;
  subGain?: GainNode;
  currentConfig?: AudioConfig;
  stoppers: Array<() => void>;
  sessionId: number;
}

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
// PINK / BROWN standalone
// ---------------------------------------------------------------------------
function setupPinkNoise(ctx: globalThis.AudioContext, dest: AudioNode): () => void {
  const buf = createPinkNoiseBuffer(ctx, 3.0);
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
  const buf = createBrownNoiseBuffer(ctx, 4.0);
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
// Context & Provider
// ---------------------------------------------------------------------------

const AudioCtx = createContext<AudioContextProps | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [masterVolume, _setMasterVolume]  = useState(1.0);
  const [volume, _setVolume]              = useState(1.0);

  // Refs so callbacks always read live values without stale closures
  const masterVolumeRef = useRef(1.0);
  const globalVolumeRef = useRef(1.0);

  const webAudioCtxRef = useRef<globalThis.AudioContext | null>(null);
  const nodesRef       = useRef<SynthNodes>({
    stoppers: [],
    sessionId: 0,
  });

  // ---- Volume setters ----
  const setMasterVolume = useCallback((v: number) => {
    masterVolumeRef.current = v;
    _setMasterVolume(v);
  }, []);

  const setGlobalVolume = useCallback((v: number) => {
    globalVolumeRef.current = v;
    _setVolume(v);
    const n = nodesRef.current;
    if (n.masterGain && webAudioCtxRef.current) {
      const t = 0.5 * v * masterVolumeRef.current;
      n.masterGain.gain.setTargetAtTime(t, webAudioCtxRef.current.currentTime, 0.1);
    }
  }, []);

  // ---- AudioContext init ----
  const getCtx = (): globalThis.AudioContext => {
    if (!webAudioCtxRef.current) {
      const AC = (window as any).AudioContext ?? (window as any).webkitAudioContext;
      webAudioCtxRef.current = new AC();
    }
    if (webAudioCtxRef.current.state === 'suspended') {
      webAudioCtxRef.current.resume();
    }
    return webAudioCtxRef.current;
  };

  // ---- Hard-stop all nodes ----
  const hardStop = useCallback(() => {
    const n = nodesRef.current;
    n.stoppers.forEach(s => s());
    n.stoppers    = [];
    if (n.breathGain) {
      try { n.breathGain.disconnect(); } catch (e) {}
    }
    if (n.masterGain) {
      try { n.masterGain.disconnect(); } catch (e) {}
    }
    if (n.compressor) {
      try { n.compressor.disconnect(); } catch (e) {}
    }
    if (n.vocalGain) {
      try { n.vocalGain.disconnect(); } catch (e) {}
    }
    if (n.vocalLowpass) {
      try { n.vocalLowpass.disconnect(); } catch (e) {}
    }
    if (n.formantF1) {
      try { n.formantF1.disconnect(); } catch (e) {}
    }
    if (n.formantF2) {
      try { n.formantF2.disconnect(); } catch (e) {}
    }
    if (n.formantF3) {
      try { n.formantF3.disconnect(); } catch (e) {}
    }
    if (n.vOsc1Gain) { try { n.vOsc1Gain.disconnect(); } catch(e) {} }
    if (n.vOsc2Gain) { try { n.vOsc2Gain.disconnect(); } catch(e) {} }
    if (n.vOsc3Gain) { try { n.vOsc3Gain.disconnect(); } catch(e) {} }
    if (n.subGain) { try { n.subGain.disconnect(); } catch(e) {} }
    n.breathGain  = undefined;
    n.masterGain  = undefined;
    n.compressor  = undefined;
    n.vocalGain   = undefined;
    n.vocalLowpass = undefined;
    n.formantF1   = undefined;
    n.formantF2   = undefined;
    n.formantF3   = undefined;
    n.vOsc1Gain   = undefined;
    n.vOsc2Gain   = undefined;
    n.vOsc3Gain   = undefined;
    n.subGain     = undefined;
    n.currentConfig = undefined;
  }, []);

  // ---- startAudio ----
  const startAudio = useCallback((config: AudioConfig) => {
    const n = nodesRef.current;

    if (n.masterGain && webAudioCtxRef.current) {
      n.masterGain.gain.cancelScheduledValues(webAudioCtxRef.current.currentTime);
    }

    n.sessionId += 1;
    hardStop();
    n.currentConfig = config;

    setIsPlaying(true);
    setMasterPlaying(true);

    try {
      const ctx = getCtx();

      // ---- Compressor (prevents clipping when layers stack) ----
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value      = 12;
      compressor.ratio.value     = 5;
      compressor.attack.value    = 0.004;
      compressor.release.value   = 0.3;
      compressor.connect(ctx.destination);

      // ---- Master gain ----
      const masterGain = ctx.createGain();
      masterGain.connect(compressor);
      
      // Fix clipping on start by explicitly ensuring gain is 0 immediately
      masterGain.gain.value = 0;
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(
        0.5 * globalVolumeRef.current * masterVolumeRef.current,
        ctx.currentTime + 2.5
      );

      n.masterGain = masterGain;
      n.compressor = compressor;

      // ---- Breath gain (independent breathing modulation) ----
      const breathGain = ctx.createGain();
      breathGain.gain.value = 0.3; // safe starting baseline (armPos = 0)
      breathGain.gain.setValueAtTime(0.3, ctx.currentTime);
      breathGain.connect(masterGain);
      n.breathGain = breathGain;

      // ---- Pulse LFO ----
      const pulseGain = ctx.createGain();
      pulseGain.gain.value = 1.0;
      pulseGain.connect(breathGain);

      if (!config.disableSynth && config.pulse) {
        const lfo      = ctx.createOscillator();
        lfo.type            = config.pulseType ?? 'sine';
        lfo.frequency.setValueAtTime(config.pulse, ctx.currentTime);
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.value = 0.35;
        lfo.connect(lfoDepth);
        lfoDepth.connect(pulseGain.gain);
        lfo.start(ctx.currentTime + 0.05);
        n.stoppers.push(() => { try { lfo.stop(); } catch (_) {} });
      }

      // ---- Binaural oscillators ----
      if (!config.disableSynth && config.base > 0) {
        const merger = ctx.createChannelMerger(2);
        
        // Solid ramp-in for binaural oscillators to prevent any initial popping
        const synthGain = ctx.createGain();
        synthGain.gain.value = 0;
        synthGain.gain.setValueAtTime(0, ctx.currentTime);
        synthGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.5);
        
        merger.connect(synthGain);
        synthGain.connect(pulseGain);

        if (ctx.destination.channelCount >= 2) {
          ctx.destination.channelInterpretation = 'speakers';
        }

        const leftOsc  = ctx.createOscillator();
        leftOsc.type            = config.carrierType ?? 'sine';
        leftOsc.frequency.setValueAtTime(config.base, ctx.currentTime);
        leftOsc.connect(merger, 0, 0);

        const rightOsc = ctx.createOscillator();
        rightOsc.type            = config.carrierType ?? 'sine';
        rightOsc.frequency.setValueAtTime(config.base + config.beat, ctx.currentTime);
        rightOsc.connect(merger, 0, 1);

        leftOsc.start(ctx.currentTime + 0.05);
        rightOsc.start(ctx.currentTime + 0.05);
        n.stoppers.push(
          () => { try { leftOsc.stop();  } catch (_) {} },
          () => { try { rightOsc.stop(); } catch (_) {} }
        );
      }

      // ---- Ambient layers ----
      // KEY FIX: ambientGain connects to breathGain with a simple
      // stable value. Each layer handles its own fade-in internally.
      if (config.ambientLayers?.length) {
        const ambientGain = ctx.createGain();
        ambientGain.gain.setValueAtTime(0.5, ctx.currentTime); // stable, no conflict
        ambientGain.connect(breathGain);

        const layerMap: Record<
          string,
          (c: globalThis.AudioContext, d: AudioNode) => () => void
        > = {
          rain:  setupRain,
          ocean: setupOcean,
          wind:  setupWind,
          pink:  setupPinkNoise,
          brown: setupBrownNoise,
          green: setupGreenNoise,
        };

        for (const layer of config.ambientLayers) {
          const fn = layerMap[layer];
          if (fn) n.stoppers.push(fn(ctx, ambientGain));
        }
      }

      // ---- Vocal Humming Guide Tone ----
      if (['bhramari-humming', 'aum-resonance', 'satanama-resonance', 'a-major-resonance', 'c-major-resonance', 'throat-chakra-humming', 'om-pure-resonance', 'om-resonance-throat'].includes(config.id)) {
        const vocalGain = ctx.createGain();
        vocalGain.gain.setValueAtTime(0, ctx.currentTime);
        vocalGain.connect(masterGain);
        n.vocalGain = vocalGain;

        const vocalLowpass = ctx.createBiquadFilter();
        vocalLowpass.type = 'lowpass';
        vocalLowpass.frequency.setValueAtTime(1400, ctx.currentTime);
        vocalLowpass.Q.setValueAtTime(1.0, ctx.currentTime);
        vocalLowpass.connect(vocalGain);
        n.vocalLowpass = vocalLowpass;

        const formantF1 = ctx.createBiquadFilter();
        formantF1.type = 'peaking';
        formantF1.frequency.setValueAtTime(750, ctx.currentTime); // default "A"
        formantF1.Q.setValueAtTime(3.0, ctx.currentTime); // Reduced to avoid mic feedback ringing
        formantF1.gain.setValueAtTime(10, ctx.currentTime);
        formantF1.connect(vocalLowpass);
        n.formantF1 = formantF1;

        const formantF2 = ctx.createBiquadFilter();
        formantF2.type = 'peaking';
        formantF2.frequency.setValueAtTime(1150, ctx.currentTime); // default "A"
        formantF2.Q.setValueAtTime(3.5, ctx.currentTime);
        formantF2.gain.setValueAtTime(8, ctx.currentTime);
        formantF2.connect(formantF1);
        n.formantF2 = formantF2;

        const formantF3 = ctx.createBiquadFilter();
        formantF3.type = 'peaking';
        formantF3.frequency.setValueAtTime(2600, ctx.currentTime); // "Singer's formant" for presence
        formantF3.Q.setValueAtTime(2.0, ctx.currentTime);
        formantF3.gain.setValueAtTime(6, ctx.currentTime);
        formantF3.connect(formantF2);
        n.formantF3 = formantF3;

        // Warm fundamental triangle oscillator representing vocal throat tone
        const vOsc1 = ctx.createOscillator();
        vOsc1.type = 'triangle';
        vOsc1.frequency.setValueAtTime(config.base || 128, ctx.currentTime);
        const vOsc1Gain = ctx.createGain();
        vOsc1Gain.gain.setValueAtTime(0.6, ctx.currentTime);
        vOsc1.connect(vOsc1Gain);
        vOsc1Gain.connect(formantF3);
        n.vOsc1Gain = vOsc1Gain;

        // Rich fundamental sawtooth representing the main vocal cord buzz
        const vOsc2 = ctx.createOscillator();
        vOsc2.type = 'sawtooth';
        vOsc2.frequency.setValueAtTime((config.base || 128) + 0.5, ctx.currentTime); // slight detune at fundamental
        const vOsc2Gain = ctx.createGain();
        vOsc2Gain.gain.setValueAtTime(0.3, ctx.currentTime); // rich harmonic base
        vOsc2.connect(vOsc2Gain);
        vOsc2Gain.connect(formantF3);
        n.vOsc2Gain = vOsc2Gain;

        // An octave up sawtooth for top-end sizzle and brightness
        const vOsc3 = ctx.createOscillator();
        vOsc3.type = 'sawtooth';
        vOsc3.frequency.setValueAtTime((config.base || 128) * 2 + 0.35, ctx.currentTime); 
        const vOsc3Gain = ctx.createGain();
        vOsc3Gain.gain.setValueAtTime(0.15, ctx.currentTime); 
        vOsc3.connect(vOsc3Gain);
        vOsc3Gain.connect(formantF3);
        n.vOsc3Gain = vOsc3Gain;

        // Deep sub-bass sinusoid representing chest cavity resonance
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime((config.base || 128) / 2, ctx.currentTime);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.28, ctx.currentTime);
        subOsc.connect(subGain);
        subGain.connect(formantF3);
        n.subGain = subGain;

        // Vibrato synthesis representing warm, relaxed vocal chords flutter
        const vibratoLfo = ctx.createOscillator();
        vibratoLfo.type = 'sine';
        vibratoLfo.frequency.setValueAtTime(4.8, ctx.currentTime); // natural singing vibrato range
        const vibratoDepth = ctx.createGain();
        vibratoDepth.gain.setValueAtTime(1.8, ctx.currentTime); // vibrato width

        vibratoLfo.connect(vibratoDepth);
        vibratoDepth.connect(vOsc1.frequency);
        vibratoDepth.connect(vOsc2.frequency);

        // Start all generators
        vOsc1.start(ctx.currentTime + 0.05);
        vOsc2.start(ctx.currentTime + 0.05);
        vOsc3.start(ctx.currentTime + 0.05);
        subOsc.start(ctx.currentTime + 0.05);
        vibratoLfo.start(ctx.currentTime + 0.05);

        n.stoppers.push(
          () => { try { vOsc1.stop(); } catch (_) {} },
          () => { try { vOsc2.stop(); } catch (_) {} },
          () => { try { vOsc3.stop(); } catch (_) {} },
          () => { try { subOsc.stop(); } catch (_) {} },
          () => { try { vibratoLfo.stop(); } catch (_) {} }
        );
      }
    } catch (e) {
      console.error('[AudioProvider] startAudio failed:', e);
    }
  }, [hardStop]);

  // ---- stopAudio ----
  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    setMasterPlaying(false);

    const n       = nodesRef.current;
    const ctx     = webAudioCtxRef.current;
    const session = n.sessionId;

    if (n.masterGain && ctx) {
      n.masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
      setTimeout(() => {
        if (nodesRef.current.sessionId !== session) return;
        hardStop();
      }, 1600);
    } else {
      hardStop();
    }
  }, [hardStop]);

  // ---- updateArmPos ----
  const updateArmPos = useCallback((armPos: number) => {
    const n   = nodesRef.current;
    const ctx = webAudioCtxRef.current;
    if (!ctx) return;

    if (n.breathGain) {
      const target = 0.3 + armPos * 0.7;
      n.breathGain.gain.setTargetAtTime(target, ctx.currentTime, 0.1);
    }

    // Dynamic Formant Morphing depending on the active exercise
    if (n.vocalLowpass && n.formantF1 && n.formantF2 && n.vocalGain) {
      const exerciseId = n.currentConfig?.id;

      if (exerciseId === 'aum-resonance') {
        // High-fidelity A-O-M morphing based on arm position (1.0 = start/Aaa to 0.0 = end/Mmm)
        let targetF1 = 750;
        let targetF2 = 1150;
        let targetF3 = 2600;
        let targetLP = 1400;
        let targetG1 = 12;
        let targetG2 = 10;
        let targetG3 = 8;
        
        // Oscillator crossfading
        let targetOsc1 = 0.6; // Triangle (fundamental)
        let targetOsc2 = 0.24; // Sawtooth (vocal cords)
        let targetOsc3 = 0.15; // Sawtooth octave up (sizzle)
        let targetSub = 0.28; // Sine (chest)

        if (armPos > 0.65) {
          // "Aaa" state (Thoracic, Open, Bright)
          targetF1 = 750; targetF2 = 1150; targetF3 = 2800;
          targetLP = 1800;
          targetG1 = 12; targetG2 = 10; targetG3 = 12;
          targetOsc1 = 0.5; targetOsc2 = 0.4; targetOsc3 = 0.2; targetSub = 0.35;
        } else if (armPos >= 0.3) {
          // "Ooo" state (Rounded, Mid-chest)
          const t = (armPos - 0.3) / 0.35; // 0 to 1
          targetF1 = 480 + t * 270;
          targetF2 = 850 + t * 300;
          targetF3 = 2400 + t * 400;
          targetLP = 1000 + t * 800;
          targetG1 = 12 - t * 2;
          targetG2 = 9 - t * 1;
          targetG3 = 4 + t * 8;
          targetOsc1 = 0.65 - t * 0.15;
          targetOsc2 = 0.20 + t * 0.20;
          targetOsc3 = 0.05 + t * 0.15;
          targetSub = 0.40 - t * 0.05;
        } else {
          // "Mmm" state (Nasal, Closed lips, Head resonance)
          const t = armPos / 0.3; // 0 to 1
          targetF1 = 220 + t * 260;
          targetF2 = 320 + t * 530;
          targetF3 = 1800 + t * 600;
          targetLP = 240 + t * 760;
          targetG1 = 14 - t * 2; // Reduced down from 16 to avoid pure sub feedback
          targetG2 = -12 + t * 21; // Muffle F2
          targetG3 = -20 + t * 24; // Muffle F3 completely
          targetOsc1 = 0.85 - t * 0.20;
          targetOsc2 = 0.05 + t * 0.15;
          targetOsc3 = 0.0 + t * 0.05;
          targetSub = 0.20 + t * 0.20;
        }

        // Apply smooth target transitions to prevent clipping/pops
        n.formantF1.frequency.setTargetAtTime(targetF1, ctx.currentTime, 0.15);
        n.formantF2.frequency.setTargetAtTime(targetF2, ctx.currentTime, 0.15);
        if (n.formantF3) n.formantF3.frequency.setTargetAtTime(targetF3, ctx.currentTime, 0.15);
        
        n.vocalLowpass.frequency.setTargetAtTime(targetLP, ctx.currentTime, 0.15);
        
        n.formantF1.gain.setTargetAtTime(targetG1, ctx.currentTime, 0.15);
        n.formantF2.gain.setTargetAtTime(targetG2, ctx.currentTime, 0.15);
        if (n.formantF3) n.formantF3.gain.setTargetAtTime(targetG3, ctx.currentTime, 0.15);
        
        if (n.vOsc1Gain) n.vOsc1Gain.gain.setTargetAtTime(targetOsc1, ctx.currentTime, 0.15);
        if (n.vOsc2Gain) n.vOsc2Gain.gain.setTargetAtTime(targetOsc2, ctx.currentTime, 0.15);
        if (n.vOsc3Gain) n.vOsc3Gain.gain.setTargetAtTime(targetOsc3, ctx.currentTime, 0.15);
        if (n.subGain) n.subGain.gain.setTargetAtTime(targetSub, ctx.currentTime, 0.15);

      } else if (exerciseId === 'om-resonance-throat') {
        // High-fidelity O-M morphing based on arm position (1.0 = start Ooo to 0.0 = end Mmm)
        // Maps 1.0 -> 0.4 (Ooo) and 0.4 -> 0.0 (Mmm)
        let targetF1 = 480;
        let targetF2 = 850;
        let targetF3 = 2400;
        let targetLP = 1000;
        let targetG1 = 12;
        let targetG2 = 9;
        let targetG3 = 4;
        let targetOsc1 = 0.65;
        let targetOsc2 = 0.20;
        let targetOsc3 = 0.05;
        let targetSub = 0.40;

        if (armPos >= 0.4) {
          // "Ooo" state (Rounded, Mid-chest/Throat) remains stable or slight morph
          const t = (armPos - 0.4) / 0.6; // 0 to 1
          targetF1 = 480 + t * 50;
          targetF2 = 850 + t * 50;
          targetF3 = 2400;
          targetLP = 1000 + t * 200;
        } else {
          // "Mmm" state (Nasal, Closed lips, Head resonance)
          const t = armPos / 0.4; // 0 to 1
          targetF1 = 220 + t * 260; // 220 to 480
          targetF2 = 320 + t * 530; // 320 to 850
          targetF3 = 1800 + t * 600; // 1800 to 2400
          targetLP = 240 + t * 760; // 240 to 1000
          targetG1 = 14 - t * 2; // 14 to 12
          targetG2 = -12 + t * 21; // -12 to 9
          targetG3 = -20 + t * 24; // -20 to 4
          targetOsc1 = 0.85 - t * 0.20; // 0.85 to 0.65
          targetOsc2 = 0.05 + t * 0.15; // 0.05 to 0.20
          targetOsc3 = 0.0 + t * 0.05; // 0 to 0.05
          targetSub = 0.20 + t * 0.20; // 0.20 to 0.40
        }

        n.formantF1.frequency.setTargetAtTime(targetF1, ctx.currentTime, 0.15);
        n.formantF2.frequency.setTargetAtTime(targetF2, ctx.currentTime, 0.15);
        if (n.formantF3) n.formantF3.frequency.setTargetAtTime(targetF3, ctx.currentTime, 0.15);
        
        n.vocalLowpass.frequency.setTargetAtTime(targetLP, ctx.currentTime, 0.15);
        
        n.formantF1.gain.setTargetAtTime(targetG1, ctx.currentTime, 0.15);
        n.formantF2.gain.setTargetAtTime(targetG2, ctx.currentTime, 0.15);
        if (n.formantF3) n.formantF3.gain.setTargetAtTime(targetG3, ctx.currentTime, 0.15);
        
        if (n.vOsc1Gain) n.vOsc1Gain.gain.setTargetAtTime(targetOsc1, ctx.currentTime, 0.15);
        if (n.vOsc2Gain) n.vOsc2Gain.gain.setTargetAtTime(targetOsc2, ctx.currentTime, 0.15);
        if (n.vOsc3Gain) n.vOsc3Gain.gain.setTargetAtTime(targetOsc3, ctx.currentTime, 0.15);
        if (n.subGain) n.subGain.gain.setTargetAtTime(targetSub, ctx.currentTime, 0.15);

      } else if (exerciseId === 'a-major-resonance') {
        // Bright, open "Aaa" vocal tone layout - purely sustained A Major
        // Swell logic to make the "Aaa" feel incredibly grand, rich, and expanding
        // armPos goes 1.0 (start exhale) down to 0.0
        
        // We calculate some envelope based on the armPos (highest at armPos=0.5, i.e. middle of exhale)
        const swell = Math.sin(armPos * Math.PI); // 0 at 0.0, 1 at 0.5, 0 at 1.0
        
        n.formantF1.frequency.setTargetAtTime(750 + swell * 50, ctx.currentTime, 0.2);
        n.formantF2.frequency.setTargetAtTime(1150 + swell * 100, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.frequency.setTargetAtTime(2600 + swell * 200, ctx.currentTime, 0.2);
        
        n.vocalLowpass.frequency.setTargetAtTime(1800 + swell * 400, ctx.currentTime, 0.2); // Open up the lowpass
        
        // Reduced peak gains slightly to remove metallic 'mic feedback'
        n.formantF1.gain.setTargetAtTime(12 + swell * 2, ctx.currentTime, 0.2);
        n.formantF2.gain.setTargetAtTime(10 + swell * 2, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.gain.setTargetAtTime(8 + swell * 2, ctx.currentTime, 0.2);
        
        if (n.vOsc1Gain) n.vOsc1Gain.gain.setTargetAtTime(0.5 + swell * 0.2, ctx.currentTime, 0.2);
        if (n.vOsc2Gain) n.vOsc2Gain.gain.setTargetAtTime(0.35 + swell * 0.25, ctx.currentTime, 0.2);
        if (n.vOsc3Gain) n.vOsc3Gain.gain.setTargetAtTime(0.1 + swell * 0.15, ctx.currentTime, 0.2); // More sizzle in the middle
        if (n.subGain) n.subGain.gain.setTargetAtTime(0.3 + swell * 0.15, ctx.currentTime, 0.2);

      } else if (exerciseId === 'c-major-resonance') {
        // Deep, rounded "Uuu" (Ουου) vocal tone layout - C Major
        // Very grounded, sub-heavy, narrower formants.
        const swell = Math.sin(armPos * Math.PI);
        
        n.formantF1.frequency.setTargetAtTime(350 + swell * 50, ctx.currentTime, 0.2);
        n.formantF2.frequency.setTargetAtTime(750 + swell * 100, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.frequency.setTargetAtTime(2200, ctx.currentTime, 0.2);
        
        n.vocalLowpass.frequency.setTargetAtTime(1000 + swell * 200, ctx.currentTime, 0.2);
        
        n.formantF1.gain.setTargetAtTime(14 + swell * 2, ctx.currentTime, 0.2);
        n.formantF2.gain.setTargetAtTime(6 + swell * 2, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.gain.setTargetAtTime(-4, ctx.currentTime, 0.2);
        
        if (n.vOsc1Gain) n.vOsc1Gain.gain.setTargetAtTime(0.7, ctx.currentTime, 0.2); // Heavy fundamental
        if (n.vOsc2Gain) n.vOsc2Gain.gain.setTargetAtTime(0.15 + swell * 0.1, ctx.currentTime, 0.2); // Mild saw
        if (n.vOsc3Gain) n.vOsc3Gain.gain.setTargetAtTime(0.02 + swell * 0.03, ctx.currentTime, 0.2); // Very little sizzle
        if (n.subGain) n.subGain.gain.setTargetAtTime(0.5 + swell * 0.2, ctx.currentTime, 0.2); // Very strong sub

      } else if (exerciseId === 'throat-chakra-humming') {
        const swell = Math.sin(armPos * Math.PI);
        n.formantF1.frequency.setTargetAtTime(600 + swell * 50, ctx.currentTime, 0.2);
        n.formantF2.frequency.setTargetAtTime(950 + swell * 100, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.frequency.setTargetAtTime(2400, ctx.currentTime, 0.2);
        
        n.vocalLowpass.frequency.setTargetAtTime(1400 + swell * 200, ctx.currentTime, 0.2);
        
        n.formantF1.gain.setTargetAtTime(12 + swell * 2, ctx.currentTime, 0.2);
        n.formantF2.gain.setTargetAtTime(8 + swell * 2, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.gain.setTargetAtTime(-2, ctx.currentTime, 0.2);
        
        if (n.vOsc1Gain) n.vOsc1Gain.gain.setTargetAtTime(0.6, ctx.currentTime, 0.2); 
        if (n.vOsc2Gain) n.vOsc2Gain.gain.setTargetAtTime(0.25 + swell * 0.1, ctx.currentTime, 0.2);
        if (n.vOsc3Gain) n.vOsc3Gain.gain.setTargetAtTime(0.05 + swell * 0.05, ctx.currentTime, 0.2); 
        if (n.subGain) n.subGain.gain.setTargetAtTime(0.2 + swell * 0.1, ctx.currentTime, 0.2);

      } else {
        // bhramari-humming, om-pure-resonance, or default: deep nasal warm "Mmm" hum
        n.formantF1.frequency.setTargetAtTime(220, ctx.currentTime, 0.2);
        n.formantF2.frequency.setTargetAtTime(320, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.frequency.setTargetAtTime(1800, ctx.currentTime, 0.2);
        
        n.vocalLowpass.frequency.setTargetAtTime(240, ctx.currentTime, 0.2);
        
        n.formantF1.gain.setTargetAtTime(14, ctx.currentTime, 0.2);
        n.formantF2.gain.setTargetAtTime(-12, ctx.currentTime, 0.2);
        if (n.formantF3) n.formantF3.gain.setTargetAtTime(-20, ctx.currentTime, 0.2);
        
        if (n.vOsc1Gain) n.vOsc1Gain.gain.setTargetAtTime(0.85, ctx.currentTime, 0.2);
        if (n.vOsc2Gain) n.vOsc2Gain.gain.setTargetAtTime(0.02, ctx.currentTime, 0.2);
        if (n.vOsc3Gain) n.vOsc3Gain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.2);
        if (n.subGain) n.subGain.gain.setTargetAtTime(0.15, ctx.currentTime, 0.2);
      }
    }
  }, []);

  // ---- updatePhase ----
  const updatePhase = useCallback((idx: number, label: string) => {
    const n   = nodesRef.current;
    const ctx = webAudioCtxRef.current;
    if (!ctx) return;

    if (n.vocalGain) {
      if (idx === 2) {
        // Exhale / Humming phase is active - fade voice guide in nicely
        n.vocalGain.gain.cancelScheduledValues(ctx.currentTime);
        n.vocalGain.gain.setValueAtTime(n.vocalGain.gain.value, ctx.currentTime);
        n.vocalGain.gain.setTargetAtTime(0.85, ctx.currentTime, 0.6); // Very smooth slow attack exponent
      } else {
        // Other phases (Inhale / Hold) - fade voice guide out so user silent exhales or holds
        n.vocalGain.gain.cancelScheduledValues(ctx.currentTime);
        n.vocalGain.gain.setValueAtTime(n.vocalGain.gain.value, ctx.currentTime);
        n.vocalGain.gain.setTargetAtTime(0, ctx.currentTime, 0.4); // Smooth gentle decay
      }
    }
  }, []);

  const toggleMaster = useCallback(() => setMasterPlaying(p => !p), []);
  const stopAll      = useCallback(() => { setMasterPlaying(false); stopAudio(); }, [stopAudio]);

  // ---- Cleanup on unmount ----
  React.useEffect(() => {
    return () => {
      hardStop();
      webAudioCtxRef.current?.close();
    };
  }, [hardStop]);

  return (
    <AudioCtx.Provider
      value={{
        masterPlaying, masterVolume, toggleMaster, setMasterVolume,
        stopAll, isPlaying, volume, startAudio, stopAudio,
        setGlobalVolume, updateArmPos, updatePhase,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudioMixer(): AudioContextProps {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudioMixer must be used within AudioProvider');
  return ctx;
}
