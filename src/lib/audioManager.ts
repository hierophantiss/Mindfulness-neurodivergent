// Shared Audio Context and Unlocking Engine for the entire application
// This resolves any browser/iframe autoplay policy or resource limit issue.

let sharedAudioContext: AudioContext | null = null;
let isUnlocked = false;

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!sharedAudioContext) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      sharedAudioContext = new AudioContextClass();
    }
  }
  
  if (sharedAudioContext && sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  
  return sharedAudioContext;
}

// Function to synchronously unlock audio on any user gesture
export function unlockAudio() {
  if (isUnlocked) return;
  
  const ctx = getSharedAudioContext();
  if (ctx) {
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        isUnlocked = true;
        console.log('AudioContext successfully unlocked and resumed.');
      }).catch(err => {
        console.warn('Silent unlock failed:', err);
      });
    } else if (ctx.state === 'running') {
      isUnlocked = true;
    }
  }

  // Create a tiny silent audio element and play/pause it to unlock HTMLAudioElement
  try {
    const audio = new Audio();
    // Tiny silent wave
    audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        audio.pause();
        isUnlocked = true;
        console.log('HTMLAudioElement successfully unlocked.');
      }).catch((e) => {
        console.warn('HTMLAudioElement unlock failed:', e);
      });
    }
  } catch (e) {
    console.warn('Failed to perform HTMLAudio element unlock:', e);
  }
}

// Automatically setup listeners upon load
if (typeof window !== 'undefined') {
  const unlockEvents = ['click', 'touchstart', 'touchend', 'mousedown', 'keydown'];
  const handleUnlock = () => {
    unlockAudio();
    // After successful unlock, remove the event listeners
    if (isUnlocked) {
      unlockEvents.forEach(evt => {
        window.removeEventListener(evt, handleUnlock, true);
      });
    }
  };
  
  unlockEvents.forEach(evt => {
    window.addEventListener(evt, handleUnlock, { once: false, capture: true, passive: false });
  });
}
