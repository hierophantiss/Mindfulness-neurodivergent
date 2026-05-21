import React, { useEffect, useRef, useState } from 'react';

import { BREATH_PATTERNS } from '../data/breathPatterns';

export interface PhaseDef {
  dur: number;
  armFrom: number;
  armTo: number;
  elbowFrom?: number;
  elbowTo?: number;
  headFrom?: number;
  headTo?: number;
  waistFrom?: number;
  waistTo?: number;
}

export interface PhaseLabel {
  label: { el: string; en: string };
  sub: { el: string; en: string };
}

const DEFAULT_PHASES: PhaseDef[] = [
  { dur: 4000, armFrom: 0, armTo: 1 }, // inhale
  { dur: 2000, armFrom: 1, armTo: 1 }, // hold up
  { dur: 6000, armFrom: 1, armTo: 0 }, // exhale
  { dur: 1000, armFrom: 0, armTo: 0 }  // hold down
];

const DEFAULT_LABELS: PhaseLabel[] = [
  { label: { el: "Εισπνοή", en: "Inhale" }, sub: { el: "σήκωσε τα χέρια αργά", en: "raise arms slowly" } },
  { label: { el: "Παύση", en: "Hold" }, sub: { el: "κράτα ψηλά", en: "hold high" } },
  { label: { el: "Εκπνοή", en: "Exhale" }, sub: { el: "κατέβασε αργά", en: "lower slowly" } },
  { label: { el: "Παύση", en: "Hold" }, sub: { el: "νιώσε το βάρος", en: "feel the weight" } }
];

function easeInOutSine(x: number) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

interface BreathCanvasProps {
  running: boolean;
  audioEnabled?: boolean;
  patternId?: string;
  phases?: PhaseDef[];
  phaseLabels?: PhaseLabel[];
  cycles: number;
  videoSrc?: string;
  useVideoOnly?: boolean;
  videoPeak?: number; // legacy
  videoInhaleStart?: number;
  videoInhaleEnd?: number;
  videoExhaleStart?: number;
  videoExhaleEnd?: number;
  onCycleComplete: (cycles: number) => void;
  onPhaseChange: (phase: PhaseLabel, index: number) => void;
  onTick?: (armPos: number) => void;
}

