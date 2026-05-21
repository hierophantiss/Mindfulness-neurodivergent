import React from 'react';
import { useAudioMixer } from '../contexts/AudioContext';

export function AudioEnabler() {
  const { needsInteraction, resolveInteraction } = useAudioMixer();

  if (!needsInteraction) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1d27] p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 border border-[#1D9E75]/30">
        <h2 className="text-2xl font-bold text-white mb-4">🎵 Audio Blocked</h2>
        <p className="text-[#d4d4d8] mb-6">
          Your browser requires you to click or tap the screen before audio can play.
        </p>
        <button 
          onClick={resolveInteraction}
          className="bg-[#1D9E75] text-white px-8 py-3 rounded-full font-bold hover:bg-[#27c491] transition-colors shadow-lg hover:shadow-[#1D9E75]/50"
        >
          Enable Audio
        </button>
      </div>
    </div>
  );
}
