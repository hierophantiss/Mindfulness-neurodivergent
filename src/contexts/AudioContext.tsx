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
}

interface SynthNodes {
  masterGain?: GainNode;
  compressor?: DynamicsCompressorNode;
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
    if (n.masterGain) {
      try { n.masterGain.disconnect(); } catch (e) {}
    }
    if (n.compressor) {
      try { n.compressor.disconnect(); } catch (e) {}
    }
    n.masterGain  = undefined;
    n.compressor  = undefined;
  }, []);

  // ---- startAudio ----
  const startAudio = useCallback((config: AudioConfig) => {
    const n = nodesRef.current;

    if (n.masterGain && webAudioCtxRef.current) {
      n.masterGain.gain.cancelScheduledValues(webAudioCtxRef.current.currentTime);
    }

    n.sessionId += 1;
    hardStop();

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

      // ---- Pulse LFO ----
      const pulseGain = ctx.createGain();
      pulseGain.gain.value = 1.0;
      pulseGain.connect(masterGain);

      if (!config.disableSynth && config.pulse) {
        const lfo      = ctx.createOscillator();
        lfo.type            = config.pulseType ?? 'sine';
        lfo.frequency.value = config.pulse;
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
        merger.connect(pulseGain);
        if (ctx.destination.channelCount >= 2) {
          ctx.destination.channelInterpretation = 'speakers';
        }

        const leftOsc  = ctx.createOscillator();
        leftOsc.type            = config.carrierType ?? 'sine';
        leftOsc.frequency.value = config.base;
        leftOsc.connect(merger, 0, 0);

        const rightOsc = ctx.createOscillator();
        rightOsc.type            = config.carrierType ?? 'sine';
        rightOsc.frequency.value = config.base + config.beat;
        rightOsc.connect(merger, 0, 1);

        leftOsc.start(ctx.currentTime + 0.05);
        rightOsc.start(ctx.currentTime + 0.05);
        n.stoppers.push(
          () => { try { leftOsc.stop();  } catch (_) {} },
          () => { try { rightOsc.stop(); } catch (_) {} }
        );
      }

      // ---- Ambient layers ----
      // KEY FIX: ambientGain connects directly to masterGain with a simple
      // stable value. Each layer handles its own fade-in internally.
      if (config.ambientLayers?.length) {
        const ambientGain = ctx.createGain();
        ambientGain.gain.setValueAtTime(0.5, ctx.currentTime); // stable, no conflict
        ambientGain.connect(masterGain);

        const layerMap: Record<
          string,
          (c: globalThis.AudioContext, d: AudioNode) => () => void
        > = {
          rain:  setupRain,
          ocean: setupOcean,
          wind:  setupWind,
          pink:  setupPinkNoise,
          brown: setupBrownNoise,
        };

        for (const layer of config.ambientLayers) {
          const fn = layerMap[layer];
          if (fn) n.stoppers.push(fn(ctx, ambientGain));
        }
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
    if (!n.masterGain || !ctx) return;
    const target = (0.3 + armPos * 0.7) * globalVolumeRef.current * masterVolumeRef.current * 0.5;
    n.masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.1);
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
        setGlobalVolume, updateArmPos,
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
