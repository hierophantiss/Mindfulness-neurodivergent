import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';

export interface AudioConfig {
  base: number;
  beat: number;
  pulse?: number;
  carrierType?: 'sine' | 'triangle';
  pulseType?: 'sine';
  disableSynth?: boolean;
  ambientLayers?: string[];
}

export interface SoundTrack {
  id: string;
  url: string;
  labelEN: string;
  labelEL: string;
  icon: string;
}

export const AVAILABLE_TRACKS: SoundTrack[] = [
  { id: "rain", url: "/music/binaural-beats-25-hz-delta-with-rain-.mp3", labelEN: "Rain & Delta", labelEL: "Βροχή & Κύματα Δέλτα", icon: "CloudRain" },
  { id: "zen", url: "/music/atlasaudio-calming-zen-519422.mp3", labelEN: "Calming Zen", labelEL: "Ηρεμία Zen", icon: "Flower2" },
  { id: "sleep", url: "/music/meditativetiger-sleep-music-963-hz-binaural-immersive-audio-426673.mp3", labelEN: "Deep Sleep", labelEL: "Βαθύς Ύπνος", icon: "Moon" },
  { id: "space_ambient", url: "/music/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3", labelEN: "Space Atmosphere", labelEL: "Διαστημική Ατμόσφαιρα", icon: "Sparkles" },
  { id: "cat", url: "/music/cat-purring-.mp3", labelEN: "Cat Purring", labelEL: "Γουργουρητό Γάτας", icon: "Heart" },
  { id: "pure", url: "/music/purebinaural-purebinaural-20-hz-beta-isochronic-tones-pure-tone-496540.mp3", labelEN: "Pure Focus", labelEL: "Καθαρή Εστίαση", icon: "Brain" },
  { id: "space", url: "/music/space.mp3", labelEN: "Space Ambient", labelEL: "Διάστημα", icon: "Stars" }
];

export interface TrackState {
  isPlaying: boolean;
  volume: number;
}

export interface AudioContextProps {
  masterPlaying: boolean;
  masterVolume: number;
  tracks: { [trackId: string]: TrackState };
  toggleMaster: () => void;
  setMasterVolume: (vol: number) => void;
  toggleTrack: (trackId: string) => void;
  setTrackVolume: (trackId: string, vol: number) => void;
  stopAll: () => void;
  needsInteraction: boolean;
  resolveInteraction: () => void;

  isPlaying: boolean;
  volume: number;
  startAudio: (config: AudioConfig) => void;
  stopAudio: () => void;
  setGlobalVolume: (v: number) => void;
  updateArmPos: (armPos: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [tracks, setTracks] = useState<{ [trackId: string]: TrackState }>({});
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1.0); // Global Volume

  const audioRefs = useRef<{ [trackId: string]: HTMLAudioElement }>({});
  
  // Ambient layers that are ad-hoc requested via config
  const customAmbientsRef = useRef<HTMLAudioElement[]>([]);
  
