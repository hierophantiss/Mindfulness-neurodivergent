import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

// Definitions matching the user's available sound files
export const AVAILABLE_TRACKS = [
  { id: 'zen', url: '/atlasaudio-calming-zen-519422.mp3', labelEN: 'Calming Zen', labelEL: 'Ήρεμο Zen', icon: 'Sparkles', color: 'text-emerald-400' },
  { id: 'space1', url: '/space-ambient.mp3', labelEN: 'Space Ambient', labelEL: 'Ατμόσφαιρα Διαστήματος', icon: 'Moon', color: 'text-indigo-400' },
  { id: 'space2', url: '/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3', labelEN: 'Deep Space', labelEL: 'Βαθύ Διάστημα', icon: 'Sparkles', color: 'text-blue-500' },
  { id: 'rain', url: '/binaural-beats-25-hz-delta-with-rain-.mp3', labelEN: 'Rain & Delta', labelEL: 'Βροχή & Delta', icon: 'CloudRain', color: 'text-sky-400' },
  { id: 'cat', url: '/cat_purring.mp3', labelEN: 'Cat Purr', labelEL: 'Γουργουρητό Γάτας', icon: 'Moon', color: 'text-amber-500' },
  { id: 'sleep963', url: '/meditativetiger-sleep-music-963-hz-binaural-immersive-audio-426673.mp3', labelEN: '963Hz Sleep', labelEL: '963Hz Ύπνος', icon: 'Music', color: 'text-purple-400' },
  { id: 'beta20', url: '/purebinaural-purebinaural-20-hz-beta-isochronic-tones-pure-tone-496540.mp3', labelEN: '20Hz Beta Pure', labelEL: '20Hz Beta', icon: 'Wind', color: 'text-rose-400' }
];

export interface AudioConfig {
  base: number;
  beat: number;
  pulse?: number;
  carrierType?: 'sine' | 'triangle';
  pulseType?: 'sine';
  disableSynth?: boolean;
  ambientLayers?: string[];
}

interface TrackState {
  isPlaying: boolean;
  volume: number; // 0 to 1
}

interface AudioContextType {
  masterPlaying: boolean;
  masterVolume: number;
  tracks: Record<string, TrackState>;
  toggleMaster: () => void;
  setMasterVolume: (vol: number) => void;
  toggleTrack: (id: string) => void;
  setTrackVolume: (id: string, vol: number) => void;
  stopAll: () => void;

  isPlaying: boolean;
  volume: number;
  startAudio: (config: AudioConfig) => void;
  stopAudio: () => void;
  setGlobalVolume: (v: number) => void;
  updateArmPos: (armPos: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [tracks, setTracks] = useState<Record<string, TrackState>>({});
  
  const audioMapRef = useRef<Record<string, HTMLAudioElement>>({});
  const activeAmbientsRef = useRef<HTMLAudioElement[]>([]);
  const startAudioCalled = useRef(false);

  // Initialize tracks
  useEffect(() => {
    const initial: Record<string, TrackState> = {};
    AVAILABLE_TRACKS.forEach(t => {
      initial[t.id] = { isPlaying: false, volume: 0.5 };
    });
    setTracks(initial);
  }, []);

  const getAbsoluteUrl = (src: string) => {
    if (!src) return '';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return src;
    }
    let origin = '';
    try {
      if (window && window.location && window.location.origin && window.location.origin !== 'null') {
        origin = window.location.origin;
      } else if (window && window.location && window.location.href) {
        const url = new URL(window.location.href);
        if (url.protocol.startsWith('http')) {
          origin = url.protocol + '//' + url.host;
        }
      }
    } catch (e) {
      console.warn('[Central Audio Engine] Safe origin resolution failed', e);
    }
    if (origin) {
      const sep = src.startsWith('/') ? '' : '/';
      return `${origin}${sep}${src}`;
    }
    return src;
  };

