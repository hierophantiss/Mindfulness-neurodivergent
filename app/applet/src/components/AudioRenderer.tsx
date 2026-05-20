import React, { useEffect, useRef } from 'react';
import { useAudioMixer, AVAILABLE_TRACKS } from '../contexts/AudioContext';

export function AudioRenderer() {
  const { masterPlaying, masterVolume, tracks } = useAudioMixer();
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Create audio elements if they don't exist
    AVAILABLE_TRACKS.forEach(track => {
      if (!audioRefs.current[track.id]) {
        const audio = new Audio(`/${track.fileName}`);
        audio.loop = true;
        audio.volume = 0;
        audioRefs.current[track.id] = audio;
      }
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  useEffect(() => {
    // Apply state changes
    Object.keys(tracks).forEach(id => {
      const audio = audioRefs.current[id];
      const trackState = tracks[id];
      
      if (audio) {
        // Calculate effective volume
        const effectiveVolume = masterPlaying && trackState.isPlaying 
          ? trackState.volume * masterVolume 
          : 0;

        // Start playing if not playing and needs to play
        if (effectiveVolume > 0 && audio.paused) {
          audio.play().catch(e => console.warn('Audio play failed:', e));
        }

        // Apply smooth volume
        audio.volume = effectiveVolume;

        // Pause immediately if volume is 0
        if (effectiveVolume === 0 && !audio.paused) {
          audio.pause();
        }
      }
    });
  }, [masterPlaying, masterVolume, tracks]);

  return null; // This component doesn't render anything
}