  // Binaural Synth refs
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null);
  const synthNodesRef = useRef<{
    leftOsc?: OscillatorNode;
    rightOsc?: OscillatorNode;
    masterGain?: GainNode;
    pulseGain?: GainNode;
  }>({});

  // Keeps predefined UI tracks in sync
  useEffect(() => {
    Object.keys(tracks).forEach(trackId => {
      const audio = audioRefs.current[trackId];
      if (!audio) return;
      const trackConf = tracks[trackId];
      const shouldPlay = trackConf.isPlaying && masterPlaying;
      audio.volume = shouldPlay ? trackConf.volume * masterVolume : 0;
      
      if (shouldPlay && audio.paused) {
        audio.play().catch(e => console.warn("Track play error:", e));
      } else if (!shouldPlay && !audio.paused) {
        audio.pause();
      }
    });
  }, [tracks, masterPlaying, masterVolume]);

  const initSynth = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const startAudio = useCallback((config: AudioConfig) => {
    console.log('[Audio Engine] Session audio starting...', config);
    setIsPlaying(true);
    setMasterPlaying(true);

    // Stop active ad-hoc ambient audio
    customAmbientsRef.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    customAmbientsRef.current = [];

    // Stop any existing synth before starting a new one
    if (synthNodesRef.current.leftOsc) {
      try { synthNodesRef.current.leftOsc.stop(); } catch(e){}
    }
    if (synthNodesRef.current.rightOsc) {
      try { synthNodesRef.current.rightOsc.stop(); } catch(e){}
    }

    // Attempt to map config layers into predefined tracks, otherwise create temporary audio instance
    const newTracks = { ...tracks };
    if (config.ambientLayers && config.ambientLayers.length > 0) {
      config.ambientLayers.forEach(layerUrl => {
        const found = AVAILABLE_TRACKS.find(t => t.url === layerUrl);
        if (found) {
          newTracks[found.id] = { isPlaying: true, volume: config.disableSynth ? 1 : 0.4 };
        } else {
          // It's a custom URL
          const customAudio = new Audio(layerUrl);
          customAudio.loop = true;
          customAudio.volume = (config.disableSynth ? 1 : 0.4) * masterVolume;
          customAudio.play().catch(e => console.warn("Custom layer play error:", e));
          customAmbientsRef.current.push(customAudio);
        }
      });
    } else {
       // Fallback ambient if NO synth and NO layers
       if(config.disableSynth) {
          newTracks['space'] = { isPlaying: true, volume: 0.4 };
       }
    }
    setTracks(newTracks);

    // Start Synth if enabled
    if (!config.disableSynth) {
      try {
        initSynth();
        const ctx = audioCtxRef.current!;
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        
        // Initial volume applies global volume, later modulated by updateArmPos
        masterGain.gain.value = 0.5 * volume;

        const pulseGain = ctx.createGain();
        pulseGain.connect(masterGain);
        
        if (config.pulse) {
          const lfo = ctx.createOscillator();
          lfo.type = config.pulseType || 'sine';
          lfo.frequency.value = config.pulse;
          lfo.connect(pulseGain.gain);
          lfo.start();
          // Modulate volume slightly
          pulseGain.gain.value = 0.8;
          synthNodesRef.current.pulseGain = pulseGain;
        }

        const merger = ctx.createChannelMerger(2);
        merger.connect(pulseGain);

        const leftOsc = ctx.createOscillator();
        leftOsc.type = config.carrierType || 'sine';
        leftOsc.frequency.value = config.base;
        leftOsc.connect(merger, 0, 0);

        const rightOsc = ctx.createOscillator();
        rightOsc.type = config.carrierType || 'sine';
        rightOsc.frequency.value = config.base + config.beat;
        rightOsc.connect(merger, 0, 1);

        leftOsc.start();
        rightOsc.start();

        synthNodesRef.current = { leftOsc, rightOsc, masterGain };
      } catch (e) {
        console.error("Synthesizer failed to start:", e);
      }
    }
  }, [tracks, volume, masterVolume]);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    setMasterPlaying(false);

    // Fade out synth if active
    if (synthNodesRef.current.masterGain && audioCtxRef.current) {
      synthNodesRef.current.masterGain.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      setTimeout(() => {
        if (synthNodesRef.current.leftOsc) {
          try { synthNodesRef.current.leftOsc.stop(); } catch(e){}
        }
        if (synthNodesRef.current.rightOsc) {
          try { synthNodesRef.current.rightOsc.stop(); } catch(e){}
        }
      }, 1000);
    }
    
    // Fade out custom ambients
    customAmbientsRef.current.forEach(audio => {
      audio.pause();
    });
  }, []);

  const updateArmPos = useCallback((armPos: number) => {
    // armPos is usually 0..1 representing breath phase depth
    // We can use it to modulate synth volume
    if (synthNodesRef.current.masterGain && audioCtxRef.current) {
        // e.g. 0.3 to 1.0 multiplier based on breath curve
        const curve = 0.3 + (armPos * 0.7);
        synthNodesRef.current.masterGain.gain.setTargetAtTime(curve * volume * 0.5, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume]);

  // Master toggles
  const toggleMaster = useCallback(() => setMasterPlaying(p => !p), []);
  const setMasterVol = useCallback((v: number) => setMasterVolume(v), []);
  
  const toggleTrack = useCallback((trackId: string) => {
    setTracks(prev => ({
      ...prev,
      [trackId]: { isPlaying: !prev[trackId]?.isPlaying, volume: prev[trackId]?.volume || 0.5 }
    }));
  }, []);
  
  const setTrackVolumeCall = useCallback((trackId: string, v: number) => {
    setTracks(prev => ({
      ...prev,
      [trackId]: { ...prev[trackId], volume: v }
    }));
  }, []);

  const stopAll = useCallback(() => {
    setMasterPlaying(false);
    setTracks(prev => {
      const n = { ...prev };
      Object.keys(n).forEach(k => n[k].isPlaying = false);
      return n;
    });
    stopAudio();
  }, [stopAudio]);

  const setGlobalVolume = useCallback((v: number) => {
    setVolumeState(v);
    setMasterVolume(v);
    
    if (synthNodesRef.current.masterGain && audioCtxRef.current) {
         synthNodesRef.current.masterGain.gain.setTargetAtTime(0.5 * v, audioCtxRef.current.currentTime, 0.1);
    }
    
    customAmbientsRef.current.forEach(audio => {
        audio.volume = 0.4 * v;
    });
  }, []);

  const resolveInteraction = useCallback(() => {
    setNeedsInteraction(false);
  }, []);

  return (
    <AudioContext.Provider value={{
      masterPlaying, masterVolume, tracks, toggleMaster, setMasterVolume: setMasterVol,
      toggleTrack, setTrackVolume: setTrackVolumeCall, stopAll, needsInteraction, resolveInteraction,
      isPlaying, volume, startAudio, stopAudio, setGlobalVolume, updateArmPos
    }}>
      {children}
      <div style={{ display: 'none' }}>
        {AVAILABLE_TRACKS.map(track => (
          <audio key={track.id} ref={el => { if(el) audioRefs.current[track.id] = el; }} src={track.url} loop preload="auto" />
        ))}
      </div>
    </AudioContext.Provider>
  );
}

export function useAudioMixer() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioMixer must be used within AudioProvider");
  return context;
}