  const getOrCreateAudio = (src: string) => {
    if (!src) return null;
    let audio = audioMapRef.current[src];
    if (!audio) {
      const absoluteUrl = getAbsoluteUrl(src);
      audio = new Audio(absoluteUrl);
      audio.loop = true;
      audio.preload = 'auto';
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
          console.warn('[Central Audio Engine] Play error:', err);
        });
      }
    } catch(err) {
      console.warn('[Central Audio Engine] play() exception:', err);
    }
  };

  const safePause = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
       audio.pause();
    } catch(err) {}
  };

  // Sync Audio elements with State
  useEffect(() => {
    AVAILABLE_TRACKS.forEach(track => {
      const audio = getOrCreateAudio(track.url);
      if (!audio) return;

      const state = tracks[track.id];
      if (state && state.isPlaying && masterPlaying) {
        audio.volume = Math.max(0, Math.min(1, state.volume * masterVolume));
        if (audio.paused) safePlay(audio);
      } else {
        safePause(audio);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(audioMapRef.current).forEach(audio => {
        safePause(audio);
      });
    };
  }, [tracks, masterPlaying, masterVolume]);

  const toggleMaster = () => setMasterPlaying(p => !p);
  const setMasterVolumeLevel = (v: number) => setMasterVolume(v);
  
  const toggleTrack = (id: string) => {
    setTracks(prev => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };
      const next = { ...prev, [id]: { ...current, isPlaying: !current.isPlaying } };
      
      // Auto-start master if we play a track
      if (!current.isPlaying && !masterPlaying) {
        setMasterPlaying(true);
      }
      return next;
    });
  };

  const setTrackVolume = (id: string, vol: number) => {
    setTracks(prev => ({
      ...prev,
      [id]: { ...(prev[id] || { isPlaying: false }), volume: vol }
    }));
  };

  const stopAll = () => {
    setMasterPlaying(false);
    setTracks(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => next[k].isPlaying = false);
      return next;
    });
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const startAudio = (config: AudioConfig) => {
    if (isPlaying) {
      stopAudio();
    }
    console.log('[Central Audio Engine] startAudio override!');
    setIsPlaying(true);
    
    // Play requested ambient layers
    if (config.ambientLayers && config.ambientLayers.length > 0) {
      config.ambientLayers.forEach(path => {
        let audio = audioMapRef.current[path];
        if (!audio) {
          audio = new Audio(getAbsoluteUrl(path));
          audio.loop = true;
          audio.preload = 'auto';
          audioMapRef.current[path] = audio;
        }
        audio.volume = 0;
        activeAmbientsRef.current.push(audio);
        
        audio.currentTime = 0;
        safePlay(audio);
        
        let vol = 0;
        const maxVol = (config.disableSynth) ? 1.0 : 0.4;
        const interval = setInterval(() => {
          vol += 0.05;
          if (vol >= maxVol * volume) {
            audio.volume = Math.max(0, Math.min(1, maxVol * volume));
            clearInterval(interval);
          } else {
            audio.volume = Math.max(0, Math.min(1, vol));
          }
        }, 100);
      });
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    console.log('[Central Audio Engine] stopAudio override!');
    
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
    activeAmbientsRef.current = [];
  };

  const setGlobalVolume = (v: number) => {
    setVolume(v);
    activeAmbientsRef.current.forEach(audio => {
        try {
            audio.volume = Math.max(0, Math.min(1, v * 0.4));
        } catch(e) {}
    });
  };

  const updateArmPos = (pos: number) => {
    // Only used for synth originally, we can leave this inert
  };

  return (
    <AudioContext.Provider value={{ 
      masterPlaying, masterVolume, tracks, toggleMaster, 
      setMasterVolume: setMasterVolumeLevel, toggleTrack, setTrackVolume, stopAll,
      isPlaying, volume, startAudio, stopAudio, setGlobalVolume, updateArmPos
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioMixer() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioMixer must be used within AudioProvider");
  return context;
}
