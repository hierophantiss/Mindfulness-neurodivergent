import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { getAudioContext } from '../lib/sound';
import type { AmbientLayer, AudioConfig } from '../data/types-breath';
export type { AmbientLayer, AudioConfig };
export { BREATH_WAVE_SECONDS } from '../data/types-breath';

// The background sounds load on first use (they are a large piece).
type Layers = typeof import('../lib/ambientSynth').AMBIENT_LAYERS;
let layers: Layers | null = null;
let layersLoading: Promise<Layers> | null = null;
export function loadAmbientLayers(): Promise<Layers> {
  if (layers) return Promise.resolve(layers);
  layersLoading ??= import('../lib/ambientSynth').then((m) => (layers = m.AMBIENT_LAYERS));
  layersLoading.catch(() => { layersLoading = null; });
  return layersLoading;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The sounds that can play under (or instead of) a tone. */
export interface AudioContextProps {
  masterVolume: number;
  setMasterVolume: (vol: number) => void;
  isPlaying: boolean;
  volume: number;
  startAudio: (config: AudioConfig) => void;
  stopAudio: () => void;
  /** Lowers the sound to silence over `seconds`, then stops it (the end of a sleep timer). */
  fadeOutAudio: (seconds: number) => void;
  setGlobalVolume: (v: number) => void;
  updateArmPos: (armPos: number) => void;
  updatePhase: (idx: number, label: string) => void;
  /** Changes one layer's level while it plays, without starting it again. */
  setLayerLevel: (layer: AmbientLayer, level: number) => void;
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
  /** Each playing layer's own gain (see setLayerLevel). */
  layerGains?: Map<AmbientLayer, GainNode>;
  stoppers: Array<() => void>;
  sessionId: number;
}


// ---------------------------------------------------------------------------
// Context & Provider
// ---------------------------------------------------------------------------

const AudioCtx = createContext<AudioContextProps | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
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

  const setLayerLevel = useCallback((layer: AmbientLayer, level: number) => {
    const g = nodesRef.current.layerGains?.get(layer);
    const ctx = webAudioCtxRef.current;
    if (g && ctx) g.gain.setTargetAtTime(Math.max(0, Math.min(1, level)), ctx.currentTime, 0.08);
  }, []);

  // ---- AudioContext init ----
  const getCtx = (): globalThis.AudioContext => {
    // The app's one audio engine, shared with the bells (lib/sound.ts).
    if (!webAudioCtxRef.current) webAudioCtxRef.current = getAudioContext();
    else if (webAudioCtxRef.current.state === 'suspended') webAudioCtxRef.current.resume().catch(() => {});
    if (!webAudioCtxRef.current) throw new Error('Web Audio is not available');
    return webAudioCtxRef.current;
  };

  // ---- Hard-stop all nodes ----
  const hardStop = useCallback(() => {
    const n = nodesRef.current;
    n.stoppers.forEach(s => s());
    n.stoppers    = [];
    n.layerGains  = undefined;
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

        // Each layer through its own gain, so a mix can set and change them one by one.
        n.layerGains = new Map();
        const gains = n.layerGains;
        const wanted: Array<[AmbientLayer, GainNode]> = [];
        for (const layer of config.ambientLayers) {
          const lg = ctx.createGain();
          lg.gain.value = Math.max(0, Math.min(1, config.layerLevels?.[layer] ?? 1));
          lg.connect(ambientGain);
          gains.set(layer, lg);
          wanted.push([layer, lg]);
        }
        // Started now if the sounds are loaded, otherwise as soon as they are,
        // unless this session has been stopped or replaced meanwhile.
        const attach = (all: Layers) => {
          for (const [layer, lg] of wanted) {
            const fn = all[layer];
            if (fn && n.layerGains === gains) n.stoppers.push(fn(ctx, lg));
          }
        };
        if (layers) attach(layers);
        else loadAmbientLayers().then(attach).catch(() => {});
      }

      // ---- Vocal Humming Guide Tone ----
      if (['bhramari-humming', 'aum-resonance', 'satanama-resonance', 'a-major-resonance', 'c-major-resonance', 'throat-chakra-humming', 'om-pure-resonance', 'om-resonance-throat'].includes(config.id ?? '')) {
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

  // ---- fadeOutAudio ----
  const fadeOutAudio = useCallback((seconds: number) => {
    setIsPlaying(false);

    const n       = nodesRef.current;
    const ctx     = webAudioCtxRef.current;
    const session = n.sessionId;
    if (!n.masterGain || !ctx) { hardStop(); return; }

    const g = n.masterGain.gain;
    g.cancelScheduledValues(ctx.currentTime);
    g.setValueAtTime(g.value, ctx.currentTime);
    g.linearRampToValueAtTime(0, ctx.currentTime + seconds);
    setTimeout(() => {
      if (nodesRef.current.sessionId !== session) return;
      hardStop();
    }, seconds * 1000 + 200);
  }, [hardStop]);


  // ---- Cleanup on unmount ----
  React.useEffect(() => {
    return () => {
      hardStop();
    };
  }, [hardStop]);

  return (
    <AudioCtx.Provider
      value={{
        masterVolume, setMasterVolume,
        isPlaying, volume, startAudio, stopAudio, fadeOutAudio,
        setGlobalVolume, updateArmPos, updatePhase, setLayerLevel,
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