const B_COLORS: Record<string, { primary: string; secondary: string; aura: string }> = {
  '4-2-6-1': { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' },
  '4-7-8':   { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' },
  '5-5':     { primary: '#C5A059', secondary: '#E8C547', aura: '220, 190, 90' },
  'deep-bow-5-5': { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' },
  'lotus-bloom-5-5': { primary: '#8B5E3C', secondary: '#B98B53', aura: '185, 140, 85' },
  'sleep-delta': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' },
  'sleep-classical': { primary: '#8B5E3C', secondary: '#B98B53', aura: '185, 140, 85' },
  'delta': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' }, // added delta for compatibility
  'sos-breath': { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' } // mapping sos-breath
};

// drawing helper for lotus pattern
function drawLotus(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number, dpr: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.scale(dpr, dpr);
  const cx = (width / dpr) / 2;
  const cy = (height / dpr) / 2;

  const eased = progress; 
  ctx.globalCompositeOperation = 'screen';

  const layers = [
    { count: 12, color: `rgba(90, 160, 200, ${0.1 + 0.3 * eased})`, radiusStart: 30, radiusEnd: 150, sizeStart: 0.6, sizeEnd: 1.8, offset: 0 },
    { count: 8, color: `rgba(180, 120, 220, ${0.2 + 0.5 * eased})`, radiusStart: 20, radiusEnd: 100, sizeStart: 0.5, sizeEnd: 1.4, offset: Math.PI / 8 },
    { count: 8, color: `rgba(255, 180, 200, ${0.3 + 0.6 * eased})`, radiusStart: 10, radiusEnd: 50, sizeStart: 0.3, sizeEnd: 0.9, offset: Math.PI / 16 }
  ];

  layers.forEach((layer, layerIdx) => {
    const dist = layer.radiusStart + (layer.radiusEnd - layer.radiusStart) * eased;
    const scale = layer.sizeStart + (layer.sizeEnd - layer.sizeStart) * eased;

    for (let i = 0; i < layer.count; i++) {
       const breathingRotation = Math.sin(Date.now() / 3000 + layerIdx) * 0.05 * eased;
       const angle = (i * Math.PI * 2) / layer.count + layer.offset + breathingRotation;
       
       ctx.save();
       ctx.translate(cx, cy);
       ctx.rotate(angle);
       ctx.translate(0, -dist); 
       ctx.scale(scale, scale);
       
       ctx.beginPath();
       ctx.moveTo(0, -40);
       ctx.bezierCurveTo(25, -20, 20, 20, 0, 40);
       ctx.bezierCurveTo(-20, 20, -25, -20, 0, -40);
       
       ctx.fillStyle = layer.color;
       ctx.shadowColor = layer.color;
       ctx.shadowBlur = 15;
       ctx.fill();
       
       ctx.beginPath();
       ctx.moveTo(0, -35);
       ctx.lineTo(0, 30);
       ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + 0.2 * eased})`;
       ctx.lineWidth = 1;
       ctx.stroke();
       
       ctx.restore();
    }
  });

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath();
  const podSize = 8 + 12 * eased;
  ctx.arc(cx, cy, podSize, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, podSize);
  grad.addColorStop(0, '#FFF5C3');
  grad.addColorStop(1, '#FFCA3A');
  ctx.fillStyle = grad;
  ctx.shadowColor = '#FFCA3A';
  ctx.shadowBlur = 20 * eased + 5;
  ctx.fill();
  ctx.restore();
  
  ctx.save();
  ctx.beginPath();
  const ringSize = 100 + 150 * eased;
  ctx.arc(cx, cy, ringSize, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * eased})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

export default function BreathCanvas({  
  running, 
  audioEnabled = false,
  patternId = '4-2-6-1',
  phases = DEFAULT_PHASES,
  phaseLabels = DEFAULT_LABELS,
  cycles,
  videoSrc = '/infinity_greeting.mp4',
  useVideoOnly = false,
  videoPeak = 0.5,
  videoInhaleStart = 0,
  videoInhaleEnd = 0.45,
  videoExhaleStart = 0.65,
  videoExhaleEnd = 1.0,
  onCycleComplete, 
  onPhaseChange,
  onTick
}: BreathCanvasProps) {
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Resize observer for canvas
  useEffect(() => {
    if (patternId !== '4-7-8') return;
    const handleResize = () => {
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        canvasRef.current.width = canvasRef.current.clientWidth * dpr;
        canvasRef.current.height = canvasRef.current.clientHeight * dpr;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [patternId]);
  
  // Ref for mutable animation state
  const state = useRef<{
    phaseIdx: number;
    phaseStartTime: number;
    introStartTime?: number;
    armPos: number;
    elbowPos: number;
    headPos: number;
    waistPos: number;
    time: number;
    cycles: number;
    lastTime: number;
    particles: { x: number; y: number; size: number; speed: number; phaseOffset: number; }[];
  }>({
    phaseIdx: 0,
    phaseStartTime: performance.now(),
    armPos: 0,
    elbowPos: 0,
    headPos: 0,
    waistPos: 0,
    time: 0,
    cycles: 0,
    lastTime: performance.now(),
    particles: Array.from({length: 40}, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.05 + 0.02,
      phaseOffset: Math.random() * Math.PI * 2
    }))
  });

  useEffect(() => {
    state.current.phaseStartTime = performance.now();
    state.current.phaseIdx = 0;

    if (useVideoOnly) {
      if (videoRef.current) {
         if (running) {
            videoRef.current.currentTime = 0;
            videoRef.current.playbackRate = 1.0;
         } else {
            videoRef.current.playbackRate = 0.5;
         }
         videoRef.current.play().catch(e => console.log('Playback error:', e));
      }
    } else if (running && videoRef.current && videoRef.current.duration) {
      const vdur = videoRef.current.duration;
      const inStart = vdur * videoInhaleStart;
      const inEnd = vdur * videoInhaleEnd;
      const exStart = vdur * videoExhaleStart;
      const exEnd = vdur * videoExhaleEnd;
      const phase = phases[0];
      const startLabelEn = phaseLabels[0]?.label?.en;
      
      if (startLabelEn === "Inhale") {
         videoRef.current.currentTime = inStart;
         videoRef.current.playbackRate = Math.max(0.1, (inEnd - inStart) / (phase.dur / 1000));
      } else if (startLabelEn === "Exhale") {
         videoRef.current.currentTime = exStart;
         videoRef.current.playbackRate = Math.max(0.1, (exEnd - exStart) / (phase.dur / 1000));
      }
      
      videoRef.current.play().catch(e => console.log('Playback error:', e));
    } else if (!running && videoRef.current) {
      videoRef.current.playbackRate = 0.5;
      videoRef.current.play().catch(e => console.log('Playback error:', e));
    }
  }, [running, phases]);

  useEffect(() => {
    state.current.cycles = cycles;
  }, [cycles]);

  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      state.current.time += (now - state.current.lastTime) / 1000;
      state.current.lastTime = now;

      if (running) {
           if (state.current.introStartTime) state.current.introStartTime = 0;
           const elapsed = now - state.current.phaseStartTime;
           const phase = phases[state.current.phaseIdx];
           const progress = Math.min(elapsed / phase.dur, 1);
           const ep = easeInOutSine(progress);
           
           state.current.armPos = phase.armFrom + (phase.armTo - phase.armFrom) * ep;
           state.current.elbowPos = (phase.elbowFrom || 0) + ((phase.elbowTo || 0) - (phase.elbowFrom || 0)) * ep;
           state.current.headPos = (phase.headFrom || 0) + ((phase.headTo || 0) - (phase.headFrom || 0)) * ep;
           state.current.waistPos = (phase.waistFrom || 0) + ((phase.waistTo || 0) - (phase.waistFrom || 0)) * ep;
           
           if (onTick) {
             onTick(state.current.armPos);
           }
   
           if (progress >= 1) {
             state.current.phaseIdx = (state.current.phaseIdx + 1) % phases.length;
             state.current.phaseStartTime = now;
             const nextPhase = phases[state.current.phaseIdx];
             onPhaseChange(phaseLabels[state.current.phaseIdx], state.current.phaseIdx);
   
             if (state.current.phaseIdx === 0) {
               state.current.cycles++;
               onCycleComplete(state.current.cycles);
             }

             // Adjust video on phase change only to avoid rAF thrashing
             if (!useVideoOnly && videoRef.current && videoRef.current.duration) {
                const vdur = videoRef.current.duration;
                const nextLabelEn = phaseLabels[state.current.phaseIdx]?.label?.en;
                if (nextLabelEn === "Inhale") {
                    // Inhale
                    videoRef.current.currentTime = vdur * videoInhaleStart;
                    videoRef.current.playbackRate = Math.max(0.1, (vdur * videoInhaleEnd - vdur * videoInhaleStart) / (nextPhase.dur / 1000));
                    videoRef.current.play().catch(e => console.log('Play error:', e));
                } else if (nextLabelEn === "Exhale") {
                    // Exhale
                    videoRef.current.currentTime = vdur * videoExhaleStart;
                    videoRef.current.playbackRate = Math.max(0.1, (vdur * videoExhaleEnd - vdur * videoExhaleStart) / (nextPhase.dur / 1000));
                    videoRef.current.play().catch(e => console.log('Play error:', e));
                } else {
                    // Hold phase
                    videoRef.current.pause();
                }
             }
           }
        
      } else {
        // idle animation
        state.current.armPos = (Math.sin(state.current.time * 1.5) * 0.5 + 0.5) * 0.1;
      }

      if (patternId === '4-7-8' && canvasRef.current) {
         const ctx = canvasRef.current.getContext('2d');
         if (ctx) {
            const dpr = window.devicePixelRatio || 1;
            drawLotus(ctx, canvasRef.current.width, canvasRef.current.height, state.current.armPos, dpr);
         }
      }

            animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    onPhaseChange(phaseLabels[0], 0);

    return () => {
      cancelAnimationFrame(animId);
      
    };
  }, [running, onCycleComplete, onPhaseChange]);

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-transparent">
      {patternId === '4-7-8' ? (
        <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0 bg-transparent" />
      ) : (
        <video
           ref={videoRef}
           src={videoSrc || '/infinity_greeting.mp4'}
           autoPlay
           loop
           muted
           playsInline
           className="w-full h-full object-cover absolute inset-0 z-0 opacity-80"
        />
      )}
      
    </div>
  );
}
