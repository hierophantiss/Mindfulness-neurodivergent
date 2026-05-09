import { useRef, useEffect, useCallback } from 'react';

// Generates short noise buffers
function makeBrownNoise(ac: AudioContext) {
  const bufferSize = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const output = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5; // Compensate for gain
  }
  return buffer;
}

function makePinkNoise(ac: AudioContext) {
  const bufferSize = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const output = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11; // Compensate for gain
    b6 = white * 0.115926;
  }
  return buffer;
}

export interface AudioConfig {
  base: number;
  beat: number;
  pulse: number;
  ambientLayers?: string[];
}

export function useBinauralAudio(config: AudioConfig) {
  const acRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const ambientAudiosRef = useRef<HTMLAudioElement[]>([]);
  const volumeRef = useRef(1);

  const setGlobalVolume = useCallback((v: number) => {
    volumeRef.current = v;
    
    // Apply immediately to master gain
    if (acRef.current && masterGainRef.current && isPlayingRef.current) {
      masterGainRef.current.gain.setTargetAtTime(v * 0.5, acRef.current.currentTime, 0.1);
    }
    
    // Apply immediately to ambient layers
    if (isPlayingRef.current) {
      ambientAudiosRef.current.forEach(audio => {
        const maxVol = audio.src.includes('cat') ? 0.8 : 0.4;
        audio.volume = v * maxVol;
      });
    }
  }, []);

  const cleanup = useCallback(() => {
    if (acRef.current) {
      if (acRef.current.state !== 'closed') {
        acRef.current.close().catch(console.warn);
      }
      acRef.current = null;
    }
    masterGainRef.current = null;
    oceanGainRef.current = null;
    isPlayingRef.current = false;
    
    ambientAudiosRef.current.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    ambientAudiosRef.current = [];
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startAudio = useCallback(() => {
    if (isPlayingRef.current) return;
    
    const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
    acRef.current = ac;
    
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);
    masterGainRef.current = master;

    // Pulse Entrainment (Amplitude Modulation)
    const amNode = ac.createGain();
    amNode.gain.value = 1.0;
    amNode.connect(master);

    const pulseLfo = ac.createOscillator();
    pulseLfo.type = 'sine';
    pulseLfo.frequency.value = config.pulse;
    const pulseDepth = ac.createGain();
    pulseDepth.gain.value = 0.3; // depth
    pulseLfo.connect(pulseDepth);
    pulseDepth.connect(amNode.gain);
    pulseLfo.start();
    
    const binauralNode = ac.createGain();
    binauralNode.connect(amNode);

    // Left Ear
    const binL = ac.createOscillator();
    binL.type = 'sine';
    binL.frequency.value = config.base;
    const gL = ac.createGain(); gL.gain.value = 0.4;
    const pL = ac.createStereoPanner(); pL.pan.value = -1;
    binL.connect(gL).connect(pL).connect(binauralNode);
    binL.start();

    // Right Ear
    const binR = ac.createOscillator();
    binR.type = 'sine';
    binR.frequency.value = config.base + config.beat;
    const gR = ac.createGain(); gR.gain.value = 0.4;
    const pR = ac.createStereoPanner(); pR.pan.value = 1;
    binR.connect(gR).connect(pR).connect(binauralNode);
    binR.start();

    // Pad
    const padG = ac.createGain(); padG.gain.value = 0.08;
    [config.base*0.5, config.base*1.5, config.base*2].forEach((f, i) => {
      const o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const g = ac.createGain(); g.gain.value = [0.5, 0.25, 0.15][i] || 0.02;
      o.connect(g).connect(padG); o.start();
    });
    padG.connect(binauralNode);

    // Fade in primary audio
    master.gain.linearRampToValueAtTime(0.5 * volumeRef.current, ac.currentTime + 3);

    // Start external ambient layers if any
    config.ambientLayers?.forEach(path => {
      const audio = new Audio(path);
      audio.preload = 'none';
      audio.loop = true;
      audio.volume = 0;
      audio.play().catch(console.warn);
      ambientAudiosRef.current.push(audio);
      
      // Manual fade in
      let progress = 0;
      const fadeInterval = setInterval(() => {
        progress = Math.min(1, progress + 0.05);
        // Balance volumes: cat purring can be dominant, waves loud, others a bit softer
        const maxVol = path.includes('cat') ? 0.8 : 0.4;
        audio.volume = progress * maxVol * volumeRef.current;
        if (progress >= 1) clearInterval(fadeInterval);
      }, 150);
    });

    isPlayingRef.current = true;

  }, [config]);

  const stopAudio = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    // Fade out ambient audios manually
    ambientAudiosRef.current.forEach(audio => {
      let vol = audio.volume;
      const fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.05);
        audio.volume = vol;
        if (vol <= 0) {
          clearInterval(fadeInterval);
          audio.pause();
        }
      }, 100);
    });

    if (acRef.current && masterGainRef.current) {
      const ac = acRef.current;
      try {
        masterGainRef.current.gain.linearRampToValueAtTime(0, ac.currentTime + 1.2);
      } catch(e) {}
    }
    
    setTimeout(() => {
      cleanup();
    }, 1300);
  }, [cleanup]);

  const updateArmPos = useCallback((armPos: number) => {
    if (!isPlayingRef.current || !acRef.current || !oceanGainRef.current) return;
    try {
      // Modulate ocean volume slightly based on arm position
      const target = 0.1 + armPos * 0.3;
      oceanGainRef.current.gain.linearRampToValueAtTime(target, acRef.current.currentTime + 0.2);
    } catch (e) {}
  }, []);

  return { startAudio, stopAudio, updateArmPos, isPlaying: isPlayingRef.current, setGlobalVolume };
}
