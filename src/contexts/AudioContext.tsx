import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

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
  needsInteraction: boolean;
  resolveInteraction: () => void;
  
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
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-9), msg]);
  const [masterVolume, setMasterVolume] = useState(1);
  const [tracks, setTracks] = useState<AudioState>({ space_ambient: { isPlaying: true, volume: 0.5 } });

  // -- 2. Centralized Audio Engine State --
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [volume, setVolumeState] = useState(1.0);
  const volumeRef = useRef(1.0);
  const configRef = useRef<AudioConfig>({ base: 110, beat: 6.3, pulse: 0.1 });

  // -- Refs for Audio Elements & Web Audio Nodes --
  const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});
  
  const acRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);
  const synthNodesRef = useRef<{
    binL?: OscillatorNode;
    binR?: OscillatorNode;
    pulseLfo?: OscillatorNode;
    pinkSource?: AudioBufferSourceNode;
  }>({});
  const activeAmbientsRef = useRef<HTMLAudioElement[]>([]);

  // Helper to safely resolve absolute URLs inside sandboxed iframes where window.location.origin is 'null'
  const getAbsoluteUrl = (path: string) => {
    if (typeof window === 'undefined') return path;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    
    const baseHref = window.location.href.split('?')[0].split('#')[0];
    const absoluteOrigin = window.location.origin !== 'null' ? window.location.origin : (baseHref.endsWith('/') ? baseHref.slice(0, -1) : baseHref);
    
    try {
      const urlObj = new URL(path, absoluteOrigin);
      return urlObj.toString();
    } catch (e) {
      return path;
    }
  };

  // Function to lazily retrieve or initialize an HTMLAudioElement
  const getOrCreateAudio = (src: string) => {
    if (!src) return null;
    let audio = audioMapRef.current[src];
    if (!audio) {
      console.log('[Central Audio Engine] msg');
      const absoluteUrl = getAbsoluteUrl(src);
      audio = new Audio(absoluteUrl);
      audio.loop = true;
      audio.preload = 'auto';
      
      // Append silently to DOM so mobile Safari/Chrome allows playing it
      audio.style.position = 'fixed';
      audio.style.top = '0';
      audio.style.left = '0';
      audio.style.width = '1px';
      audio.style.height = '1px';
      audio.style.opacity = '0.01';
      audio.style.pointerEvents = 'none';
      if (typeof document !== 'undefined' && document.body) {
        document.body.appendChild(audio);
      }
      
      audio.addEventListener('error', (e) => {
        console.warn('[Central Audio Engine] Warn');
      });
      
      audioMapRef.current[src] = audio;
    }
    return audioMapRef.current[src];
  };

  
  const safePlay = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          const mediaErrorCode = audio.error ? audio.error.code : 'None';
          const mediaErrorMessage = audio.error ? audio.error.message : 'None';
          
          console.warn(
            `[Central Audio Engine] Play Error Info:\n` +
            `- Error Name: ${err.name}\n` +
            `- Error Message: ${err.message}\n` +
            `- HTMLMediaElement Code: ${mediaErrorCode}\n` +
            `- HTMLMediaElement Message: ${mediaErrorMessage}\n` +
            `- Source URL: ${audio.src}`
          );
          
          // Send log payload to the server's audio log endpoint for inspection
          const logPayload = {
            type: 'play_error',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            href: typeof window !== 'undefined' ? window.location.href : 'Unknown',
            origin: typeof window !== 'undefined' ? window.location.origin : 'Unknown',
            audioSrc: audio.src,
            errorName: err.name,
            errorMessage: err.message,
            mediaErrorCode,
            mediaErrorMessage,
            timestamp: new Date().toISOString()
          };

          fetch('/api/audio-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(logPayload)
          }).catch(() => {});

          // Diagnostic network check
          if (audio.src && (audio.src.startsWith('http') || audio.src.startsWith('/'))) {
            fetch(audio.src)
              .then(res => {
                const contentType = res.headers.get('content-type') || '';
                const contentLength = res.headers.get('content-length') || '';
                
                // Log detailed network response info back to the server as well
                fetch('/api/audio-log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'network_diagnostic',
                    audioSrc: audio.src,
                    status: res.status,
                    ok: res.ok,
                    contentType,
                    contentLength,
                    timestamp: new Date().toISOString()
                  })
                }).catch(() => {});

                if (!res.ok) {
                  console.error(`[Central Audio Engine] DIAGNOSTIC: File fetch failed with status: ${res.status}. The audio file is missing or unreachable.`);
                } else {
                  if (contentType.includes('text/html')) {
                    console.error(`[Central Audio Engine] DIAGNOSTIC: Path returned HTML instead of audio (likely 404 fallback). The file is missing or misplaced on the server!`);
                  } else {
                    console.log(`[Central Audio Engine] DIAGNOSTIC: File is found on server and serves content: ${contentType}. The play failure is likely due to browser autoplay/sandbox rules.`);
                  }
                }
              })
              .catch(fetchErr => {
                console.error(`[Central Audio Engine] DIAGNOSTIC: Failed to verify file via network:`, fetchErr);
                fetch('/api/audio-log', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'network_diagnostic_error',
                    audioSrc: audio.src,
                    error: fetchErr.message || String(fetchErr),
                    timestamp: new Date().toISOString()
                  })
                }).catch(() => {});
              });
          }

          if (err.name === 'NotAllowedError') {
            setNeedsInteraction(true);
          }
        });
      }
    } catch(err: any) {
      console.warn('[Central Audio Engine] play() exception:', err);
    }
  };
  

  const safePause = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
       audio.pause();
    } catch(err) {}
  };

  // Sync volume of legacy tracks
  useEffect(() => {
    AVAILABLE_TRACKS.forEach(track => {
      const audio = audioMapRef.current[track.url];
      const state = tracks[track.id];
      if (audio && state) {
        audio.volume = Math.max(0, Math.min(1, state.volume * masterVolume));
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

    setTracks(prevTracks => {
      const isCurrentlyPlaying = prevTracks[id]?.isPlaying ?? false;
      const currentVolume = prevTracks[id]?.volume ?? 0.5;
      const nextPlaying = !isCurrentlyPlaying;
      
      const newState = { ...prevTracks, [id]: { isPlaying: nextPlaying, volume: currentVolume } };

      setMasterPlaying(prevMaster => {
        // If we are enabling a track and master was off, turn master on
        const nextMaster = nextPlaying ? true : prevMaster;

        AVAILABLE_TRACKS.forEach(track => {
          const tState = newState[track.id];
          if (nextMaster && tState?.isPlaying) {
            const audio = getOrCreateAudio(track.url);
            safePlay(audio);
          } else {
            const audio = audioMapRef.current[track.url];
            safePause(audio);
          }
        });

        return nextMaster;
      });
      
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
        audio.pause();
      } catch (e) {}
    });

    activeAmbientsRef.current = [];
  }, []);

  const resolveInteraction = () => {
    setNeedsInteraction(false);
    activeAmbientsRef.current.forEach(audio => safePlay(audio));
  };

  const startAudio = useCallback((config: AudioConfig) => {
    console.log('[Central Audio Engine] msg');
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
        

        if (!isPlayingRef.current) return;
        try {
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

              console.log('[Central Audio Engine] msg');
            } catch(synthErr) {
              console.warn('[Central Audio Engine] Warn');
            }
          }

          // B. Play Ambient Sound MP3 Loops
          if (config.ambientLayers && config.ambientLayers.length > 0) {
            config.ambientLayers.forEach(path => {
              if (!path) return;
              
              let audio = getOrCreateAudio(path);

              if (audio) {
                console.log('[Central Audio Engine] msg');
                try {
                  const maxVol = config.disableSynth ? 1.0 : (path.includes('cat') ? 0.8 : 0.4);
                  audio.volume = Math.max(0, Math.min(1, maxVol * volumeRef.current));
                  audio.pause(); audio.currentTime = 0; safePlay(audio);
                  activeAmbientsRef.current.push(audio);
                } catch (playErr) {
                  console.error(`[Central Audio Engine] Error launching track play for ${path}:`, playErr);
                }
              }
            });
          }
        } catch(err) {
           console.error('[Central Audio Engine] Async start error:', err);
        }
      }
    } catch(err) {
      console.error('[Central Audio Engine] Start failed:', err);
    }
  }, [stopAudioNoDelay]);

  const stopAudio = useCallback(() => {
    if (!isPlayingRef.current) return;
    console.log('[Central Audio Engine] msg');

    // 1. Web Audio synthesis node fade-out
    if (acRef.current && masterGainRef.current) {
      try {
        const ac = acRef.current;
        masterGainRef.current.gain.cancelScheduledValues(ac.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ac.currentTime);
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.45);
      } catch(e) {}
    }

    
    // 2. HTMLAudio elements fade-out
    activeAmbientsRef.current.forEach(audio => {
      try {
        let vol = audio.volume;
        const targetVol = vol;
        const interval = setInterval(() => {
          vol -= targetVol / 10;
          if (vol <= 0) {
            audio.volume = 0;
            audio.pause();
            clearInterval(interval);
          } else {
            audio.volume = Math.max(0, Math.min(1, vol));
          }
        }, 50);
      } catch(e) {}
    });

    // 3. Complete stop trigger

    setTimeout(() => {
      stopAudioNoDelay();
    }, 500);
  }, [stopAudioNoDelay]);

  const setGlobalVolume = useCallback((v: number) => {
    console.log('[Central Audio Engine] msg');
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
        
        const src = audio.src || '';
        const maxVol = (configRef.current && configRef.current.disableSynth) ? 1.0 : (src.includes('cat') ? 0.8 : 0.4);
        audio.volume = Math.max(0, Math.min(1, v * maxVol));

      } catch(e) {}
    });
  }, []);

  const updateArmPos = useCallback((armPos: number) => {
    if (!isPlayingRef.current || !acRef.current || !oceanGainRef.current) return;
    try {
      const target = 0.1 + armPos * 0.3;
      oceanGainRef.current.gain.setTargetAtTime(target, acRef.current.currentTime, 0.05);
    } catch(e) {}
  }, []);

  // Cleanup on final component unmount
  useEffect(() => {
    return () => {
      stopAudioNoDelay();
      // Unmount all lazily allocated audio elements
      Object.values(audioMapRef.current).forEach(audio => {
        try {
          audio.pause(); audio.src = '';
          if (audio.parentNode) {
            audio.parentNode.removeChild(audio);
          }
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
      needsInteraction, resolveInteraction, isPlaying, volume, startAudio, stopAudio, setGlobalVolume, updateArmPos
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
