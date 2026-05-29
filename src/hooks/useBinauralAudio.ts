import { useCallback } from 'react';
import { useAudioMixer } from '../contexts/AudioContext';

export type { AudioConfig } from '../data/types-breath';
import { AudioConfig } from '../data/types-breath';

export function useBinauralAudio(config?: AudioConfig) {
  const { startAudio, stopAudio, isPlaying, setGlobalVolume, updateArmPos, volume } = useAudioMixer();

  const start = useCallback((overrideConfig?: AudioConfig) => {
    startAudio((overrideConfig || config || { base: 110, beat: 6.3, pulse: 0.1 }) as any);
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
