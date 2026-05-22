import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';

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
  // Legacy Track State & Master Control (For Navigation Menu / Ambient Player Tab)
  masterPlaying: boolean;
  masterVolume: number;
  tracks: AudioState;
  toggleMaster: () => void;
  setMasterVolume: (v: number) => void;
  toggleTrack: (trackId: string) => void;
  setTrackVolume: (trackId: string, v: number) => void;

  // Centralized Audio Engine parameters
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

export function AudioProvider({ children }: { children: ReactNode }) {
  // 1. Mixer State (Tabs and Players)
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1);
  const [tracks, setTracks] = useState<AudioState>({
    rain: { isPlaying: false, volume: 0.5 },
    zen: { isPlaying: false, volume: 0.5 },
    sleep: { isPlaying: false, volume: 0.5 },
    space_ambient: { isPlaying: true, volume: 0.5 },
    cat: { isPlaying: false, volume: 0.5 },
    pure: { isPlaying: false, volume: 0.5 },
    space: { isPlaying: false, volume: 0.5 }
  });

  // 2. Centralized Audio Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1.0);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  // Audio elements references
  const audioRefs = useRef<{ [trackId: string]: HTMLAudioElement }>({});

  // Initialize Audio Elements
  useEffect(() => {
    AVAILABLE_TRACKS.forEach(track => {
      if (!audioRefs.current[track.id]) {
        const audio = new Audio(track.url);
        audio.loop = true;
        audio.volume = 0; // default to 0 to prevent sudden pops
        audioRefs.current[track.id] = audio;
      }
    });

    return () => {
      // Light cleanup on unmount for strict mode safety
      Object.keys(audioRefs.current).forEach(id => {
        const audio = audioRefs.current[id];
        audio.pause();
        // Intentionally NOT clearing the src attribute to avoid throwing
        // "NotSupportedError" if play() is still pending in the promise queue.
      });
    };
  }, []);

  // Sync state changes to actual audio players
  useEffect(() => {
    Object.keys(tracks).forEach(trackId => {
      const audio = audioRefs.current[trackId];
      if (!audio) return;

      const trackConf = tracks[trackId];
      // Target volume depends on whether track is enabled, master is playing, and master volume
      const shouldPlay = trackConf.isPlaying && masterPlaying;
      const targetVolume = shouldPlay ? trackConf.volume * masterVolume : 0;

      // Update volume immediately for stability
      audio.volume = targetVolume;

      // Play / Pause handling
      if (shouldPlay && audio.paused) {
        let playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn(`[Audio Engine] Play prevented for ${trackId}:`, err);
            // Only trigger strictly for Autoplay policy blocking
            if (err.name === 'NotAllowedError') {
              setNeedsInteraction(true);
              setMasterPlaying(false);
            }
          });
        }
      } else if (!shouldPlay && !audio.paused) {
        audio.pause();
      }
    });
  }, [tracks, masterPlaying, masterVolume]);

  const toggleMaster = useCallback(() => {
    setMasterPlaying(prev => !prev);
  }, []);

  const toggleTrack = useCallback((trackId: string) => {
    setTracks(prev => {
      const isCurrentlyPlaying = prev[trackId]?.isPlaying ?? false;
      const currentVol = prev[trackId]?.volume ?? 0.5;
      const updated = {
        ...prev,
        [trackId]: { isPlaying: !isCurrentlyPlaying, volume: currentVol }
      };

      // Coordinate master state
      setMasterPlaying(prevMaster => {
        if (!isCurrentlyPlaying && !prevMaster) return true;
        const anyPlaying = Object.values(updated).some(t => t.isPlaying);
        return anyPlaying ? prevMaster : false;
      });

      return updated;
    });
  }, []);

  const setTrackVolume = useCallback((trackId: string, v: number) => {
    setTracks(prev => ({
      ...prev,
      [trackId]: { ...prev[trackId], volume: v }
    }));
  }, []);

  // System audio triggers (Placeholder, mapped to standard tracks if needed)
  const startAudio = useCallback((config: AudioConfig) => {
    console.log('[Audio Engine] Session audio requested.');
    setIsPlaying(true);
    setMasterPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    setMasterPlaying(false);
  }, []);

  const resolveInteraction = useCallback(() => {
    setNeedsInteraction(false);
    setMasterPlaying(true);
  }, []);

  const setGlobalVolume = useCallback((v: number) => {
    setVolumeState(v);
    setMasterVolume(v);
  }, []);

  const updateArmPos = useCallback((armPos: number) => {}, []);

  return (
    <AudioContext.Provider value={{
      masterPlaying,
      masterVolume,
      tracks,
      toggleMaster,
      setMasterVolume,
      toggleTrack,
      setTrackVolume,
      isPlaying,
      volume,
      startAudio,
      stopAudio,
      needsInteraction,
      resolveInteraction,
      setGlobalVolume,
      updateArmPos
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
