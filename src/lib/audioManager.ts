// Shared Audio Context and Unlocking Engine for the entire application
// This is dummied out to deactivate the physical audio system under the hood,
// resolving all browser autoplay/CORS/iframe sandbox and pipeline errors securely.

export function getSharedAudioContext(): AudioContext | null {
  return null;
}

export function unlockAudio() {
  console.log('[Audio System] Dummy unlock invoked silently.');
}

