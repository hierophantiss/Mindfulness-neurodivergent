// Web Audio API Synthesizer for UI Micro-interactions
// No external assets required, generates soft, elegant sounds.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const setGlobalSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    // Only resume if we can (e.g. after user interaction)
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

export const playSound = (type: 'hover' | 'click' | 'complete' | 'chime') => {
  if (!soundEnabled) return;
  
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    if (type === 'click') {
      navigator.vibrate(10); // Very brief, subtle vibration
    } else if (type === 'complete') {
      navigator.vibrate([30, 50, 40]); // A small success pattern
    } else if (type === 'chime') {
      navigator.vibrate(20);
    }
  }

  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  const t = ctx.currentTime;
  
  if (type === 'hover') {
    // Very subtle, quiet click/tick for hover
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.015, t + 0.01);
    gain.gain.linearRampToValueAtTime(0, t + 0.05); // Very quiet
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.06);
  }
  else if (type === 'click') {
    // Soft, slightly deeper tap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.11);
  }
  else if (type === 'complete') {
    // Resonant singing bowl / bell effect (for completing a task)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(329.63, t); // E4
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(332.00, t); // Slight detune for beating effect
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, t);
    filter.frequency.exponentialRampToValueAtTime(400, t + 2);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.05); // Gentle attack
    gain.gain.exponentialRampToValueAtTime(0.001, t + 3); // Long decay
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 3.1);
    osc2.stop(t + 3.1);
  }
  else if (type === 'chime') {
    // Soft single note chime
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(t);
    osc.stop(t + 1.6);
  }
};

// Global event delegation for UI interaction sounds
let isInitialized = false;

export const initUISounds = () => {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  const getClickable = (el: HTMLElement | null): HTMLElement | null => {
    while (el && el !== document.body) {
      if (
        el.tagName === 'BUTTON' || 
        el.tagName === 'A' || 
        el.getAttribute('role') === 'button' ||
        el.closest('[data-interactive="true"]')
      ) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  };

  // Hover
  document.addEventListener('mouseover', (e) => {
    const clickable = getClickable(e.target as HTMLElement);
    if (clickable && !(clickable as any).disabled) {
      const oldHover = clickable.dataset.hovered;
      if (!oldHover) {
        clickable.dataset.hovered = 'true';
        playSound('hover');
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const clickable = getClickable(e.target as HTMLElement);
    if (clickable) {
      // Check if we are really leaving the element (and not just moving to a child)
      if (!e.relatedTarget || !clickable.contains(e.relatedTarget as Node)) {
        delete clickable.dataset.hovered;
      }
    }
  });

  // Click
  document.addEventListener('mousedown', (e) => {
    const getClickable = (el: HTMLElement | null): HTMLElement | null => {
      while (el && el !== document.body) {
        if (
          el.tagName === 'BUTTON' || 
          el.tagName === 'A' || 
          el.getAttribute('role') === 'button' ||
          el.closest('[data-interactive="true"]') ||
          el.tagName === 'INPUT' ||
          el.tagName === 'SELECT' ||
          el.tagName === 'TEXTAREA'
        ) {
          return el;
        }
        el = el.parentElement;
      }
      return null;
    };
    
    const clickable = getClickable(e.target as HTMLElement);
    if (clickable && !(clickable as any).disabled) {
      // Resume audio context on first click if needed
      getAudioContext();
      playSound('click');
    }
  });
};
