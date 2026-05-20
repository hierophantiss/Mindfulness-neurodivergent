
import React, { useEffect, useRef } from 'react';
import { useAudioMixer, AVAILABLE_TRACKS } from '../contexts/AudioContext';

export function AudioRenderer() {
  const { masterPlaying, masterVolume, tracks } = useAudioMixer();
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    // Initialize audio elements for all available tracks if they don't exist
    AVAILABLE_TRACKS.forEach(track => {
      if (!audioRefs.current[track.id]) {
        const audio = new Audio(track.url);
        audio.loop = true;
        // Don't preload until necessary to save bandwidth, but for mix it's tricky.
        // Let's set it to preload='none' initially, then load on play.
        audio.preload = 'none';
        audioRefs.current[track.id] = audio;
      }
    });

    return () => {
      // Cleanup on unmount
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
        audio.remove();
      });
      audioRefs.current = {};
    };
  }, []);

  // Effect to handle playback and volume based on state
  useEffect(() => {
    AVAILABLE_TRACKS.forEach(track => {
      const audio = audioRefs.current[track.id];
      const state = tracks[track.id];
      
      if (!audio) return;

      const shouldPlay = masterPlaying && state && state.isPlaying;

      if (shouldPlay) {
        if (audio.paused) {
          // Wrap in try-catch because browsers block auto-play without interaction
          audio.play().catch(console.error); 
        }
        audio.volume = state.volume * masterVolume;
      } else {
        if (!audio.paused) {
          audio.pause();
        }
      }
    });
  }, [masterPlaying, masterVolume, tracks]);

  return null; // This component renders nothing
}
