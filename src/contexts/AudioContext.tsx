import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { Howl } from 'howler';
import { getSharedAudioContext } from '../lib/audioManager';

export interface SoundTrack {
  id: string;
  url: string;
  labelEN: string;
  labelEL: string;
  icon: string;
}

export const AVAILABLE_TRACKS: SoundTrack[] = [
  {
    "id": "rain",
    "url": "/music/binaural-beats-25-hz-delta-with-rain-.mp3",
    "labelEN": "Rain & Delta",
    "labelEL": "Βροχή & Κύματα Δέλτα",
    "icon": "CloudRain"
  },
  {
    "id": "zen",
    "url": "/music/atlasaudio-calming-zen-519422.mp3",
    "labelEN": "Calming Zen",
    "labelEL": "Ηρεμία Zen",
    "icon": "Flower2"
  },
  {
    "id": "sleep",
    "url": "/music/meditativetiger-sleep-music-963-hz-binaural-immersive-audio-426673.mp3",
    "labelEN": "Deep Sleep",
    "labelEL": "Βαθύς Ύπνος",
    "icon": "Moon"
  },
  {
    "id": "space_ambient",
    "url": "/music/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3",
    "labelEN": "Space Atmosphere",
    "labelEL": "Διαστημική Ατμόσφαιρα",
    "icon": "Sparkles"
  },
  {
    "id": "cat",
    "url": "/music/cat-purring-.mp3",
    "labelEN": "Cat Purring",
    "labelEL": "Γουργουρητό Γάτας",
    "icon": "Heart"
  },
  {
    "id": "pure",
    "url": "/music/purebinaural-purebinaural-20-hz-beta-isochronic-tones-pure-tone-496540.mp3",
    "labelEN": "Pure Focus",
    "labelEL": "Καθαρή Εστίαση",
    "icon": "Brain"
  },
  {
    "id": "space",
    "url": "/music/space.mp3",
    "labelEN": "Space Ambient",
    "labelEL": "Διάστημα",
    "icon": "Stars"
  }
];

// Helper to list every single potential sleep MP3 file used in Sanctuary/Dashboard/Practice
const ALL_AUDIO_PATHS = [
  '/music/binaural-beats-25-hz-delta-with-rain-.mp3',
  '/music/atlasaudio-calming-zen-519422.mp3',
  '/music/meditativetiger-sleep-music-963-hz-binaural-immersive-audio-426673.mp3',
  '/music/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3',
  '/music/cat-purring-.mp3',
  '/music/freesound_community-cat-purring-74746.mp3',
  '/music/purebinaural-purebinaural-20-hz-beta-isochronic-tones-pure-tone-496540.mp3',
  '/music/space.mp3',
  '/music/space-ambient.mp3'
];

export interface AudioConfig {
  base: number;
  beat: number;
  pulse: number;
  ambientLayers?: string[];
  disableSynth?: boolean;
}

interface AudioState {
  [trackId: string]: {
    isPlaying: boolean;
    volume: number;
  }
}

interface AudioContextProps {
  // Legacy Track State & Master Control (For navigation menu / ambient player tab)
  masterPlaying: boolean;
  masterVolume: number;
  tracks: AudioState;
  toggleMaster: () => void;
  setMasterVolume: (v: number) => void;
  toggleTrack: (trackId: string) => void;
  setTrackVolume: (trackId: string, v: number) => void;

  // New Centralized Audio Engine parameters
  isPlaying: boolean;
  volume: number;
  startAudio: (config: AudioConfig) => void;
  stopAudio: () => void;
  setGlobalVolume: (v: number) => void;
  updateArmPos: (armPos: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

// Synthesizer Helper: Pink Noise Generator
function makePinkNoise(ac: AudioContext) {
  const bufferSize = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const output = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11; // Compensate for gain
    b6 = white * 0.115926;
  }
  return buffer;
}

export function AudioProvider({ children }: { children: ReactNode }) {
  // -- 1. Legacy Music/Mixer State --
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1);
  const [tracks, setTracks] = useState<AudioState>({ space_ambient: { isPlaying: true, volume: 0.5 } });

  // -- 2. Centralized Audio Engine State --
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [volume, setVolumeState] = useState(1.0);
  const volumeRef = useRef(1.0);
  const configRef = useRef<AudioConfig>({ base: 110, beat: 6.3, pulse: 0.1 });

  // -- Refs for Audio Elements & Web Audio Nodes --
  const audioMapRef = useRef<Record<string, Howl>>({});
  
