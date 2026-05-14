import { useRef, useEffect, useCallback, useState } from 'react';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false); // Internal ref to avoid stale closure issues
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
    console.log('Stopping and cleaning up audio...');
    if (acRef.current) {
      try {
        if (acRef.current.state !== 'closed') {
          acRef.current.close().catch(console.warn);
        }
      } catch (e) {}
      acRef.current = null;
    }
    masterGainRef.current = null;
    oceanGainRef.current = null;
    
    ambientAudiosRef.current.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) {}
    });
    ambientAudiosRef.current = [];
    
    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const startAudio = useCallback(() => {
    if (isPlayingRef.current) {
      console.log('Audio already playing, ignoring start request.');
      return;
    }
    
    console.log('Starting audio...');
    isPlayingRef.current = true;
    setIsPlaying(true);
    
    const ac = new (window.AudioContext || (window as any).webkitAudioContext)();
    acRef.current = ac;
    
    const master = ac.createGain();
    master.gain.value = 0;
    master.connect(ac.destination);
    masterGainRef.current = master;

    // Pink Noise Layer (more soothing for ND brains - less "hiss" than white noise)
    const pinkBuffer = makePinkNoise(ac);
    const pinkSource = ac.createBufferSource();
    pinkSource.buffer = pinkBuffer;
    pinkSource.loop = true;
    const pinkGain = ac.createGain();
    pinkGain.gain.value = 0.03; // extremely subtle
    pinkSource.connect(pinkGain).connect(master);
    pinkSource.start();

    // Pulse Entrainment (Amplitude Modulation)
    const amNode = ac.createGain();
    amNode.gain.value = 1.0;
    amNode.connect(master);

    const pulseLfo = ac.createOscillator();
    pulseLfo.type = 'sine';
    pulseLfo.frequency.value = config.pulse || 0.1;
    const pulseDepth = ac.createGain();
    pulseDepth.gain.value = 0.15; 
    pulseLfo.connect(pulseDepth);
    pulseDepth.connect(amNode.gain);
    pulseLfo.start();
    
    const binauralNode = ac.createGain();
    binauralNode.connect(amNode);

    // Left Ear
    const binL = ac.createOscillator();
    binL.type = 'sine';
    binL.frequency.value = config.base;
    const gL = ac.createGain(); gL.gain.value = 0.25;
    const pL = ac.createStereoPanner(); pL.pan.value = -1;
    binL.connect(gL).connect(pL).connect(binauralNode);
    binL.start();

    // Right Ear
    const binR = ac.createOscillator();
    binR.type = 'sine';
    binR.frequency.value = config.base + config.beat;
    const gR = ac.createGain(); gR.gain.value = 0.25;
    const pR = ac.createStereoPanner(); pR.pan.value = 1;
    binR.connect(gR).connect(pR).connect(binauralNode);
    binR.start();

    // Optional ambient layers
    config.ambientLayers?.forEach(path => {
      if (!path) return;
      
      const audioUrl = path.startsWith('http') ? path : new URL(path, window.location.origin).href;
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = 0;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio play failed for path:", path, error);
        });
      }
      
      ambientAudiosRef.current.push(audio);
      
      let progress = 0;
      const fadeInterval = setInterval(() => {
        if (!isPlayingRef.current || !ambientAudiosRef.current.includes(audio)) {
          clearInterval(fadeInterval);
          return;
        }
        progress = Math.min(1, progress + 0.02);
        const maxVol = path.includes('cat') ? 0.8 : 0.3;
        audio.volume = progress * maxVol * volumeRef.current;
        if (progress >= 1) clearInterval(fadeInterval);
      }, 100);
    });

    // Fade in primary master
    master.gain.linearRampToValueAtTime(0.4 * volumeRef.current, ac.currentTime + 2);

  }, [config]);

  const stopAudio = useCallback(() => {
    if (!isPlayingRef.current) return;
    console.log('Stopping audio...');
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    // 1. Immediate mute of master gain to prevent "trailing" or "stuck" oscilators
    if (acRef.current && masterGainRef.current) {
      try {
        const ac = acRef.current;
        masterGainRef.current.gain.cancelScheduledValues(ac.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ac.currentTime);
        // Ramp to zero quickly but smoothly
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.5);
      } catch(e) {
        console.warn("Master gain ramp failed", e);
      }
    }

    // 2. Stop all ambient audio elements immediately
    ambientAudiosRef.current.forEach(audio => {
      try {
        audio.pause();
        audio.volume = 0;
      } catch (e) {}
    });

    // 3. Final atomic cleanup after the ramp duration
    setTimeout(() => {
      cleanup();
    }, 600);
  }, [cleanup]);

  const updateArmPos = useCallback((armPos: number) => {
    if (!isPlaying || !acRef.current || !oceanGainRef.current) return;
    try {
      // Modulate ocean volume slightly based on arm position
      const target = 0.1 + armPos * 0.3;
      oceanGainRef.current.gain.linearRampToValueAtTime(target, acRef.current.currentTime + 0.2);
    } catch (e) {}
  }, []);

  return { startAudio, stopAudio, updateArmPos, isPlaying, setGlobalVolume };
}
