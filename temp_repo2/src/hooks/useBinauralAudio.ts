import { useCallback } from 'react';
import { useAudioMixer, AudioConfig } from '../contexts/AudioContext';

export type { AudioConfig };

export function useBinauralAudio(config?: AudioConfig) {
  const { startAudio, stopAudio, isPlaying, setGlobalVolume, updateArmPos, volume } = useAudioMixer();

  const start = useCallback((overrideConfig?: AudioConfig) => {
    startAudio(overrideConfig || config || { base: 110, beat: 6.3, pulse: 0.1 });
  }, [startAudio, config]);

  return {
    startAudio: start,
    stopAudio,
    isPlaying,
    setGlobalVolume,
    updateArmPos,
    volume
  };
}
