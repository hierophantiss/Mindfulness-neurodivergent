
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface AudioState {
  [trackId: string]: {
    isPlaying: boolean;
    volume: number;
  }
}

interface AudioContextProps {
  masterPlaying: boolean;
  masterVolume: number;
  tracks: AudioState;
  toggleMaster: () => void;
  setMasterVolume: (v: number) => void;
  toggleTrack: (trackId: string) => void;
  setTrackVolume: (trackId: string, v: number) => void;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [masterPlaying, setMasterPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1);
  const [tracks, setTracks] = useState<AudioState>({ space_ambient: { isPlaying: true, volume: 0.5 } });

  const toggleMaster = () => setMasterPlaying(p => !p);

  const toggleTrack = (id: string) => {
    setTracks(prev => {
      const isCurrentlyPlaying = prev[id]?.isPlaying ?? false;
      const currentVolume = prev[id]?.volume ?? 0.5;
      
      const newState = { ...prev, [id]: { isPlaying: !isCurrentlyPlaying, volume: currentVolume } };
      
      // Auto-start master if it was paused and we turn a track on
      if (!isCurrentlyPlaying && !masterPlaying) {
        setMasterPlaying(true);
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

  return (
    <AudioContext.Provider value={{
      masterPlaying, masterVolume, tracks,
      toggleMaster, setMasterVolume, toggleTrack, setTrackVolume
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
