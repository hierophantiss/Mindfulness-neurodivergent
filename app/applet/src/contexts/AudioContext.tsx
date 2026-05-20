import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definitions matching the user's available sound files
export const AVAILABLE_TRACKS = [
  { id: 'zen', fileName: 'atlasaudio-calming-zen-519422.mp3', labelEN: 'Calming Zen', labelEL: 'Ήρεμο Zen', icon: 'Sparkles', color: 'text-emerald-400' },
  { id: 'space1', fileName: 'space-ambient.mp3', labelEN: 'Space Ambient', labelEL: 'Ατμόσφαιρα Διαστήματος', icon: 'Moon', color: 'text-indigo-400' },
  { id: 'space2', fileName: 'audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3', labelEN: 'Deep Space', labelEL: 'Βαθύ Διάστημα', icon: 'Sparkles', color: 'text-blue-500' },
  { id: 'rain', fileName: 'binaural-beats-25-hz-delta-with-rain-.mp3', labelEN: 'Rain & Delta', labelEL: 'Βροχή & Delta', icon: 'CloudRain', color: 'text-sky-400' },
  { id: 'cat', fileName: 'cat-purring-.mp3', labelEN: 'Cat Purr', labelEL: 'Γουργουρητό Γάτας', icon: 'Moon', color: 'text-amber-500' },
  { id: 'sleep963', fileName: 'meditativetiger-sleep-music-963-hz-binaural-immersive-audio-426673.mp3', labelEN: '963Hz Sleep', labelEL: '963Hz Ύπνος', icon: 'Music', color: 'text-purple-400' },
  { id: 'beta20', fileName: 'purebinaural-purebinaural-20-hz-beta-isochronic-tones-pure-tone-496540.mp3', labelEN: '20Hz Beta Pure', labelEL: '20Hz Beta', icon: 'Wind', color: 'text-rose-400' }
];

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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1.0);
  const [tracks, setTracks] = useState<Record<string, TrackState>>({});

  // Initialize tracks
  useEffect(() => {
    const initial: Record<string, TrackState> = {};
    AVAILABLE_TRACKS.forEach(t => {
      initial[t.id] = { isPlaying: false, volume: 0.5 };
    });
    setTracks(initial);
  }, []);

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

  return (
    <AudioContext.Provider value={{ masterPlaying, masterVolume, tracks, toggleMaster, setMasterVolume: setMasterVolumeLevel, toggleTrack, setTrackVolume, stopAll }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioMixer() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudioMixer must be used within AudioProvider");
  return context;
}
