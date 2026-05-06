import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface HeroMeditatorProps {
  mode?: 'idle' | 'breath' | 'sway' | 'grounding';
  posture?: 'sitting' | 'standing';
  armPos?: number; // 0 to 1 for breath mode arms
  audioActive?: boolean;
  className?: string;
  themeColor?: { primary: string; secondary: string; aura: string };
  runAnimation?: boolean;
  language?: 'el' | 'en';
}

export const THEME_COLORS = {
  emerald: { primary: '#4B7351', secondary: '#7A9E7E', aura: '122, 158, 126' }, // Sage/body
  orange: { primary: '#9e5033', secondary: '#C07050', aura: '192, 112, 80' },   // Terra/breath
  amber: { primary: '#A6731B', secondary: '#C8922A', aura: '200, 146, 42' },  // Gold/focus
  violet: { primary: '#8676A3', secondary: '#B5A7D0', aura: '181, 167, 208' },  // Lavender/space
  teal: { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' },
  rose: { primary: '#9B5B5A', secondary: '#C48180', aura: '180, 80, 80' },
  indigo: { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' },
  default: { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' },
  sky: { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' }, // added sky
  cyan: { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' } // added cyan
};

export default function HeroMeditator({
  mode = 'idle',
  posture = 'sitting',
  armPos = 0,
  audioActive = false,
  className,
  themeColor = THEME_COLORS.default,
  runAnimation = true,
  language = 'el'
}: HeroMeditatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // mutable animation state
  const state = useRef({
    time: 0
  });

  const propsRef = useRef({ mode, posture, armPos, audioActive, themeColor, runAnimation, language });
  useEffect(() => {
    propsRef.current = { mode, posture, armPos, audioActive, themeColor, runAnimation, language };
  }, [mode, posture, armPos, audioActive, themeColor, runAnimation, language]);

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

    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      let dt = (now - lastTime) / 1000;
      if (dt > 1) dt = 0; // prevent huge jumps on tab switch
      lastTime = now;
      
      const ps = propsRef.current;
      if (ps.runAnimation) {
        state.current.time += dt;
      }
      
      draw(ctx, canvas, ps);
      animId = requestAnimationFrame(tick);
    };

    const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, ps: any) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const sc = Math.min(w / 140, h / 260); // scale
      const groundY = h/2 + (55 * sc); 
      
      const bTime = state.current.time;
      const pulse = Math.sin(bTime * 1.5) * 0.5 + 0.5;
      
      const pCol = ps.themeColor;
      
      // Determine structural values based on mode
      let currentArmPos = ps.mode === 'breath' ? ps.armPos : (Math.sin(bTime * 1.5) * 0.5 + 0.5) * 0.05;
      let swayAngle = 0;
      let showMetronome = false;
      let forceAxis = ps.mode === 'grounding';
      let swaySpeed = Math.PI * 2; // ~1 second full cycle

      if (ps.mode === 'sway') {
        swayAngle = Math.sin(bTime * swaySpeed) * 0.16;
        showMetronome = true;
      } else if (ps.mode === 'idle') {
        swayAngle = Math.sin(bTime * 0.3) * 0.01; // tiny sway
      } else if (ps.mode === 'grounding') {
        swayAngle = 0;
      }

      // ── Cosmic Background (Celestial Sky, Earth, Sun, Moon) ──
      // Night sky base
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0a1a2f'); // Deep space blue at top
      skyGrad.addColorStop(1, '#112233'); // Slightly lighter at bottom
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const randomSeed = 1234; // deterministic pseudo-random for stars
      let seed = randomSeed;
      const srnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
      for (let i = 0; i < 60; i++) {
        const sx = srnd() * w;
        const sy = srnd() * h * 0.8;
        const sSize = srnd() * 1.5;
        const sOpacity = srnd() * 0.5 + 0.1;
        ctx.fillStyle = `rgba(255, 255, 255, ${sOpacity})`;
        ctx.beginPath(); ctx.arc(sx, sy, sSize, 0, Math.PI * 2); ctx.fill();
      }

      // Cosmic Text (Always at the top)
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'italic 500 12px "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
      ctx.shadowBlur = 8;
      const titleText = ps.language === 'en' ? 'Neurodivergent Mindfulness' : 'Νευροδιαφορετική Ενσυνειδητότητα';
      ctx.fillText(titleText, w / 2, h * 0.3); // Moved lower to sit between celestial bodies and quote
      ctx.shadowBlur = 0;

      // Celestial Bodies
      ctx.save();
      ctx.translate(cx, groundY);
      ctx.scale(sc, sc);

      // Earth at the bottom (below the hero's pivot)
      ctx.beginPath();
      ctx.arc(0, 20, 60, 0, Math.PI * 2);
      const earthGrad = ctx.createRadialGradient(-15, 0, 10, 0, 20, 60);
      earthGrad.addColorStop(0, '#558833'); // green landmass highlight
      earthGrad.addColorStop(0.5, '#115588'); // ocean blue
      earthGrad.addColorStop(1, '#001133'); // dark edge
      ctx.fillStyle = earthGrad;
      ctx.fill();
      // Earth glow
      ctx.shadowColor = '#4488ff';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Vertical golden line shooting up from earth
      ctx.strokeStyle = 'rgba(255, 220, 100, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 20); // Center of earth
      ctx.lineTo(0, -200); // Shooting up
      ctx.stroke();

      // Moon on the left (-90, -180)
      ctx.beginPath();
      ctx.arc(-80, -160, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#fffae6';
      ctx.shadowColor = '#fffae6';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Cutout for crescent
      ctx.beginPath();
      ctx.arc(-73, -163, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#0a1a2f'; // Match deep space blue at the top
      ctx.fill();

      // Sun on the right (90, -180)
      ctx.beginPath();
      ctx.arc(80, -160, 14, 0, Math.PI * 2);
      const sunGrad = ctx.createRadialGradient(80, -160, 5, 80, -160, 14);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.5, '#ffdd44');
      sunGrad.addColorStop(1, '#ff8800');
      ctx.fillStyle = sunGrad;
      ctx.shadowColor = '#ffaa00';
      ctx.shadowBlur = 25;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Sun rays
      ctx.strokeStyle = 'rgba(255, 200, 50, 0.8)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const ag = (i / 8) * Math.PI * 2 + (bTime * 0.2); // subtle rotation
        ctx.beginPath();
        ctx.moveTo(80 + Math.cos(ag) * 16, -160 + Math.sin(ag) * 16);
        ctx.lineTo(80 + Math.cos(ag) * 22, -160 + Math.sin(ag) * 22);
        ctx.stroke();
      }

      ctx.restore();

      // ── Background atmospheric aura (over the background) ──
      if (ps.mode !== 'sway') {
          const auraIntense = 0.1 + (pulse * 0.05);
          const bgGrad = ctx.createRadialGradient(cx, groundY - h*0.2, 0, cx, groundY - h*0.2, Math.max(w,h)*0.8);
          bgGrad.addColorStop(0, `rgba(${pCol.aura}, ${auraIntense})`);
          bgGrad.addColorStop(0.4, `rgba(${pCol.aura}, 0.02)`);
          bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, w, h);
      }

      ctx.save();
      ctx.translate(cx, groundY);
      ctx.scale(sc, sc);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      // ── Ground reflection shadow ──
      const shG = ctx.createRadialGradient(0, -5, 0, 0, -5, 70);
      shG.addColorStop(0, 'rgba(20,30,40,0.3)');
      shG.addColorStop(1, 'rgba(20,30,40,0)');
      ctx.fillStyle = shG;
      ctx.beginPath(); ctx.ellipse(0, -5, 60 + pulse*5, 10 + pulse*2, 0, 0, Math.PI*2); ctx.fill();

      // PIVOT POINT for Swaying
      const pivotY = ps.posture === 'standing' ? -5 : -33; // ankles if standing, pelvis if sitting

      // ── Gravity axis BASE (below pivot) ──
      const axTop = -158, axBot = 78;
      if (forceAxis || ps.mode === 'sway' || ps.mode === 'idle') {
          const agDn = ctx.createLinearGradient(0, pivotY, 0, axBot);
          agDn.addColorStop(0, `rgba(${pCol.aura}, 0.4)`);
          agDn.addColorStop(1, `rgba(${pCol.aura}, 0.1)`);
          ctx.strokeStyle = agDn; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(0, pivotY); ctx.lineTo(0, axBot); ctx.stroke();
          // Arrow down
          ctx.fillStyle = `rgba(${pCol.aura}, 0.2)`;
          ctx.beginPath(); ctx.moveTo(0, axBot+4); ctx.lineTo(-5, axBot-6); ctx.lineTo(5, axBot-6); ctx.closePath(); ctx.fill();
      } else {
          const agGlow = ctx.createLinearGradient(0, axTop, 0, axBot);
          agGlow.addColorStop(0.5, `rgba(${pCol.aura}, 0.05)`);
          agGlow.addColorStop(1, `rgba(${pCol.aura}, 0)`);
          ctx.strokeStyle = agGlow; ctx.lineWidth = 22;
          ctx.beginPath(); ctx.moveTo(0, axTop); ctx.lineTo(0, axBot); ctx.stroke();
          const ag = ctx.createLinearGradient(0, axTop, 0, axBot);
          ag.addColorStop(0.5, `rgba(${pCol.aura}, ${0.2 + pulse*0.1})`);
          ag.addColorStop(1, `rgba(${pCol.aura}, 0)`);
          ctx.strokeStyle = ag; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(0, axTop); ctx.lineTo(0, axBot); ctx.stroke();
      }

      // ── Metronome Background ──
      if (showMetronome) {
         const mBot = -5, mTop = -180;
         ctx.strokeStyle = `rgba(180,200,190,0.1)`; ctx.lineWidth = 1.5;
         ctx.beginPath(); ctx.moveTo(-60, mBot); ctx.lineTo(-20, mTop); ctx.quadraticCurveTo(0, mTop-15, 20, mTop); ctx.lineTo(60, mBot); ctx.closePath(); ctx.stroke();
         for(let i=-5; i<=5; i++) {
             const angle = -Math.PI/2 + i*0.065;
             const r1=80, r2=88;
             ctx.strokeStyle = `rgba(${pCol.aura}, ${i===0? 0.3 : 0.1})`;
             ctx.beginPath(); ctx.moveTo(Math.cos(angle)*r1, pivotY + Math.sin(angle)*r1); ctx.lineTo(Math.cos(angle)*r2, pivotY + Math.sin(angle)*r2); ctx.stroke();
         }
      }

      const tS = ps.posture === 'sitting' ? 0.85 : 1; 
      const pelvisY = ps.posture === 'standing' ? -44 : -2;
      const chestY = pelvisY - 26*tS;
      const neckY = chestY - 18*tS;
      const headY = neckY - 15*tS;
      const shoulderW = 16 * tS;
      const hipW = 10;

      const cPrimary = pCol.primary;
      const cSecondary = pCol.secondary;
      const skinCol = '#DCA77A';
      const jointGlow = `rgba(${pCol.aura}, 0.95)`;

      const drawSeg = (x1, y1, x2, y2, w_in, col) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = w_in;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };
      
      const drawJoint = (x: any, y: any, r: any, glow: any) => {
        // joints hidden by request
      };

      // ── LEGS (Fixed in position) ──
      let legs = [];
      for (let side = -1; side <= 1; side += 2) {
        let hx = side * hipW, hy = pelvisY;
        let kx, ky, ax, ay, tx, ty; 
        if (ps.posture === 'standing') {
           kx = side * 11; ky = pelvisY + 22;
           ax = side * 12; ay = -4; 
           tx = side * 14; ty = 0;
        } else { 
           kx = side * 22; ky = pelvisY + 16;
           ax = side * 6;  ay = pelvisY + 22;
           tx = side * 2;  ty = pelvisY + 26;
        }
        legs.push({side, hx, hy, kx, ky, ax, ay, tx, ty});
      }

      legs.forEach(leg => {
         drawSeg(leg.hx, leg.hy, leg.kx, leg.ky, 14.5, cSecondary);
         drawSeg(leg.kx, leg.ky, leg.ax, leg.ay, 11, cPrimary);
         drawSeg(leg.ax, leg.ay, leg.tx, leg.ty, 6, skinCol);
      });

      // ==========================================
      // ANATOMY & RIGGING (SWAY CONTEXT FOR UPPER BODY)
      // ==========================================
      ctx.save();
      ctx.translate(0, pivotY);
      ctx.rotate(swayAngle);
      ctx.translate(0, -pivotY);

      // Upper axis for sway/grounding modes
      if (forceAxis || ps.mode === 'sway' || ps.mode === 'idle') {
          const agUp = ctx.createLinearGradient(0, pivotY, 0, axTop);
          agUp.addColorStop(0, `rgba(${pCol.aura}, 0.5)`);
          agUp.addColorStop(1, `rgba(${pCol.aura}, 0.1)`);
          ctx.strokeStyle = agUp; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(0, pivotY); ctx.lineTo(0, axTop); ctx.stroke();
          ctx.strokeStyle = `rgba(${pCol.aura}, 0.05)`; ctx.lineWidth = 10;
          ctx.beginPath(); ctx.moveTo(0, pivotY); ctx.lineTo(0, axTop); ctx.stroke();
          ctx.fillStyle = `rgba(${pCol.aura}, 0.3)`;
          ctx.beginPath(); ctx.moveTo(0, axTop-4); ctx.lineTo(-4, axTop+10); ctx.lineTo(4, axTop+10); ctx.fill();
      }

      // ── TORSO ──
      const torsoG = ctx.createLinearGradient(0, neckY, 0, pelvisY);
      torsoG.addColorStop(0, cPrimary);
      torsoG.addColorStop(1, cSecondary);
      
      ctx.fillStyle = torsoG;
      ctx.beginPath();
      ctx.moveTo(-shoulderW - 2, neckY);
      ctx.lineTo( shoulderW + 2, neckY);
      ctx.quadraticCurveTo( shoulderW - 4, chestY,  hipW + 5, pelvisY);
      ctx.quadraticCurveTo( 0, pelvisY + 4, -hipW - 5, pelvisY);
      ctx.quadraticCurveTo(-shoulderW + 4, chestY, -shoulderW - 2, neckY);
      ctx.fill();

      // deleted v-neck lines

      // ── Rainbow Infinity ──
      const infY = chestY + 6;
      const scaleInf = 5.5;
      const rGrad = ctx.createLinearGradient(-scaleInf, 0, scaleInf, 0);
      ['#ef4444','#f59e0b','#eab308','#22c55e','#3b82f6','#a855f7'].forEach((c, i) => rGrad.addColorStop(i*0.2, c));
      ctx.save();
      ctx.translate(0, infY);
      ctx.strokeStyle = rGrad;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(255,255,255,0.2)';
      ctx.shadowBlur = 3;
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2.05; t += 0.05) {
        const x = (scaleInf * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
        const y = (scaleInf * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t));
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // ── ARMS ──
      const mY = pelvisY + 12; 
      const aAng = currentArmPos*Math.PI, aL1 = 28*tS, aL2 = 25*tS;
      let arms = [];
      for (let side = -1; side <= 1; side += 2) {
        const sx = side * shoulderW, sy = neckY + 4;
        const ang = Math.PI/2 - aAng; 
        const baseEx = sx + Math.cos(ang)*side*aL1*0.7;
        const baseEy = sy + Math.sin(ang)*aL1;
        const baseHx = baseEx + Math.cos(ang)*side*aL2*0.5;
        const baseHy = baseEy + Math.sin(ang)*aL2*0.8;

        const holdWeight = Math.max(0, 1 - (currentArmPos / 0.25));
        let targetEx = side * 18, targetEy = sy + 25;
        let targetHx = side * 4, targetHy = mY;

        if (ps.mode === 'sway') {
            const kx = ps.posture === 'standing' ? side * 11 : side * 24;
            const ky = ps.posture === 'standing' ? pelvisY + 22 : pelvisY + 15;
            
            // Anti-sway to visually lock hands to the stationary lower body.
            const dy = ky - pivotY;
            targetHx = kx * Math.cos(-swayAngle) - dy * Math.sin(-swayAngle);
            targetHy = pivotY + kx * Math.sin(-swayAngle) + dy * Math.cos(-swayAngle);
            targetEx = (sx + targetHx) / 2 + side * 12;
            targetEy = (sy + targetHy) / 2 + 5;
        }
        
        arms.push({
          side, sx, sy, 
          ex: baseEx * (1 - holdWeight) + targetEx * holdWeight,
          ey: baseEy * (1 - holdWeight) + targetEy * holdWeight,
          hx: baseHx * (1 - holdWeight) + targetHx * holdWeight,
          hy: baseHy * (1 - holdWeight) + targetHy * holdWeight
        });
      }

      arms.forEach(arm => {
        drawSeg(arm.sx, arm.sy, arm.ex, arm.ey, 10.5, cPrimary);
        drawSeg(arm.ex, arm.ey, arm.hx, arm.hy, 8.5, cSecondary);
        drawSeg(arm.hx, arm.hy, arm.hx + arm.side*3, arm.hy + 5, 5, skinCol);
      });

      if (currentArmPos > 0.05 && ps.audioActive) {
        ctx.fillStyle = `rgba(255,240,210,${currentArmPos*0.06})`;
        ctx.beginPath(); ctx.ellipse(0, mY - 4, 14 + currentArmPos*4, 8 + currentArmPos*3, 0, 0, Math.PI*2); ctx.fill();
      }

      // ── HEAD & NECK ──
      drawSeg(0, neckY, 0, headY, 10.5, skinCol);
      
      // High T-shirt collar
      ctx.fillStyle = cPrimary;
      ctx.beginPath();
      // Draw a rectangle over the lower neck
      ctx.fillRect(-6.5, neckY - 8, 13, 8);
      // Give it a slightly curved top
      ctx.ellipse(0, neckY - 8, 6.5, 3.5, 0, 0, Math.PI*2);
      ctx.fill();
      
      if (ps.mode === 'breath' || ps.audioActive) {
        const haloA = 0.10 + currentArmPos*0.12 + pulse*0.03;
        const hdR = 15;
        const haloG = ctx.createRadialGradient(0, headY, 0, 0, headY, hdR+25);
        haloG.addColorStop(0, `rgba(${pCol.aura}, ${haloA})`);
        haloG.addColorStop(1, 'rgba(220,200,140,0)');
        ctx.fillStyle = haloG;
        ctx.beginPath(); ctx.arc(0, headY, hdR+25, 0, Math.PI*2); ctx.fill();
      }

      ctx.fillStyle = cSecondary; 
      ctx.beginPath(); ctx.arc(0, headY, 15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = skinCol;
      ctx.beginPath(); ctx.arc(0, headY+2, 13, -0.2, Math.PI+0.2); ctx.fill();
      ctx.strokeStyle = 'rgba(60,40,25,0.6)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-7, headY+2); ctx.quadraticCurveTo(-4, headY+4.5, -1, headY+2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1, headY+2); ctx.quadraticCurveTo(4, headY+4.5, 7, headY+2); ctx.stroke();

      // ── TANTIEN (Center of Gravity) ── 
      const tY = pelvisY - 5;
      const tgOut = ctx.createRadialGradient(0, tY, 4, 0, tY, 18 + pulse*5);
      tgOut.addColorStop(0, `rgba(80,200,160,${0.18 + currentArmPos*0.12})`);
      tgOut.addColorStop(1, 'rgba(80,200,160,0)');
      ctx.fillStyle = tgOut;
      ctx.beginPath(); ctx.arc(0, tY, 18 + pulse*5, 0, Math.PI*2); ctx.fill();
      
      const tgIn = ctx.createRadialGradient(0, tY, 0, 0, tY, 6 + pulse*3);
      tgIn.addColorStop(0, `rgba(255,240,200,${0.25 + currentArmPos*0.15})`);
      tgIn.addColorStop(1, 'rgba(255,240,200,0)');
      ctx.fillStyle = tgIn;
      ctx.beginPath(); ctx.arc(0, tY, 6 + pulse*3, 0, Math.PI*2); ctx.fill();

      ctx.restore(); // Restore sway rotation

      if (ps.mode === 'sway') {
          const tickAngle = -Math.PI/2 + Math.round(swayAngle/0.065)*0.065;
          const tr=80;
          const tx = Math.cos(tickAngle)*tr;
          const ty = pivotY + Math.sin(tickAngle)*tr;
          ctx.fillStyle = `rgba(240,220,140,0.5)`;
          ctx.beginPath(); ctx.arc(tx, ty, 3, 0, Math.PI*2); ctx.fill();
          
          const swing = Math.sin(bTime * swaySpeed);
          const arrowA = 0.15;
          ctx.fillStyle = `rgba(${pCol.aura}, ${arrowA * (swing < 0 ? 0.3 + Math.abs(swing): 0.1)})`;
          ctx.beginPath(); ctx.moveTo(-65, pivotY); ctx.lineTo(-50, pivotY-7); ctx.lineTo(-50, pivotY+7); ctx.closePath(); ctx.fill();
          ctx.fillStyle = `rgba(${pCol.aura}, ${arrowA * (swing > 0 ? 0.3 + Math.abs(swing): 0.1)})`;
          ctx.beginPath(); ctx.moveTo(65, pivotY); ctx.lineTo(50, pivotY-7); ctx.lineTo(50, pivotY+7); ctx.closePath(); ctx.fill();
      }

      ctx.restore(); // Restore main transform
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn("w-full h-full object-contain pointer-events-none", className)} 
    />
  );
}