  const acRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);
  const synthNodesRef = useRef<{
    binL?: OscillatorNode;
    binR?: OscillatorNode;
    pulseLfo?: OscillatorNode;
    pinkSource?: AudioBufferSourceNode;
  }>({});
  const activeAmbientsRef = useRef<Howl[]>([]);

  // Helper to safely resolve absolute URLs inside sandboxed iframes where window.location.origin is 'null'
  const getAbsoluteUrl = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    let origin = '';
    try {
      if (window.location.origin && window.location.origin !== 'null') {
        origin = window.location.origin;
      } else {
        const url = new URL(window.location.href);
        if (url.protocol.startsWith('http')) {
          origin = url.protocol + '//' + url.host;
        }
      }
    } catch (e) {
      console.warn('[Central Audio Engine] Safe origin resolution failed, using relative:', e);
    }

    if (origin) {
      const sep = src.startsWith('/') ? '' : '/';
      return `${origin}${sep}${src}`;
    }
    return src;
  };

  // Function to lazily retrieve or initialize an HTMLAudioElement
  const getOrCreateAudio = (src: string) => {
    if (!src) return null;
    let audio = audioMapRef.current[src];
    if (!audio) {
      console.log(`[Central Audio Engine] Creating lazy Howl for: ${src}`);
      const cacheBustedSrc = src.includes('?') ? src + '&v=2' : src + '?v=2';
      audio = new Howl({
        src: [cacheBustedSrc],
        loop: true,
        html5: false,
        onloaderror: (id, err) => console.warn(`[Central Audio Engine] Howl load error:`, err),
        onplayerror: (id, err) => console.warn(`[Central Audio Engine] Howl play error:`, err)
      });
      audioMapRef.current[src] = audio;
    }
    return audioMapRef.current[src];
  };

  const safePlay = (audio: Howl | null) => {
    if (!audio) return;
    if (!audio.playing()) {
      audio.play();
    }
  };

  const safePause = (audio: Howl | null) => {
    if (!audio) return;
    audio.pause();
  };

  // Sync volume of legacy tracks
  useEffect(() => {
    AVAILABLE_TRACKS.forEach(track => {
      const audio = audioMapRef.current[track.url];
      const state = tracks[track.id];
      if (audio && state) {
        audio.volume(state.volume * masterVolume);
      }
    });
  }, [masterVolume, tracks]);

  // Handle Legacy master play/pause
  const toggleMaster = () => {
    const ac = getSharedAudioContext();
    if (ac && ac.state === 'suspended') {
      ac.resume().catch(console.warn);
    }
    
    // Stop any playing central engine sound first to prevent overlap!
    stopAudioNoDelay();

    setMasterPlaying(prev => {
      const nextPlaying = !prev;
      AVAILABLE_TRACKS.forEach(track => {
        const trackState = tracks[track.id];
        if (nextPlaying && trackState?.isPlaying) {
          const audio = getOrCreateAudio(track.url);
          safePlay(audio);
        } else {
          const audio = audioMapRef.current[track.url];
          safePause(audio);
        }
      });
      return nextPlaying;
    });
  };

  // Handle Legacy track play/pause
  const toggleTrack = (id: string) => {
    const ac = getSharedAudioContext();
    if (ac && ac.state === 'suspended') {
      ac.resume().catch(console.warn);
    }

    // Stop any playing central engine sound first to prevent overlap!
    stopAudioNoDelay();

    setTracks(prev => {
      const isCurrentlyPlaying = prev[id]?.isPlaying ?? false;
      const currentVolume = prev[id]?.volume ?? 0.5;
      const nextPlaying = !isCurrentlyPlaying;
      
      const trackDef = AVAILABLE_TRACKS.find(t => t.id === id);
      if (trackDef) {
        if (nextPlaying && masterPlaying) {
          const audio = getOrCreateAudio(trackDef.url);
          safePlay(audio);
        } else {
          const audio = audioMapRef.current[trackDef.url];
          safePause(audio);
        }
      }

      const newState = { ...prev, [id]: { isPlaying: nextPlaying, volume: currentVolume } };

      // Automatically enable master switch if disabled
      if (nextPlaying && !masterPlaying) {
        setMasterPlaying(true);
        AVAILABLE_TRACKS.forEach(track => {
          const tState = newState[track.id];
          if (tState?.isPlaying) {
            const audio = getOrCreateAudio(track.url);
            safePlay(audio);
          }
        });
      }
      
      return newState;
    });
  };

  const setTrackVolume = (id: string, v: number) => {
    setTracks(prev => ({
      ...prev,
      [id]: { isPlaying: prev[id]?.isPlaying ?? false, volume: v }
    }));
  };

  // -- 3. Centralized Audio Engine Implementation --
  
  const stopAudioNoDelay = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);

    // Stop and clear synthesis oscillators
    try { synthNodesRef.current.binL?.stop(); } catch (e) {}
    try { synthNodesRef.current.binR?.stop(); } catch (e) {}
    try { synthNodesRef.current.pulseLfo?.stop(); } catch (e) {}
    try { synthNodesRef.current.pinkSource?.stop(); } catch (e) {}

    try { synthNodesRef.current.binL?.disconnect(); } catch (e) {}
    try { synthNodesRef.current.binR?.disconnect(); } catch (e) {}
    try { synthNodesRef.current.pulseLfo?.disconnect(); } catch (e) {}
    try { synthNodesRef.current.pinkSource?.disconnect(); } catch (e) {}
    synthNodesRef.current = {};

    if (masterGainRef.current) {
      try { masterGainRef.current.disconnect(); } catch (e) {}
    }
    masterGainRef.current = null;
    oceanGainRef.current = null;

    // Pause all playing ambient sleep layers
    activeAmbientsRef.current.forEach(audio => {
      try {
        audio.stop();
      } catch (e) {}
    });
    activeAmbientsRef.current = [];
  }, []);

  const startAudio = useCallback((config: AudioConfig) => {
    console.log('[Central Audio Engine] Starting setup with config:', config);
    // 1. Clean up any existing playing sound source to prevent overlap
    stopAudioNoDelay();

    // 2. Pause any legacy mixer tracks to keep audio clean and coordinated
    AVAILABLE_TRACKS.forEach(track => {
      const audio = audioMapRef.current[track.url];
      if (audio && typeof audio.pause === 'function') {
        try { audio.pause(); } catch(e) {}
      }
    });
    setMasterPlaying(false);

    configRef.current = config;
    isPlayingRef.current = true;
    setIsPlaying(true);

    try {
      const ac = getSharedAudioContext();
      acRef.current = ac;

      if (ac) {
        if (ac.state === 'suspended') {
          ac.resume().catch(console.warn);
        }

        const master = ac.createGain();
        const initialVol = config.disableSynth ? volumeRef.current : volumeRef.current * 0.4;
        master.gain.setValueAtTime(initialVol, ac.currentTime);
        master.connect(ac.destination);
        masterGainRef.current = master;

        // A. Synth Generation (if desired by the config)
        if (!config.disableSynth) {
          try {
            // Noise generator
            const pinkBuffer = makePinkNoise(ac);
            const pinkSource = ac.createBufferSource();
            pinkSource.buffer = pinkBuffer;
            pinkSource.loop = true;
            const pinkGain = ac.createGain();
            pinkGain.gain.setValueAtTime(0.03, ac.currentTime);
            pinkSource.connect(pinkGain).connect(master);
            pinkSource.start();
            synthNodesRef.current.pinkSource = pinkSource;

            // Amplitude Modulation (Ocean breathing waves)
            const amNode = ac.createGain();
            amNode.gain.setValueAtTime(1.0, ac.currentTime);
            amNode.connect(master);
            oceanGainRef.current = amNode;

            // Breathing Modulator
            const pulseLfo = ac.createOscillator();
            pulseLfo.type = 'sine';
            pulseLfo.frequency.setValueAtTime(config.pulse || 0.1, ac.currentTime);
            const pulseDepth = ac.createGain();
            pulseDepth.gain.setValueAtTime(0.15, ac.currentTime);
            pulseLfo.connect(pulseDepth).connect(amNode.gain);
            pulseLfo.start();
            synthNodesRef.current.pulseLfo = pulseLfo;

            // Binaural Beat Split
            const binauralNode = ac.createGain();
            binauralNode.connect(amNode);

            // Left Split (Base Freq)
            const binL = ac.createOscillator();
            binL.type = 'sine';
            binL.frequency.setValueAtTime(config.base, ac.currentTime);
            const gL = ac.createGain();
            gL.gain.setValueAtTime(0.25, ac.currentTime);
            let pL;
            try {
              pL = ac.createStereoPanner();
              pL.pan.setValueAtTime(-1, ac.currentTime);
            } catch (e) {
              pL = ac.createPanner();
              pL.panningModel = 'equalpower';
              pL.setPosition(-1, 0, 0);
            }
            binL.connect(gL).connect(pL).connect(binauralNode);
            binL.start();
            synthNodesRef.current.binL = binL;

            // Right Split (Base + Beat Freq)
            const binR = ac.createOscillator();
            binR.type = 'sine';
            binR.frequency.setValueAtTime(config.base + config.beat, ac.currentTime);
            const gR = ac.createGain();
            gR.gain.setValueAtTime(0.25, ac.currentTime);
            let pR;
            try {
              pR = ac.createStereoPanner();
              pR.pan.setValueAtTime(1, ac.currentTime);
            } catch (e) {
              pR = ac.createPanner();
              pR.panningModel = 'equalpower';
              pR.setPosition(1, 0, 0);
            }
            binR.connect(gR).connect(pR).connect(binauralNode);
            binR.start();
            synthNodesRef.current.binR = binR;

            console.log('[Central Audio Engine] Centralized Binaural beats synthesized successfully.');
          } catch(synthErr) {
            console.warn('[Central Audio Engine] Synthesis failed:', synthErr);
          }
        }

        // B. Play Ambient Sound MP3 Loops
        if (config.ambientLayers && config.ambientLayers.length > 0) {
          config.ambientLayers.forEach(path => {
            if (!path) return;
            // simple fallback if audioMapRef doesn't have it allocated yet
            let audio = audioMapRef.current[path];
            if (!audio) {
              audio = new Howl({
                src: [path],
                html5: true,
                loop: true,
                preload: true,
                volume: 0 
              });
              audioMapRef.current[path] = audio;
            }
            if (audio) {
              console.log(`[Central Audio Engine] Playing sleep loop: ${path}`);
              try {
                const maxVol = config.disableSynth ? 1.0 : (path.includes('cat') ? 0.8 : 0.4);
                audio.volume(maxVol * volumeRef.current);
                
                audio.stop(); // Howl's stop also resets the seek position
                audio.play();
                
                activeAmbientsRef.current.push(audio);
              } catch (playErr) {
                console.error(`[Central Audio Engine] Error launching track play for ${path}:`, playErr);
              }
            }
          });
        }
      }
    } catch(err) {
      console.error('[Central Audio Engine] Start failed:', err);
    }
  }, [stopAudioNoDelay]);

  const stopAudio = useCallback(() => {
    if (!isPlayingRef.current) return;
    console.log('[Central Audio Engine] Initiating fade-out sequence...');

    // 1. Web Audio synthesis node fade-out
    if (acRef.current && masterGainRef.current) {
      try {
        const ac = acRef.current;
        masterGainRef.current.gain.cancelScheduledValues(ac.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ac.currentTime);
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.45);
      } catch(e) {}
    }

    // 2. Howler elements fade-out
    activeAmbientsRef.current.forEach(audio => {
      try {
        const curVol = audio.volume() as number;
        audio.fade(curVol, 0, 500);
        setTimeout(() => audio.stop(), 500);
      } catch(e) {}
    });

    // 3. Complete stop trigger
    setTimeout(() => {
      stopAudioNoDelay();
    }, 500);
  }, [stopAudioNoDelay]);

  const setGlobalVolume = useCallback((v: number) => {
    console.log('[Central Audio Engine] Syncing global volume:', v);
    volumeRef.current = v;
    setVolumeState(v);

    const ac = acRef.current;
    if (ac && masterGainRef.current && isPlayingRef.current && configRef.current) {
      try {
        masterGainRef.current.gain.cancelScheduledValues(ac.currentTime);
        const targetVol = configRef.current.disableSynth ? v : v * 0.4;
        masterGainRef.current.gain.setTargetAtTime(targetVol, ac.currentTime, 0.1);
      } catch(e) {}
    }

    // Adjust volume of active loops
    activeAmbientsRef.current.forEach(audio => {
      try {
        const src = (audio as any)._src?.[0] || '';
        const maxVol = (configRef.current && configRef.current.disableSynth) ? 1.0 : (src.includes('cat') ? 0.8 : 0.4);
        audio.volume(v * maxVol);
      } catch(e) {}
    });
  }, []);

  const updateArmPos = useCallback((armPos: number) => {
    if (!isPlayingRef.current || !acRef.current || !oceanGainRef.current) return;
    try {
      const target = 0.1 + armPos * 0.3;
      oceanGainRef.current.gain.value = target;
    } catch(e) {}
  }, []);

  // Cleanup on final component unmount
  useEffect(() => {
    return () => {
      stopAudioNoDelay();
      // Unmount all lazily allocated audio elements
      Object.values(audioMapRef.current).forEach(audio => {
        try {
          audio.unload();
        } catch (e) {}
      });
      audioMapRef.current = {};
    };
  }, []);

  return (
    <AudioContext.Provider value={{
      // Legacy states & triggers
      masterPlaying, masterVolume, tracks,
      toggleMaster, setMasterVolume, toggleTrack, setTrackVolume,

      // Centralized Engine triggers
      isPlaying, volume, startAudio, stopAudio, setGlobalVolume, updateArmPos
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioMixer() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudioMixer must be used within AudioProvider');
  return ctx;
}
