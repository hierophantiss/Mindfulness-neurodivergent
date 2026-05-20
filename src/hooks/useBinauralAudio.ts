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

const ambientBufferCache: Record<string, AudioBuffer> = {};

export interface AudioConfig {
  base: number;
  beat: number;
  pulse: number;
  ambientLayers?: string[];
  disableSynth?: boolean;
}

export function useBinauralAudio(config: AudioConfig) {
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const acRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false); 
  const volumeRef = useRef(1);

  const setGlobalVolume = useCallback((v: number) => {
    console.log('Setting global volume to:', v);
    volumeRef.current = v;
    
    const ac = acRef.current;
    
    if (ac && masterGainRef.current && isPlayingRef.current) {
      try {
        masterGainRef.current.gain.cancelScheduledValues(ac.currentTime);
        const targetVol = configRef.current.disableSynth ? v : v * 0.4;
        masterGainRef.current.gain.setTargetAtTime(targetVol, ac.currentTime, 0.1);
      } catch (e) {
        console.warn("Volume change err", e);
      }
    }

    // Apply immediately to ambient layers
    if (nodesRef.current.ambientAudios) {
      nodesRef.current.ambientAudios.forEach(audio => {
        try {
          const path = audio.src || '';
          const maxVol = configRef.current.disableSynth ? 1.0 : (path.includes('cat') ? 0.8 : 0.4);
          audio.volume = v * maxVol;
        } catch (e) {}
      });
    }
  }, []);

  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nodesRef = useRef<{
    binL?: OscillatorNode;
    binR?: OscillatorNode;
    pulseLfo?: OscillatorNode;
    pinkSource?: AudioBufferSourceNode;
    ambientAudios?: HTMLAudioElement[];
  }>({});

  const cleanupNodes = useCallback(() => {
    console.log('Cleaning up audio nodes...');
    
    try { nodesRef.current.binL?.stop(); } catch(e){}
    try { nodesRef.current.binR?.stop(); } catch(e){}
    try { nodesRef.current.pulseLfo?.stop(); } catch(e){}
    try { nodesRef.current.pinkSource?.stop(); } catch(e){}
    
    // Stop all buffered ambient nodes
    if (nodesRef.current.ambientAudios) {
      nodesRef.current.ambientAudios.forEach(audio => {
        try {
          audio.pause();
          audio.removeAttribute('src');
          if (audio.parentNode) {
            audio.parentNode.removeChild(audio);
          }
        } catch(e) {}
      });
      nodesRef.current.ambientAudios = [];
    }
    
    try { nodesRef.current.binL?.disconnect(); } catch(e){}
    try { nodesRef.current.binR?.disconnect(); } catch(e){}
    try { nodesRef.current.pulseLfo?.disconnect(); } catch(e){}
    try { nodesRef.current.pinkSource?.disconnect(); } catch(e){}
    
    nodesRef.current = {};

    if (masterGainRef.current) {
      try { masterGainRef.current.disconnect(); } catch(e){}
    }
    masterGainRef.current = null;
    oceanGainRef.current = null;

    setIsPlaying(false);
    isPlayingRef.current = false;
  }, []);

  const cleanup = useCallback(() => {
    console.log('Full hook cleanup called');
    if (cleanupTimeoutRef.current) {
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
    }
    
    cleanupNodes();

    if (acRef.current) {
      try {
        if (acRef.current.state !== 'closed') {
          acRef.current.close().catch(console.warn);
        }
      } catch (e) {}
      acRef.current = null;
    }
  }, [cleanupNodes]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const startAudio = useCallback((overrideConfig?: AudioConfig) => {
    const currentConfig = overrideConfig || config;
    
    if (isPlayingRef.current) {
      console.log('Audio already playing, ignoring start request.');
      return;
    }
    
    if (cleanupTimeoutRef.current) {
      console.log('Force cleaning up previous session before start');
      clearTimeout(cleanupTimeoutRef.current);
      cleanupTimeoutRef.current = null;
      cleanupNodes();
    }
    
    console.log('--- STARTING AUDIO ENGINE ---');
    
    try {
      let ac = acRef.current;
      
      if (!ac || ac.state === 'closed') {
        acRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        ac = acRef.current;
      }
      
      console.log('Initial AudioContext state:', ac.state);
      
      if (ac.state === 'suspended') {
        console.log('Attempting to resume AudioContext...');
        ac.resume().catch(console.warn);
      }
      
      isPlayingRef.current = true;
      setIsPlaying(true);

      let master: GainNode | null = null;
      if (ac) {
        master = ac.createGain();
        master.gain.setValueAtTime(0, ac.currentTime);
        master.connect(ac.destination);
        masterGainRef.current = master;
      }

      if (ac && master && !currentConfig.disableSynth) {
        // Pink Noise Layer
        const pinkBuffer = makePinkNoise(ac);
        const pinkSource = ac.createBufferSource();
        pinkSource.buffer = pinkBuffer;
        pinkSource.loop = true;
        const pinkGain = ac.createGain();
        pinkGain.gain.setValueAtTime(0.03, ac.currentTime);
        pinkSource.connect(pinkGain).connect(master);
        pinkSource.start();
        nodesRef.current.pinkSource = pinkSource;

        // Pulse Entrainment
        const amNode = ac.createGain();
        amNode.gain.setValueAtTime(1.0, ac.currentTime);
        amNode.connect(master);
        oceanGainRef.current = amNode; // Modulate this one

        const pulseLfo = ac.createOscillator();
        pulseLfo.type = 'sine';
        pulseLfo.frequency.setValueAtTime(currentConfig.pulse || 0.1, ac.currentTime);
        const pulseDepth = ac.createGain();
        pulseDepth.gain.setValueAtTime(0.15, ac.currentTime);
        pulseLfo.connect(pulseDepth);
        pulseDepth.connect(amNode.gain);
        pulseLfo.start();
        nodesRef.current.pulseLfo = pulseLfo;
        
        const binauralNode = ac.createGain();
        binauralNode.connect(amNode);

        // Left Ear
        const binL = ac.createOscillator();
        binL.type = 'sine';
        binL.frequency.setValueAtTime(currentConfig.base, ac.currentTime);
        const gL = ac.createGain(); 
        gL.gain.setValueAtTime(0.25, ac.currentTime);
        let pL;
        try {
          pL = ac.createStereoPanner(); 
          pL.pan.setValueAtTime(-1, ac.currentTime);
        } catch(e) {
          pL = ac.createPanner();
          pL.panningModel = 'equalpower';
          pL.setPosition(-1, 0, 0);
        }
        binL.connect(gL).connect(pL).connect(binauralNode);
        binL.start();
        nodesRef.current.binL = binL;

        // Right Ear
        const binR = ac.createOscillator();
        binR.type = 'sine';
        binR.frequency.setValueAtTime(currentConfig.base + currentConfig.beat, ac.currentTime);
        const gR = ac.createGain(); 
        gR.gain.setValueAtTime(0.25, ac.currentTime);
        let pR;
        try {
          pR = ac.createStereoPanner(); 
          pR.pan.setValueAtTime(1, ac.currentTime);
        } catch(e) {
          pR = ac.createPanner();
          pR.panningModel = 'equalpower';
          pR.setPosition(1, 0, 0);
        }
        binR.connect(gR).connect(pR).connect(binauralNode);
        binR.start();
        nodesRef.current.binR = binR;
      }

      // Optional ambient layers using HTMLAudioElement
      if (ac && master) {
        currentConfig.ambientLayers?.forEach(path => {
          if (!path) return;
          
          console.log('Loading ambient layer:', path);
          const audio = new window.Audio(path);
          if (path.startsWith('http')) {
            audio.crossOrigin = 'anonymous'; 
          }
          audio.preload = 'auto';
          audio.loop = true;
          audio.setAttribute('playsinline', 'true');
          
          // Mobile Safari safety: Append to DOM
          audio.style.display = 'none';
          document.body.appendChild(audio);
          
          const maxVol = currentConfig.disableSynth ? 1.0 : (path.includes('cat') ? 0.8 : 0.4);
          audio.volume = maxVol * volumeRef.current;
          
          const playPromise = audio.play();
          if (playPromise !== undefined) {
             playPromise.catch((e) => {
                console.warn(`Failed to play ${path}. Is the file encoded correctly?`, e);
             });
          }
          
          if (!nodesRef.current.ambientAudios) {
            nodesRef.current.ambientAudios = [];
          }
          nodesRef.current.ambientAudios.push(audio);
        });

        // Fade in master
        master.gain.setValueAtTime(0, ac.currentTime);
        const targetVol = currentConfig.disableSynth ? volumeRef.current : 0.4 * volumeRef.current;
        master.gain.setTargetAtTime(targetVol, ac.currentTime, 0.5);
      }
      
      console.log('Audio started successfully');
    } catch (err: any) {
      console.warn('Audio start encountered an error (some layers may not play):', err);
      fetch('/api/audio-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           event: 'startAudio_trycatch_failed', 
           errorMsg: err.message || String(err),
           errorName: err.name || 'Unknown' 
        })
      }).catch(e => console.error(e));
      // Depending on the error we might not need to clean up everything, but we do anyway
      cleanupNodes();
    }
  }, [config, cleanupNodes]);

  const stopAudio = useCallback(() => {
    if (!isPlayingRef.current) return;
    console.log('Initiating audio stop sequence...');
    isPlayingRef.current = false;
    setIsPlaying(false);
    
    // 1. Smooth fade out
    if (acRef.current && masterGainRef.current) {
      try {
        const ac = acRef.current;
        masterGainRef.current.gain.cancelScheduledValues(ac.currentTime);
        masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value, ac.currentTime);
        masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.5);
      } catch(e) {
        console.warn("Fade out failed", e);
      }
    }

    // 2. Final cleanup and ambient audio pause
    if (nodesRef.current.ambientAudios) {
      nodesRef.current.ambientAudios.forEach(audio => {
        try {
           let vol = audio.volume;
           const fadeOut = setInterval(() => {
             vol = Math.max(0, vol - 0.05);
             audio.volume = isNaN(vol) ? 0 : vol;
             if (vol <= 0) {
               clearInterval(fadeOut);
               audio.pause();
             }
           }, 50);
        } catch (e) {}
      });
    }

    cleanupTimeoutRef.current = setTimeout(() => {
      cleanupNodes();
      console.log('Audio stop sequence complete.');
    }, 600);
  }, [cleanupNodes]);

  const updateArmPos = useCallback((armPos: number) => {
    if (!isPlayingRef.current || !acRef.current || !oceanGainRef.current) return;
    try {
      // Modulate ocean volume slightly based on arm position
      const target = 0.1 + armPos * 0.3;
      oceanGainRef.current.gain.linearRampToValueAtTime(target, acRef.current.currentTime + 0.2);
    } catch (e) {}
  }, []);

  return { startAudio, stopAudio, updateArmPos, isPlaying, setGlobalVolume };
}
