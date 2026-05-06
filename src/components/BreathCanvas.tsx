import React, { useEffect, useRef, useState } from 'react';

import { BREATH_PATTERNS } from '../data/breathPatterns';

export interface PhaseDef {
  dur: number;
  armFrom: number;
  armTo: number;
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
  videoPeak?: number; // legacy
  videoInhaleStart?: number;
  videoInhaleEnd?: number;
  videoExhaleStart?: number;
  videoExhaleEnd?: number;
  isIntro?: boolean;
  onCycleComplete: (cycles: number) => void;
  onPhaseChange: (phase: PhaseLabel, index: number) => void;
  onTick?: (armPos: number) => void;
}

const B_COLORS: Record<string, { primary: string; secondary: string; aura: string }> = {
  '4-2-6-1': { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' },
  '4-7-8':   { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' },
  '5-5':     { primary: '#C5A059', secondary: '#E8C547', aura: '220, 190, 90' },
  'deep-bow-5-5': { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' },
  'tree-pose-5-5': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' },
  'tree-pose-left-5-5': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' },
  'lotus-bloom-5-5': { primary: '#8B5E3C', secondary: '#B98B53', aura: '185, 140, 85' },
  'bending-forward-5-5': { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' },
  'sleep-delta': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' },
  'sleep-classical': { primary: '#8B5E3C', secondary: '#B98B53', aura: '185, 140, 85' },
  'delta': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' }, // added delta for compatibility
  'sos-breath': { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' } // mapping sos-breath
};

export default function BreathCanvas({ 
  running, 
  audioEnabled = false,
  patternId = '4-2-6-1',
  phases = DEFAULT_PHASES,
  phaseLabels = DEFAULT_LABELS,
  cycles,
  videoSrc = '/raising_arms.mp4',
  videoPeak = 0.5,
  videoInhaleStart = 0,
  videoInhaleEnd = 0.45,
  videoExhaleStart = 0.65,
  videoExhaleEnd = 1.0,
  isIntro = false,
  onCycleComplete, 
  onPhaseChange,
  onTick
}: BreathCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Ref for mutable animation state
  const state = useRef<{
    phaseIdx: number;
    phaseStartTime: number;
    introStartTime?: number;
    armPos: number;
    time: number;
    cycles: number;
    lastTime: number;
    particles: { x: number; y: number; size: number; speed: number; phaseOffset: number; }[];
  }>({
    phaseIdx: 0,
    phaseStartTime: performance.now(),
    armPos: 0,
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

    if (running && videoRef.current && videoRef.current.duration) {
      const vdur = videoRef.current.duration;
      const inStart = vdur * videoInhaleStart;
      const inEnd = vdur * videoInhaleEnd;
      const exStart = vdur * videoExhaleStart;
      const phase = phases[0];
      videoRef.current.currentTime = isIntro ? 0 : inStart;
      
      if (isIntro) {
         videoRef.current.playbackRate = 1.0;
      } else if (phase.armFrom === 0 && phase.armTo === 1) {
         videoRef.current.playbackRate = Math.max(0.1, (inEnd - inStart) / (phase.dur / 1000));
      } else if (phase.armFrom === 1 && phase.armTo === 0) {
         videoRef.current.currentTime = exStart;
         videoRef.current.playbackRate = Math.max(0.1, (vdur - exStart) / (phase.dur / 1000));
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const tick = (now: number) => {
      state.current.time += (now - state.current.lastTime) / 1000;
      state.current.lastTime = now;

      if (running) {
        if (isIntro) {
           if (!state.current.introStartTime) state.current.introStartTime = now;
           const introElapsedMs = now - state.current.introStartTime;
           if (onTick) onTick(0);
           state.current.phaseStartTime = now; // Prevent phase progression
        } else {
           if (state.current.introStartTime) state.current.introStartTime = 0;
           const elapsed = now - state.current.phaseStartTime;
           const phase = phases[state.current.phaseIdx];
           const progress = Math.min(elapsed / phase.dur, 1);
           const ep = easeInOutSine(progress);
           
           state.current.armPos = phase.armFrom + (phase.armTo - phase.armFrom) * ep;
           
           if (onTick) {
             onTick(state.current.armPos);
           }
   
           if (progress >= 1) {
             state.current.phaseIdx = (state.current.phaseIdx + 1) % phases.length;
             state.current.phaseStartTime = now;
             onPhaseChange(phaseLabels[state.current.phaseIdx], state.current.phaseIdx);
   
             if (state.current.phaseIdx === 0) {
               state.current.cycles++;
               onCycleComplete(state.current.cycles);
             }
           }
        }
        
        // Continuous Video Synchronization
        if (videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
             const vdur = videoRef.current.duration;
             const inStart = vdur * videoInhaleStart;
             const inEnd = vdur * videoInhaleEnd;
             const exStart = vdur * videoExhaleStart;
             const exEnd = vdur * videoExhaleEnd;
             const currentPhase = phases[state.current.phaseIdx];
             
             let idealTime = 0;
             let expectedRate = 1;
             let isPaused = false;
             
             const curElapsed = now - state.current.phaseStartTime;
             const curProgress = Math.min(curElapsed / currentPhase.dur, 1);
             
             if (isIntro) {
                 const introElapsedMs = now - (state.current.introStartTime || now);
                 idealTime = (introElapsedMs / 1000);
                 if (idealTime > vdur * videoInhaleStart) idealTime = vdur * videoInhaleStart;
                 expectedRate = 1;
             } else if (currentPhase.dur > 0) {
                 if (currentPhase.armFrom === 0 && currentPhase.armTo === 1) {
                     idealTime = inStart + curProgress * (inEnd - inStart);
                     expectedRate = (inEnd - inStart) / (currentPhase.dur / 1000);
                 } else if (currentPhase.armFrom === 1 && currentPhase.armTo === 0) {
                     idealTime = exStart + curProgress * (exEnd - exStart);
                     expectedRate = (exEnd - exStart) / (currentPhase.dur / 1000);
                 } else if (currentPhase.armFrom === 1 && currentPhase.armTo === 1) {
                     idealTime = inEnd + curProgress * (exStart - inEnd);
                     if (exStart - inEnd < 0.1) {
                         isPaused = true;
                         idealTime = inEnd;
                     } else {
                         expectedRate = (exStart - inEnd) / (currentPhase.dur / 1000);
                     }
                 } else {
                     idealTime = 0;
                     isPaused = true;
                 }
             } else {
                 isPaused = true;
             }
             
             if (isPaused) {
                 if (!videoRef.current.paused) videoRef.current.pause();
                 if (Math.abs(videoRef.current.currentTime - idealTime) > 0.15) {
                     videoRef.current.currentTime = idealTime;
                 }
             } else {
                 if (videoRef.current.paused) {
                     videoRef.current.play().catch(e => console.log('Playback start error:', e));
                 }
                 
                 let timeDiff = idealTime - videoRef.current.currentTime;
                 
                 // Handle circular difference near the loop boundary
                 if (timeDiff > vdur / 2) timeDiff -= vdur;
                 if (timeDiff < -vdur / 2) timeDiff += vdur;
                 
                 // Force tight synchronization
                 if (Math.abs(timeDiff) > 0.2) {
                     videoRef.current.currentTime = idealTime;
                 } else {
                     // Adjust playback rate to close the gap smoothly
                     const correction = timeDiff * 3.0; 
                     const newRate = Math.max(0.1, Math.min(3.0, expectedRate + correction));
                     if (Math.abs(videoRef.current.playbackRate - newRate) > 0.1) {
                         videoRef.current.playbackRate = newRate;
                     }
                 }
             }
        }
      } else {
        // idle animation
        state.current.armPos = (Math.sin(state.current.time * 1.5) * 0.5 + 0.5) * 0.1;
      }

      // draw(ctx, canvas); // enable canvas rendering
      animId = requestAnimationFrame(tick);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const sc = Math.min(w / 140, h / 260); // Much better, hero is large but fits nicely
      const groundY = h/2 + (45 * sc); // Move character higher up to utilize top space
      
      const bTime = state.current.time;
      const pulse = Math.sin(bTime * 1.5) * 0.5 + 0.5;
      const breath = Math.sin(bTime * 0.9) * 0.5 + 0.5;
      const bArmPos = state.current.armPos;
      
      const pCol = B_COLORS[patternId] || B_COLORS['4-2-6-1'];
      const bAudioActive = audioEnabled; 
      const activePattern = BREATH_PATTERNS.find(p => p.id === patternId);
      const pulseFreq = activePattern?.audioConfig?.pulse || 6;
      const audioPulse = Math.sin(bTime * pulseFreq * Math.PI * 2) * 0.5 + 0.5;
      
      let visualArmPos = bArmPos;
      if (!running && bAudioActive) {
          visualArmPos = pulse * 0.3; // Gentle automatic pulse
      }

      // ── Atmospheric background (behind figure, untransformed) ──
      const auraIntense = (running || bAudioActive) ? (0.15 + (running ? bArmPos : pulse) * 0.15 + pulse * (bAudioActive ? 0.12 : 0.05)) : 0.08;
      const bgGrad = ctx.createRadialGradient(cx, groundY - h*0.2, 0, cx, groundY - h*0.2, Math.max(w,h)*0.8);
      bgGrad.addColorStop(0, `rgba(${pCol.aura}, ${auraIntense})`);
      bgGrad.addColorStop(0.4, `rgba(${pCol.aura}, 0.04)`);
      bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);

      if (running || bAudioActive) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < 3; i++) {
            const ringProg = (bTime * 0.25 + i * 0.33) % 1;
            const ringSc = ringProg * 1.5 * Math.max(w, h);
            const ringAlpha = Math.sin(ringProg * Math.PI) * (bAudioActive ? 0.15 : 0.12) * (visualArmPos > 0 ? Math.max(0.2, visualArmPos) : (running ? 0.2 : 0.4));
            
            let ringColor = `rgba(${pCol.aura}, ${ringAlpha})`;
            if (bAudioActive) {
               const hue = (performance.now() / 50 + i * 40) % 360;
               const pulsedAlpha = ringAlpha * (1 + audioPulse * 0.2); // Soft pulse in sync with binaural frequency
               ringColor = `hsla(${hue}, 60%, 75%, ${pulsedAlpha})`;
            }

            const ringGrad = ctx.createRadialGradient(cx, groundY - 60*sc, ringSc * 0.8, cx, groundY - 60*sc, ringSc);
            ringGrad.addColorStop(0, 'rgba(255,255,255,0)');
            ringGrad.addColorStop(0.5, ringColor);
            ringGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = ringGrad;
            ctx.beginPath();
            ctx.arc(cx, groundY - 60*sc, ringSc, 0, Math.PI*2);
            ctx.fill();
        }

        // ── Particles syncing with audio pulse ──
        if (bAudioActive) {
          ctx.fillStyle = `rgba(${pCol.aura}, ${0.2 + audioPulse * 0.15})`;
          state.current.particles.forEach((p) => {
            // Calculate current Y based on time and wrap around
            let currentY = (p.y - bTime * p.speed * 0.5) % 1;
            if (currentY < 0) currentY += 1;
            
            // Calculate current X with sway
            const sway = Math.sin(bTime * 0.8 + p.phaseOffset) * 0.05;
            let currentX = p.x + sway;
            if (currentX < 0) currentX += 1;
            if (currentX > 1) currentX -= 1;

            const rad = p.size * (1 + audioPulse * 0.2) * (w / 800);
            
            ctx.beginPath();
            ctx.arc(currentX * w, currentY * h, rad, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        ctx.restore();
      }

      // ── Horizon line (subtle, behind the figure) ──
      const horizonY = groundY + 56 * Math.min(w/220, h/300);
      const horG = ctx.createLinearGradient(0, horizonY, 0, horizonY + 24);
      horG.addColorStop(0, `rgba(${pCol.aura}, 0.15)`);
      horG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = horG;
      ctx.fillRect(0, horizonY, w, 24);
      ctx.strokeStyle = `rgba(${pCol.aura}, 0.10)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.max(0, cx - 180), horizonY);
      ctx.lineTo(Math.min(w, cx + 180), horizonY);
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, groundY);
      ctx.scale(sc, sc);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      // ── Ground reflection shadow (elliptical) ──
      const shG = ctx.createRadialGradient(0, 45, 0, 0, 45, 70);
      shG.addColorStop(0, 'rgba(20,30,40,0.35)');
      shG.addColorStop(0.6, 'rgba(20,30,40,0.12)');
      shG.addColorStop(1, 'rgba(20,30,40,0)');
      ctx.fillStyle = shG;
      ctx.beginPath(); ctx.ellipse(0, 45, 60 + pulse*5, 10 + pulse*2, 0, 0, Math.PI*2); ctx.fill();

      // ── Gravity axis (vertical light column) ──
      const axTop = -158, axBot = 78;
      const agGlow = ctx.createLinearGradient(0, axTop, 0, axBot);
      agGlow.addColorStop(0, `rgba(${pCol.aura}, 0)`);
      agGlow.addColorStop(0.5, `rgba(${pCol.aura}, 0.07)`);
      agGlow.addColorStop(1, `rgba(${pCol.aura}, 0)`);
      ctx.strokeStyle = agGlow; ctx.lineWidth = 22;
      ctx.beginPath(); ctx.moveTo(0, axTop); ctx.lineTo(0, axBot); ctx.stroke();
      const ag = ctx.createLinearGradient(0, axTop, 0, axBot);
      ag.addColorStop(0, 'rgba(230,200,90,0)');
      ag.addColorStop(0.5, `rgba(${pCol.aura}, ${0.3 + pulse*0.2})`);
      ag.addColorStop(1, 'rgba(230,200,90,0)');
      ctx.strokeStyle = ag; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, axTop); ctx.lineTo(0, axBot); ctx.stroke();

      // ── Earth globe ──
      const gR=44, gY=0;
      const lightAura = (running || bAudioActive) ? (0.25 + visualArmPos * 0.15 + pulse * (bAudioActive ? 0.15 : 0.05)) : 0.25;
      const atmG = ctx.createRadialGradient(0, gY, gR, 0, gY, gR+10);
      if (bAudioActive) {
          const hue = (performance.now() / 50) % 360;
          atmG.addColorStop(0, `hsla(${hue}, 60%, 75%, ${lightAura})`);
          atmG.addColorStop(1, `hsla(${(hue+40)%360}, 60%, 75%, 0)`);
      } else {
          atmG.addColorStop(0, `rgba(${pCol.aura}, ${lightAura})`);
          atmG.addColorStop(1, 'rgba(100,170,190,0)');
      }
      ctx.fillStyle = atmG;
      ctx.beginPath(); ctx.arc(0, gY, gR+10, 0, Math.PI*2); ctx.fill();
      const gg = ctx.createRadialGradient(-14, gY-12, 4, 0, gY+4, gR);
      gg.addColorStop(0, 'rgba(200,180,110,0.42)');
      gg.addColorStop(0.35, 'rgba(90,150,130,0.30)');
      gg.addColorStop(0.75, 'rgba(40,90,100,0.26)');
      gg.addColorStop(1, 'rgba(20,50,65,0.22)');
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(0, gY, gR, 0, Math.PI*2); ctx.fill();
      ctx.save();
      ctx.beginPath(); ctx.arc(0, gY, gR, 0, Math.PI*2); ctx.clip();
      const tGrad = ctx.createLinearGradient(-gR*0.2, 0, gR, 0);
      tGrad.addColorStop(0, 'rgba(10,20,35,0)');
      tGrad.addColorStop(1, 'rgba(10,20,35,0.35)');
      ctx.fillStyle = tGrad;
      ctx.fillRect(-gR, -gR, gR*2, gR*2);
      ctx.restore();
      ctx.fillStyle = 'rgba(180,150,70,0.12)';
      ctx.beginPath(); ctx.ellipse(-12, gY-5, 18, 12, -0.2, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(15, gY+8, 10, 8, 0.3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-8, gY+16, 7, 4, 0.1, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = 'rgba(180,220,220,0.22)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(0, gY, gR, -Math.PI*0.95, -Math.PI*0.35); ctx.stroke();
      ctx.fillStyle = 'rgba(255,250,230,0.12)';
      ctx.beginPath(); ctx.ellipse(-16, gY-14, 6, 3, -0.4, 0, Math.PI*2); ctx.fill();

      // Start phase ring rendering 
      if (running) {
        const phaseElapsed = performance.now() - state.current.phaseStartTime;
        const pP = Math.min(phaseElapsed / phases[state.current.phaseIdx].dur, 1);
        const aS = -Math.PI/2, aE = aS + pP*Math.PI*2;
        ctx.strokeStyle = `rgba(${pCol.aura}, 0.18)`;
        ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(0, gY, gR+7, aS, aE); ctx.stroke();
        ctx.strokeStyle = `rgba(${pCol.aura}, 0.8)`;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.arc(0, gY, gR+7, aS, aE); ctx.stroke();
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${pCol.aura})`;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(Math.cos(aE)*(gR+7), gY + Math.sin(aE)*(gR+7), 2.4, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Lotus legs ──
      const sY = -gR+5, pY = sY-8;
      ctx.fillStyle = 'rgba(20,35,30,0.4)';
      ctx.beginPath();
      ctx.ellipse(0, sY+22, 32, 5, 0, 0, Math.PI*2); ctx.fill();
      const legG = ctx.createLinearGradient(0, sY-5, 0, sY+25);
      legG.addColorStop(0, 'rgba(55,80,70,0.92)');
      legG.addColorStop(1, 'rgba(35,55,48,0.92)');
      ctx.fillStyle = legG;
      ctx.beginPath();
      ctx.moveTo(-32, sY+5);
      ctx.quadraticCurveTo(-37, sY+18, -27, sY+24);
      ctx.quadraticCurveTo(-5, sY+27, 0, sY+15);
      ctx.quadraticCurveTo(5, sY+27, 27, sY+24);
      ctx.quadraticCurveTo(37, sY+18, 32, sY+5);
      ctx.quadraticCurveTo(16, sY-2, 0, pY);
      ctx.quadraticCurveTo(-16, sY-2, -32, sY+5);
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,200,185,0.12)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-28, sY+8); ctx.quadraticCurveTo(0, sY-1, 28, sY+8); ctx.stroke();
      ctx.strokeStyle = 'rgba(20,35,28,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-22, sY+10); ctx.quadraticCurveTo(0, sY+22, 22, sY+10); ctx.stroke();

      // ── Torso ──
      const wY = pY-22, cY = wY-28, shY = cY-12;
      const robeG = ctx.createLinearGradient(-26, shY, 26, pY);
      robeG.addColorStop(0, 'rgba(48,72,65,0.88)');
      robeG.addColorStop(0.5, 'rgba(68,95,82,0.88)');
      robeG.addColorStop(1, 'rgba(42,65,58,0.88)');
      ctx.fillStyle = robeG;
      ctx.beginPath();
      ctx.moveTo(-24, pY);
      ctx.quadraticCurveTo(-27, wY, -26, cY);
      ctx.lineTo(-22, shY);
      ctx.lineTo(22, shY);
      ctx.lineTo(26, cY);
      ctx.quadraticCurveTo(27, wY, 24, pY);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(20,35,28,0.22)';
      ctx.beginPath();
      ctx.moveTo(12, shY); ctx.lineTo(22, shY);
      ctx.lineTo(26, cY); ctx.quadraticCurveTo(27, wY, 24, pY);
      ctx.lineTo(14, pY); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = 'rgba(20,35,28,0.3)'; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(0, shY+5); ctx.lineTo(0, pY); ctx.stroke();
      ctx.strokeStyle = 'rgba(180,200,185,0.10)'; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(-14, shY+4); ctx.quadraticCurveTo(-8, wY-10, -6, wY+2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(14, shY+4); ctx.quadraticCurveTo(8, wY-10, 6, wY+2); ctx.stroke();
      if (visualArmPos > 0.05) {
        ctx.fillStyle = `rgba(255,240,210,${visualArmPos*0.06})`;
        ctx.beginPath();
        ctx.ellipse(0, cY+2, 14 + visualArmPos*4, 8 + visualArmPos*3, 0, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.strokeStyle = 'rgba(220,190,140,0.35)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-20, shY+1);
      ctx.quadraticCurveTo(-4, shY+5, 0, shY+7);
      ctx.quadraticCurveTo(4, shY+5, 20, shY+1);
      ctx.stroke();

      // ── Arms ──
      const mY = wY+16;
      const aAng = visualArmPos*Math.PI, aL1 = 30, aL2 = 28;
      for (let side = -1; side <= 1; side += 2) {
        const sx = side*22, sy = shY+3, ang = Math.PI/2 - aAng;
        let baseEx = sx + Math.cos(ang)*side*aL1*0.7;
        let baseEy = sy + Math.sin(ang)*aL1;
        let baseHx = baseEx + Math.cos(ang)*side*aL2*0.5;
        let baseHy = baseEy + Math.sin(ang)*aL2*0.7;

        const holdWeight = Math.max(0, 1 - (visualArmPos / 0.25));
        const targetEx = side * 16, targetEy = sy + 22;
        const targetHx = side * 4, targetHy = mY;
        
        const eX = baseEx * (1 - holdWeight) + targetEx * holdWeight;
        const eY = baseEy * (1 - holdWeight) + targetEy * holdWeight;
        const hx = baseHx * (1 - holdWeight) + targetHx * holdWeight;
        const hy = baseHy * (1 - holdWeight) + targetHy * holdWeight;
        
        const slG = ctx.createLinearGradient(sx, sy, eX, eY);
        slG.addColorStop(0, `rgba(58,85,75,${0.72 + visualArmPos*0.12})`);
        slG.addColorStop(1, `rgba(45,68,60,${0.72 + visualArmPos*0.12})`);
        ctx.fillStyle = slG;
        ctx.beginPath();
        ctx.moveTo(sx - side*5.5, sy);
        ctx.lineTo(sx + side*5.5, sy);
        ctx.lineTo(eX + side*4, eY);
        ctx.lineTo(eX - side*4, eY);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = `rgba(180,200,185,${0.12 + visualArmPos*0.08})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sx - side*4, sy+2);
        ctx.lineTo(eX - side*3, eY-1);
        ctx.stroke();
        ctx.fillStyle = `rgba(40,60,52,${0.5 + visualArmPos*0.15})`;
        ctx.beginPath(); ctx.arc(eX, eY, 4.2, 0, Math.PI*2); ctx.fill();
        const faGrad = ctx.createLinearGradient(eX, eY, hx, hy);
        faGrad.addColorStop(0, `rgba(210,180,130,${0.65 + visualArmPos*0.18})`);
        faGrad.addColorStop(1, `rgba(190,160,110,${0.65 + visualArmPos*0.18})`);
        ctx.strokeStyle = faGrad; ctx.lineWidth = 3.8;
        ctx.beginPath(); ctx.moveTo(eX, eY); ctx.lineTo(hx, hy); ctx.stroke();
        ctx.fillStyle = `rgba(215,185,135,${0.55 + visualArmPos*0.22})`;
        ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = `rgba(140,105,65,${0.3 + visualArmPos*0.15})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.arc(hx, hy, 5, 0, Math.PI*2); ctx.stroke();
        if (visualArmPos > 0.1 && (running || bAudioActive)) {
          ctx.strokeStyle = `rgba(${pCol.aura},${visualArmPos*0.10})`;
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(eX, eY, hx, hy);
          ctx.stroke();
          ctx.strokeStyle = `rgba(220,240,250,${visualArmPos*0.18})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(eX, eY, hx, hy);
          ctx.stroke();
        }
      }

      // ── Mudra ──
      const mudraWeight = Math.max(0, 1 - (visualArmPos / 0.25));
      if (mudraWeight > 0) {
        ctx.save();
        ctx.globalAlpha = mudraWeight;
        const mYLocal = wY+16;
        const mG = ctx.createRadialGradient(0, mYLocal-1, 1, 0, mYLocal, 10);
        mG.addColorStop(0, 'rgba(220,190,140,0.55)');
        mG.addColorStop(1, 'rgba(180,150,100,0.3)');
        ctx.fillStyle = mG;
        ctx.beginPath(); ctx.ellipse(0, mYLocal, 10, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(150,115,75,0.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(0, mYLocal, 6, 0.15, Math.PI-0.15); ctx.stroke();
        ctx.fillStyle = `rgba(255,220,150,${0.08 + pulse*0.05})`;
        ctx.beginPath(); ctx.ellipse(0, mYLocal, 16, 8, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      // ── INFINITY SYMBOL ──
      const iY = cY+9, iR = 9, iW = 16;
      const iPulse = 0.5 + 0.5 * Math.sin(bTime * 3);
      const iGlow = ctx.createRadialGradient(0, iY, 0, 0, iY, iR * 2);
      iGlow.addColorStop(0, `rgba(${pCol.aura}, ${0.4 * iPulse})`);
      iGlow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = iGlow;
      ctx.beginPath(); ctx.ellipse(0, iY, iW, iR, 0, 0, Math.PI*2); ctx.fill();
      ctx.save();
      ctx.translate(0, iY);
      ctx.lineWidth = 1.6;
      const colors = ['#E8704A', '#E8A030', '#C8C040', '#50B870', '#40A0A8', '#6070C0', '#9860A8'];
      for (let i = 0; i < colors.length; i++) {
        const offset = (i - 3) * 0.5;
        ctx.strokeStyle = colors[i];
        ctx.globalAlpha = (0.3 + 0.7 * pulse) * (1 - Math.abs(i-3)/7);
        ctx.beginPath();
        ctx.moveTo(0, offset);
        ctx.bezierCurveTo(-iR*1.3, -iR+offset, -iR*1.3, iR+offset, 0, offset);
        ctx.bezierCurveTo(iR*1.3, -iR+offset, iR*1.3, iR+offset, 0, offset);
        ctx.stroke();
      }
      ctx.restore();

      // ── Halo ──
      const nY = shY-9, hdY = nY-20, hdR = 17, htop = hdY-hdR-7;
      if (running || bAudioActive) {
        const haloA = 0.10 + visualArmPos*0.12 + pulse*0.03;
        const haloG = ctx.createRadialGradient(0, hdY, 0, 0, hdY, hdR+22);
        haloG.addColorStop(0, `rgba(${pCol.aura}, ${haloA})`);
        haloG.addColorStop(0.5, `rgba(${pCol.aura}, ${haloA*0.5})`);
        haloG.addColorStop(1, 'rgba(220,200,140,0)');
        ctx.fillStyle = haloG;
        ctx.beginPath(); ctx.arc(0, hdY, hdR+22, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = `rgba(${pCol.aura}, ${0.18 + pulse*0.08})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(0, hdY-2, hdR+6, -Math.PI*0.85, -Math.PI*0.15); ctx.stroke();
      }

      // ── Head ──
      const nkG = ctx.createLinearGradient(-6, nY, 6, shY);
      nkG.addColorStop(0, 'rgba(210,180,130,0.78)');
      nkG.addColorStop(1, 'rgba(175,145,100,0.78)');
      ctx.fillStyle = nkG;
      ctx.fillRect(-5.5, nY, 11, shY-nY);
      ctx.fillStyle = 'rgba(100,70,45,0.25)';
      ctx.fillRect(2, nY, 3.5, shY-nY);
      const hoodG = ctx.createLinearGradient(-26, hdY, 26, shY);
      hoodG.addColorStop(0, 'rgba(50,72,65,0.88)');
      hoodG.addColorStop(0.5, 'rgba(70,95,82,0.88)');
      hoodG.addColorStop(1, 'rgba(45,68,60,0.88)');
      ctx.fillStyle = hoodG;
      ctx.beginPath();
      ctx.moveTo(-24, shY);
      ctx.quadraticCurveTo(-26, nY-5, -22, hdY);
      ctx.quadraticCurveTo(-17, htop, 0, htop-3);
      ctx.quadraticCurveTo(17, htop, 22, hdY);
      ctx.quadraticCurveTo(26, nY-5, 24, shY);
      ctx.fill();
      ctx.strokeStyle = 'rgba(20,35,28,0.25)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-20, shY-2);
      ctx.quadraticCurveTo(-22, hdY+5, -15, hdY-5);
      ctx.quadraticCurveTo(0, hdY-hdR-2, 15, hdY-5);
      ctx.quadraticCurveTo(22, hdY+5, 20, shY-2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(180,200,185,0.12)'; ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-17, hdY-2);
      ctx.quadraticCurveTo(0, hdY-hdR-1, 17, hdY-2);
      ctx.stroke();
      const faceG = ctx.createRadialGradient(-3, hdY-4, 2, 0, hdY, hdR);
      faceG.addColorStop(0, 'rgba(230,200,155,0.78)');
      faceG.addColorStop(0.65, 'rgba(200,170,120,0.72)');
      faceG.addColorStop(1, 'rgba(160,125,80,0.65)');
      ctx.fillStyle = faceG;
      ctx.beginPath(); ctx.arc(0, hdY, hdR-3, -0.3, Math.PI+0.3); ctx.fill();
      ctx.fillStyle = 'rgba(90,60,35,0.18)';
      ctx.beginPath(); ctx.arc(0, hdY, hdR-3, -0.3, Math.PI*0.4); ctx.fill();
      ctx.strokeStyle = 'rgba(60,40,25,0.55)'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(-8, hdY+1); ctx.quadraticCurveTo(-5.5, hdY+3.5, -3, hdY+1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3, hdY+1); ctx.quadraticCurveTo(5.5, hdY+3.5, 8, hdY+1); ctx.stroke();
      ctx.strokeStyle = 'rgba(60,40,25,0.15)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(-8.5, hdY); ctx.quadraticCurveTo(-5.5, hdY+2.5, -2.5, hdY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2.5, hdY); ctx.quadraticCurveTo(5.5, hdY+2.5, 8.5, hdY); ctx.stroke();
      ctx.strokeStyle = 'rgba(100,70,45,0.18)'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(0, hdY+2); ctx.quadraticCurveTo(0.5, hdY+5, 0, hdY+6); ctx.stroke();
      ctx.strokeStyle = 'rgba(120,75,55,0.3)'; ctx.lineWidth = 0.9;
      ctx.beginPath(); ctx.moveTo(-4.5, hdY+7.5); ctx.quadraticCurveTo(0, hdY+9.5, 4.5, hdY+7.5); ctx.stroke();
      if (running) {
        const tE = ctx.createRadialGradient(0, hdY-5, 0, 0, hdY-5, 4);
        tE.addColorStop(0, `rgba(255,220,140,${0.5 + pulse*0.25})`);
        tE.addColorStop(1, 'rgba(255,220,140,0)');
        ctx.fillStyle = tE;
        ctx.beginPath(); ctx.arc(0, hdY-5, 4, 0, Math.PI*2); ctx.fill();
      }

      // ── Tantien ──
      const tY = wY+9;
      const tgOut = ctx.createRadialGradient(0, tY, 4, 0, tY, 22 + breath*8);
      tgOut.addColorStop(0, `rgba(80,200,160,${0.18 + visualArmPos*0.12})`);
      tgOut.addColorStop(0.5, `rgba(80,200,160,${0.08 + visualArmPos*0.06})`);
      tgOut.addColorStop(1, 'rgba(80,200,160,0)');
      ctx.fillStyle = tgOut;
      ctx.beginPath(); ctx.arc(0, tY, 22 + breath*8, 0, Math.PI*2); ctx.fill();
      const tgIn = ctx.createRadialGradient(0, tY, 0, 0, tY, 8 + pulse*3);
      tgIn.addColorStop(0, `rgba(255,240,200,${0.25 + visualArmPos*0.15})`);
      tgIn.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = tgIn;
      ctx.beginPath(); ctx.arc(0, tY, 8 + pulse*3, 0, Math.PI*2); ctx.fill();

      // ── Aura ──
      if ((running || bAudioActive) && visualArmPos > 0.15) {
        const aurColors = [
          [168,213,220], [210,210,210], [230,200,120], [180,180,190]
        ];
        const col = running ? aurColors[state.current.phaseIdx] : [168,213,220];
        for (let i = 0; i < 4; i++) {
          const rr = ((bTime*6 + i*35) % 155);
          const ra = Math.max(0, 1 - rr/155) * visualArmPos * 0.07;
          ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${ra})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.arc(0, cY-5, rr, 0, Math.PI*2); ctx.stroke();
        }
      }

      // ── Breath particles ──
      if (running) {
        const rising = state.current.phaseIdx === 0 || state.current.phaseIdx === 1;
        for (let i = 0; i < 6; i++) {
          const phaseOff = i * 1.3;
          const prog = ((bTime*0.5 + phaseOff) % 3) / 3;
          const px = Math.sin(bTime*0.7 + i*2.1) * (24 + i*3);
          const py = rising ? cY - prog*80 : cY - 80 + prog*80;
          const pa = Math.sin(prog*Math.PI) * 0.35 * bArmPos;
          ctx.fillStyle = rising ? `rgba(220,240,250,${pa})` : `rgba(255,225,175,${pa})`;
          ctx.beginPath(); ctx.arc(px, py, 1.2 + Math.sin(prog*Math.PI)*0.8, 0, Math.PI*2); ctx.fill();
        }
      }

      // ── Stars ──
      for (let i = 0; i < 18; i++) {
        const sx2 = Math.sin(i*2.1 + bTime*0.06) * (140 + i*4);
        const sy2 = -165 - i*8 + Math.cos(i*1.5) * 40;
        const twinkle = 0.08 + Math.sin(bTime*1.3 + i*0.7) * 0.07;
        const sz = 1.0 + (i % 3) * 0.4;
        ctx.fillStyle = `rgba(220,230,240,${Math.max(0.03, twinkle)})`;
        ctx.beginPath(); ctx.arc(sx2, sy2, sz, 0, Math.PI*2); ctx.fill();
        if (i % 5 === 0) {
          ctx.strokeStyle = `rgba(220,230,240,${twinkle*0.7})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(sx2-sz*2, sy2); ctx.lineTo(sx2+sz*2, sy2);
          ctx.moveTo(sx2, sy2-sz*2); ctx.lineTo(sx2, sy2+sz*2);
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(tick);
    onPhaseChange(phaseLabels[0], 0);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [running, onCycleComplete, onPhaseChange]);

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden bg-[#061114]">
      <video
         ref={videoRef}
         src={videoSrc || '/raising_arms.mp4'}
         autoPlay
         loop
         muted
         playsInline
         className="w-full h-full object-contain"
         style={{ filter: "brightness(0.8) contrast(1.15)" }}
      />
      <canvas 
        ref={canvasRef} 
        className="hidden"
      />
    </div>
  );
}
