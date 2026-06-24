import React, { useEffect, useRef, useMemo } from 'react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';

// --- Helper Functions ---
function aN(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function aSN(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  return aN(ix, iy) + (aN(ix + 1, iy) - aN(ix, iy)) * sx + (aN(ix, iy + 1) - aN(ix, iy)) * sy + (aN(ix, iy) - aN(ix + 1, iy) - aN(ix, iy + 1) + aN(ix + 1, iy + 1)) * sx * sy;
}

function aFbm(x: number, y: number, o: number = 4) {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < o; i++) {
    v += a * aSN(x * f, y * f);
    a *= 0.5; f *= 2;
  }
  return v;
}

export default function CoreGeometricState() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { logs } = useActivityTracker();
  const { language } = useLanguage();
  const { reduceMotion } = useAccessibility();

  const activeAxes = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter(l => l.timestamp.split('T')[0] === today);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(l => new Date(l.timestamp) >= last7Days);

    const check = (logsArray: any[], categories: string[]) => 
      logsArray.some(l => categories.includes(l.category));

    return {
      body: check(todayLogs, ['grounding', 'movement', 'swaying', 'yoga']),
      bodySoft: check(recentLogs, ['grounding', 'movement', 'swaying', 'yoga']),
      
      breath: check(todayLogs, ['breath', 'vocal']),
      breathSoft: check(recentLogs, ['breath', 'vocal']),
      
      attention: check(todayLogs, ['checkin', 'microdose', 'journal']),
      attentionSoft: check(recentLogs, ['checkin', 'microdose', 'journal']),
      
      space: check(todayLogs, ['rabbithole', 'chapter', 'sanctuary', 'vocal']),
      spaceSoft: check(recentLogs, ['rabbithole', 'chapter', 'sanctuary', 'vocal']),
    };
  }, [logs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let aTime = 0;
    let aLastT = performance.now();
    let animationFrameId: number;

    let aW = 0, aH = 0, aCx = 0, aCy = 0;
    
    // Background Particles
    const aAP = Array.from({length: 40}).map(() => ({
      x: Math.random() * 2000, 
      y: Math.random() * 2000, 
      vx: (Math.random() - 0.5) * 0.1, 
      vy: (Math.random() - 0.5) * 0.1, 
      sz: 0.5 + Math.random() * 1.0, 
      al: 0.1 + Math.random() * 0.2, 
      ph: Math.random() * Math.PI * 2
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const d = Math.min(window.devicePixelRatio || 1, 2);
        aW = parent.clientWidth;
        aH = parent.clientHeight;
        canvas.width = aW * d;
        canvas.height = aH * d;
        ctx.setTransform(d, 0, 0, d, 0, 0);
        aCx = aW / 2;
        aCy = aH / 2;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    // The hero drawing function
    function aBody(x: number, y: number, sc: number, al: number, se: boolean, bp: number = 0, armPosT: number = 0) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sc, sc);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      const pulse = reduceMotion ? 0 : Math.sin(aTime * 1.5) * 0.5 + 0.5;
      const breath = reduceMotion ? 0 : Math.sin(aTime * 0.9) * 0.5 + 0.5;
      
      const armPos = armPosT; // Lift arms slightly if multiple axes are active
      const auraCol = se ? '80,165,195' : '160,140,180';

      // Ground shadow
      const shG = ctx.createRadialGradient(0, 45, 0, 0, 45, 70);
      shG.addColorStop(0, `rgba(20,30,40,${al * 0.35})`);
      shG.addColorStop(0.6, `rgba(20,30,40,${al * 0.12})`);
      shG.addColorStop(1, 'rgba(20,30,40,0)');
      ctx.fillStyle = shG;
      ctx.beginPath(); ctx.ellipse(0, 45, 60 + pulse * 5, 10 + pulse * 2, 0, 0, Math.PI * 2); ctx.fill();

      // Gravity axis core inside hero
      const axTop = -158, axBot = 78;
      const agGlow = ctx.createLinearGradient(0, axTop, 0, axBot);
      agGlow.addColorStop(0, `rgba(${auraCol},0)`);
      agGlow.addColorStop(0.5, `rgba(${auraCol},${al * 0.07})`);
      agGlow.addColorStop(1, `rgba(${auraCol},0)`);
      ctx.strokeStyle = agGlow; ctx.lineWidth = 22;
      ctx.beginPath(); ctx.moveTo(0, axTop); ctx.lineTo(0, axBot); ctx.stroke();
      
      const ag = ctx.createLinearGradient(0, axTop, 0, axBot);
      ag.addColorStop(0, 'rgba(230,200,90,0)');
      ag.addColorStop(0.5, `rgba(${auraCol},${al * (0.3 + pulse * 0.2)})`);
      ag.addColorStop(1, 'rgba(230,200,90,0)');
      ctx.strokeStyle = ag; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, axTop); ctx.lineTo(0, axBot); ctx.stroke();

      // Earth globe under the hero
      const gR = 44, gY = 0;
      const atmG = ctx.createRadialGradient(0, gY, gR, 0, gY, gR + 15);
      atmG.addColorStop(0, `rgba(${auraCol},${al * 0.35})`);
      atmG.addColorStop(1, 'rgba(100,170,190,0)');
      ctx.fillStyle = atmG;
      ctx.beginPath(); ctx.arc(0, gY, gR + 15, 0, Math.PI * 2); ctx.fill();
      
      const gg = ctx.createRadialGradient(-10, gY - 15, 5, 0, gY + 5, gR);
      gg.addColorStop(0, `rgba(180,180,190,${al * 0.5})`);
      gg.addColorStop(0.4, `rgba(70,100,120,${al * 0.4})`);
      gg.addColorStop(0.8, `rgba(30,50,70,${al * 0.3})`);
      gg.addColorStop(1, `rgba(10,20,30,${al * 0.25})`);
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(0, gY, gR, 0, Math.PI * 2); ctx.fill();

      // terminator
      ctx.save();
      ctx.beginPath(); ctx.arc(0, gY, gR, 0, Math.PI * 2); ctx.clip();
      const tGrad = ctx.createLinearGradient(-gR * 0.2, 0, gR, 0);
      tGrad.addColorStop(0, `rgba(5,10,15,0)`);
      tGrad.addColorStop(1, `rgba(5,10,15,${al * 0.6})`);
      ctx.fillStyle = tGrad;
      ctx.fillRect(-gR, -gR, gR * 2, gR * 2);
      ctx.restore();

      // continents (more abstract/geometric)
      ctx.fillStyle = `rgba(120,140,160,${al * 0.15})`;
      ctx.beginPath(); ctx.ellipse(-15, gY - 8, 16, 10, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(12, gY + 12, 12, 6, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-6, gY + 20, 8, 3, 0.1, 0, Math.PI * 2); ctx.fill();
      
      // Lotus legs (obsidian/slate with subtle gold trim)
      const sY = -gR + 5, pY = sY - 8;
      ctx.fillStyle = `rgba(10,12,18,${al * 0.8})`;
      ctx.beginPath(); ctx.ellipse(0, sY + 22, 42, 7, 0, 0, Math.PI * 2); ctx.fill(); // inner shadow
      
      const legG = ctx.createLinearGradient(0, sY - 10, 0, sY + 30);
      legG.addColorStop(0, `rgba(30,35,45,${al * 0.95})`);
      legG.addColorStop(1, `rgba(15,18,22,${al * 0.95})`);
      ctx.fillStyle = legG;
      ctx.beginPath();
      ctx.moveTo(-42, sY + 5);
      ctx.quadraticCurveTo(-48, sY + 22, -32, sY + 28);
      ctx.quadraticCurveTo(-5, sY + 32, 0, sY + 16);
      ctx.quadraticCurveTo(5, sY + 32, 32, sY + 28);
      ctx.quadraticCurveTo(48, sY + 22, 42, sY + 5);
      ctx.quadraticCurveTo(20, sY - 6, 0, pY);
      ctx.quadraticCurveTo(-20, sY - 6, -42, sY + 5);
      ctx.fill();
      
      // Gold trim on legs
      ctx.strokeStyle = `rgba(210,180,120,${al * 0.4})`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-36, sY + 12); ctx.quadraticCurveTo(0, sY - 2, 36, sY + 12); ctx.stroke();

      // Torso
      const wY = pY - 22, cY = wY - 28, shY = cY - 12;
      const robeG = ctx.createLinearGradient(-30, shY, 30, pY);
      robeG.addColorStop(0, `rgba(25,30,38,${al * 0.95})`);
      robeG.addColorStop(0.5, `rgba(35,42,52,${al * 0.95})`);
      robeG.addColorStop(1, `rgba(20,24,30,${al * 0.95})`);
      ctx.fillStyle = robeG;
      ctx.beginPath();
      ctx.moveTo(-28, pY);
      ctx.quadraticCurveTo(-32, wY, -30, cY);
      ctx.lineTo(-26, shY); ctx.lineTo(26, shY); ctx.lineTo(30, cY);
      ctx.quadraticCurveTo(32, wY, 28, pY);
      ctx.closePath(); ctx.fill();

      // Gold line down the center of the robe
      ctx.strokeStyle = `rgba(210,180,120,${al * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, shY); ctx.quadraticCurveTo(0, (shY+pY)/2, 0, pY); ctx.stroke();

      // breath expansion (glowing cyan core)
      if (armPos > 0.02 || breath > 0) {
        const coreE = Math.max(armPos, breath * 0.5);
        const coreG = ctx.createRadialGradient(0, cY + 4, 0, 0, cY + 4, 20 + coreE * 8);
        coreG.addColorStop(0, `rgba(160,230,255,${al * coreE * 0.15})`);
        coreG.addColorStop(1, `rgba(160,230,255,0)`);
        ctx.fillStyle = coreG;
        ctx.beginPath(); ctx.ellipse(0, cY + 4, 20 + coreE * 8, 14 + coreE * 5, 0, 0, Math.PI * 2); ctx.fill();
      }

      // Arms
      const aAng = armPos * Math.PI, aL1 = 38, aL2 = 35;
      for (let side = -1; side <= 1; side += 2) {
        const sx = side * 26, sy = shY + 5, ang = Math.PI / 2 - aAng;
        const eX = sx + Math.cos(ang) * side * aL1 * 0.75, eY = sy + Math.sin(ang) * aL1;
        const hx = eX + Math.cos(ang) * side * aL2 * 0.45, hy = eY + Math.sin(ang) * aL2 * 0.75;
        
        // Sleeve
        const slG = ctx.createLinearGradient(sx, sy, eX, eY);
        slG.addColorStop(0, `rgba(32,38,48,${al * 0.95})`);
        slG.addColorStop(1, `rgba(22,26,34,${al * 0.95})`);
        ctx.fillStyle = slG;
        ctx.beginPath();
        ctx.moveTo(sx - side * 7, sy - 1.5); ctx.lineTo(sx + side * 7, sy + 1.5);
        ctx.lineTo(eX + side * 5.5, eY); ctx.lineTo(eX - side * 5.5, eY);
        ctx.closePath(); ctx.fill();
        
        ctx.fillStyle = `rgba(15,18,24,${al * 0.9})`;
        ctx.beginPath(); ctx.arc(eX, eY, 5.5, 0, Math.PI * 2); ctx.fill();
        
        // Forearm/Skin (pale ivory)
        const faGrad = ctx.createLinearGradient(eX, eY, hx, hy);
        faGrad.addColorStop(0, `rgba(230,220,210,${al * (0.8 + armPos * 0.2)})`);
        faGrad.addColorStop(1, `rgba(210,195,180,${al * (0.8 + armPos * 0.2)})`);
        ctx.strokeStyle = faGrad; ctx.lineWidth = 4.5;
        ctx.beginPath(); ctx.moveTo(eX, eY); ctx.lineTo(hx, hy); ctx.stroke();
        
        // Hand
        ctx.fillStyle = `rgba(235,225,215,${al * (0.8 + armPos * 0.2)})`;
        ctx.beginPath(); ctx.arc(hx, hy, 6.5, 0, Math.PI * 2); ctx.fill();
      }

      // Mudra Hands Core
      if (armPos < 0.15) {
        const mY = wY + 15;
        const mG = ctx.createRadialGradient(0, mY, 1, 0, mY, 14);
        mG.addColorStop(0, `rgba(255,245,230,${al * 0.6})`);
        mG.addColorStop(1, `rgba(210,190,170,${al * 0.3})`);
        ctx.fillStyle = mG;
        ctx.beginPath(); ctx.ellipse(0, mY, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
        
        // Little glowing orb in hands
        ctx.fillStyle = `rgba(255,255,255,${al * (0.4 + pulse * 0.3)})`;
        ctx.beginPath(); ctx.arc(0, mY - 2, 3, 0, Math.PI * 2); ctx.fill();
      }

      // Halo (Multi-layered abstract glow)
      const haloA = al * (0.15 + armPos * 0.1 + pulse * 0.05);
      const nY = shY - 9, hdY = nY - 24, hdR = 21, htop2 = hdY - hdR - 7;
      
      const haloG1 = ctx.createRadialGradient(0, hdY, hdR, 0, hdY, hdR + 40);
      haloG1.addColorStop(0, `rgba(210,190,150,${haloA * 0.8})`);
      haloG1.addColorStop(1, 'rgba(210,190,150,0)');
      ctx.fillStyle = haloG1;
      ctx.beginPath(); ctx.arc(0, hdY, hdR + 40, 0, Math.PI * 2); ctx.fill();

      const haloG2 = ctx.createRadialGradient(0, hdY, hdR, 0, hdY, hdR + 18);
      haloG2.addColorStop(0, `rgba(255,255,255,${haloA * 1.5})`);
      haloG2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = haloG2;
      ctx.beginPath(); ctx.arc(0, hdY, hdR + 18, 0, Math.PI * 2); ctx.fill();

      // Hood
      const hoodG = ctx.createLinearGradient(-30, hdY, 30, shY);
      hoodG.addColorStop(0, `rgba(25,30,38,${al * 0.95})`);
      hoodG.addColorStop(0.5, `rgba(40,48,60,${al * 0.95})`);
      hoodG.addColorStop(1, `rgba(20,24,30,${al * 0.95})`);
      ctx.fillStyle = hoodG;
      ctx.beginPath();
      ctx.moveTo(-28, shY);
      ctx.quadraticCurveTo(-30, nY - 5, -26, hdY);
      ctx.quadraticCurveTo(-20, htop2, 0, htop2 - 3);
      ctx.quadraticCurveTo(20, htop2, 26, hdY);
      ctx.quadraticCurveTo(30, nY - 5, 28, shY);
      ctx.fill();

      // Face (Soft ivory, abstract)
      const faceG = ctx.createRadialGradient(0, hdY - 2, 2, 0, hdY, hdR);
      faceG.addColorStop(0, `rgba(240,235,225,${al * 0.9})`);
      faceG.addColorStop(0.7, `rgba(210,195,180,${al * 0.85})`);
      faceG.addColorStop(1, `rgba(180,160,140,${al * 0.8})`);
      ctx.fillStyle = faceG;
      ctx.beginPath(); ctx.arc(0, hdY, hdR - 4, -0.2, Math.PI + 0.2); ctx.fill();
      
      // Eyes (Closed, deeply relaxed, golden glow)
      ctx.strokeStyle = `rgba(140,110,80,${al * 0.7})`; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(-11, hdY + 3); ctx.quadraticCurveTo(-6.5, hdY + 5, -2.5, hdY + 3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2.5, hdY + 3); ctx.quadraticCurveTo(6.5, hdY + 5, 11, hdY + 3); ctx.stroke();
      
      // Third eye subtle glow
      ctx.fillStyle = `rgba(255,230,180,${al * (0.3 + pulse * 0.4)})`;
      ctx.beginPath(); ctx.arc(0, hdY - 5, 1.8, 0, Math.PI * 2); ctx.fill();

      // Tantien (Base energy center)
      const tY2 = wY + 9;
      const tgOut = ctx.createRadialGradient(0, tY2, 2, 0, tY2, 26 + breath * 12);
      tgOut.addColorStop(0, `rgba(100,220,180,${al * (0.2 + armPos * 0.15)})`);
      tgOut.addColorStop(0.5, `rgba(70,180,150,${al * (0.08 + armPos * 0.08)})`);
      tgOut.addColorStop(1, 'rgba(70,180,150,0)');
      ctx.fillStyle = tgOut;
      ctx.beginPath(); ctx.arc(0, tY2, 26 + breath * 12, 0, Math.PI * 2); ctx.fill();

      // Infinity symbol (Heart center)
      const iY = cY + 9, iR = 9.5, iW = 16;
      const iPulse = 0.5 + 0.5 * Math.sin(aTime * 3);
      
      // Heart glow
      const iGlow = ctx.createRadialGradient(0, iY, 2, 0, iY, iR * 2.5);
      iGlow.addColorStop(0, `rgba(255,200,100,${al * 0.5 * iPulse})`);
      iGlow.addColorStop(1, 'rgba(255,200,100,0)');
      ctx.fillStyle = iGlow;
      ctx.beginPath(); ctx.ellipse(0, iY, iW + 6, iR + 6, 0, 0, Math.PI * 2); ctx.fill();
      
      ctx.save(); ctx.translate(0, iY); ctx.lineWidth = 2.0;
      // Vibrant Rainbow iridescent infinity loop
      const infColors = ['#FF4444', '#FFAA00', '#FFEE00', '#00FF66', '#00CCFF', '#8844FF', '#FF44AA'];
      for (let ic = 0; ic < infColors.length; ic++) {
        const offset = (ic - 3) * 0.6;
        ctx.strokeStyle = infColors[ic];
        ctx.globalAlpha = al * (0.5 + 0.5 * pulse) * (1 - Math.abs(ic - 3) / 7);
        ctx.beginPath(); ctx.moveTo(0, offset);
        ctx.bezierCurveTo(-iR * 1.3, -iR + offset, -iR * 1.3, iR + offset, 0, offset);
        ctx.bezierCurveTo(iR * 1.3, -iR + offset, iR * 1.3, iR + offset, 0, offset);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
    }

    // Tools for active axes
    function aGnd(al: number, co: string) {
      if (!ctx || al <= 0) return;
      const y = aCy + 45;
      const g = ctx.createLinearGradient(aCx - 180, y, aCx + 180, y);
      g.addColorStop(0, `rgba(${co},0)`);
      g.addColorStop(0.5, `rgba(${co},${al * 0.3})`);
      g.addColorStop(1, `rgba(${co},0)`);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(aCx - 180, y); ctx.lineTo(aCx + 180, y); ctx.stroke();
    }

    function aAx(al: number, co: string, h: number = 100) {
      if (!ctx || al <= 0) return;
      const t2 = aCy - h / 2 - 15, b = aCy + h / 2;
      const g = ctx.createLinearGradient(aCx, t2, aCx, b);
      g.addColorStop(0, `rgba(${co},0)`);
      g.addColorStop(0.5, `rgba(${co},${al * 0.55})`);
      g.addColorStop(1, `rgba(${co},0)`);
      ctx.strokeStyle = g; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(aCx, t2); ctx.lineTo(aCx, b); ctx.stroke();
    }

    function aBA(al: number, bp: number, co: string, sz: number = 1) {
      if (!ctx || al <= 0) return;
      const bw = 55 * sz, bh = 78 * sz, exp = 1 + bp * 0.12;
      for (let l = 4; l >= 0; l--) {
        const lw = (bw + l * 14) * exp, lh = (bh + l * 18) * exp, la = al * (0.018 + l * 0.01);
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.05) {
          const n = aFbm(Math.cos(a) * 2 + aTime * 0.2, Math.sin(a) * 2 + aTime * 0.15, 3);
          const d = 1 + (n - 0.5) * 0.12;
          const px = aCx + Math.cos(a) * lw * d, py = aCy - 8 + Math.sin(a) * lh * d;
          a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${co},${la})`;
        ctx.fill();
      }
    }

    const renderLoop = (ts: number) => {
      const dt = Math.min((ts - aLastT) / 1000, 0.05);
      aLastT = ts;
      aTime += reduceMotion ? 0 : dt;
      
      ctx.clearRect(0, 0, aW, aH);

      // Render subtle drifting particles (Space dust) without the harsh gradient background
      aAP.forEach(p => {
        p.x += p.vx + Math.sin(aTime * 0.2 + p.ph) * 0.02;
        p.y += p.vy + Math.cos(aTime * 0.15 + p.ph) * 0.02;
        if (p.x < 0) p.x = aW; if (p.x > aW) p.x = 0;
        if (p.y < 0) p.y = aH; if (p.y > aH) p.y = 0;
        const pa = p.al * (0.3 + Math.sin(aTime * 0.5 + p.ph) * 0.7);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${pa})`; ctx.fill();
      });

      const bp = Math.sin(aTime * 0.45);
      
      // Determine overall arm energy level (for lifting hands)
      let activeCount = 0;
      if (activeAxes.body || activeAxes.bodySoft) activeCount++;
      if (activeAxes.breath || activeAxes.breathSoft) activeCount++;
      if (activeAxes.attention || activeAxes.attentionSoft) activeCount++;
      if (activeAxes.space || activeAxes.spaceSoft) activeCount++;
      
      const armPosT = activeCount >= 2 ? 0.15 : 0;

      // ── Space (Infinity Rays)
      const isSpace = activeAxes.space || activeAxes.spaceSoft;
      if (isSpace) {
        const al = activeAxes.space ? 1 : 0.4;
        aGnd(al, '100,170,130');
        aAx(al * 0.55, '100,160,120', 100);
        aBA(al * 0.3, bp, '80,165,195', 0.55);
        
        ctx.save();
        const infCx = aCx, infCy = aCy + 36 - 57;
        const maxDist = Math.sqrt(aW * aW + aH * aH);
        for (let i = 0; i < 24; i++) {
          const angle = (i / 24) * Math.PI * 2 + aTime * 0.03;
          const nv = aFbm(Math.cos(angle) + aTime * 0.1, Math.sin(angle) + aTime * 0.08, 3);
          const len = maxDist * 0.8 + nv * 50;
          const sr = 12;
          const sx = infCx + Math.cos(angle) * sr;
          const sy = infCy + Math.sin(angle) * sr * 0.75;
          const ex = infCx + Math.cos(angle) * len;
          const ey2 = infCy + Math.sin(angle) * len * 0.65;
          const rg = ctx.createLinearGradient(sx, sy, ex, ey2);
          rg.addColorStop(0, `rgba(130,200,150,${al * 0.3})`);
          rg.addColorStop(0.3, `rgba(130,200,150,${al * 0.15})`);
          rg.addColorStop(1, 'rgba(130,200,150,0)');
          ctx.strokeStyle = rg;
          ctx.lineWidth = 1 + nv * 0.7;
          const mx = (sx + ex) / 2 + Math.sin(angle * 3 + aTime) * 8;
          const my = (sy + ey2) / 2 + Math.cos(angle * 3 + aTime) * 6;
          ctx.beginPath(); ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(mx, my, ex, ey2); ctx.stroke();
        }
        ctx.restore();
      }

      // ── Attention (Eye Beams)
      const isAtt = activeAxes.attention || activeAxes.attentionSoft;
      if (isAtt) {
        const al = activeAxes.attention ? 1 : 0.4;
        const tx = aCx + Math.min(aW * 0.22, 110), ty = aCy - 20, pu = Math.sin(aTime * 2.5);
        const eyeLY = aCy + 36 - 90, eyeLX = aCx - 3.5, eyeRX = aCx + 3.5;
        for (let b = -1; b <= 1; b += 2) {
          const ex = b < 0 ? eyeLX : eyeRX;
          const bg = ctx.createLinearGradient(ex, eyeLY, tx, ty);
          bg.addColorStop(0, `rgba(225,190,65,${al * 0.45})`);
          bg.addColorStop(1, `rgba(225,190,65,${al * 0.5})`);
          ctx.strokeStyle = bg; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(ex, eyeLY); ctx.lineTo(tx, ty); ctx.stroke();
        }
        for (let r = 35; r > 0; r -= 7) {
          const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, r);
          tg.addColorStop(0, `rgba(235,200,55,${al * (0.1 + pu * 0.03)})`);
          tg.addColorStop(1, 'rgba(235,200,55,0)');
          ctx.fillStyle = tg;
          ctx.beginPath(); ctx.arc(tx, ty, r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = `rgba(245,215,75,${al * (0.65 + pu * 0.2)})`;
        ctx.beginPath(); ctx.arc(tx, ty, 3.5 + pu, 0, Math.PI * 2); ctx.fill();
      }

      // ── Breath (Cyan Aura)
      const isBreath = activeAxes.breath || activeAxes.breathSoft;
      if (isBreath) {
        const al = activeAxes.breath ? 1 : 0.4;
        aBA(al * 0.5, bp, '80,165,195', 0.55);
        const auraPulse = 0.5 + 0.5 * Math.sin(aTime * 0.9);
        const auraSize = 45 + auraPulse * 25 + bp * 10;
        for (let layer = 3; layer >= 0; layer--) {
          const lr = auraSize + layer * 15;
          const la = al * (0.04 + layer * 0.015) * auraPulse;
          const ag = ctx.createRadialGradient(aCx, aCy - 15, 6, aCx, aCy - 15, lr);
          ag.addColorStop(0, `rgba(80,180,220,${la * 1.5})`);
          ag.addColorStop(0.4, `rgba(80,165,195,${la})`);
          ag.addColorStop(1, 'rgba(60,140,180,0)');
          ctx.fillStyle = ag;
          ctx.beginPath(); ctx.ellipse(aCx, aCy - 15, lr * 1.0, lr * 1.3, 0, 0, Math.PI * 2); ctx.fill();
        }
      }

      // ── Gravity (Purple/Gold Axis)
      const isGravity = activeAxes.body || activeAxes.bodySoft;
      if (isGravity) {
        const al = activeAxes.body ? 1 : 0.5;
        aGnd(al, '160,140,180');
        const earthCenterY = aCy + 36;
        const axTop = 0;
        const axGlow = ctx.createLinearGradient(aCx, axTop, aCx, earthCenterY);
        axGlow.addColorStop(0, `rgba(160,140,180,0)`);
        axGlow.addColorStop(0.5, `rgba(160,140,180,${al * 0.14})`);
        axGlow.addColorStop(1, `rgba(180,120,60,${al * 0.12})`);
        ctx.strokeStyle = axGlow; ctx.lineWidth = 28;
        ctx.beginPath(); ctx.moveTo(aCx, axTop); ctx.lineTo(aCx, earthCenterY); ctx.stroke();

        const axCore = ctx.createLinearGradient(aCx, axTop, aCx, earthCenterY);
        axCore.addColorStop(0, `rgba(200,180,220,0)`);
        axCore.addColorStop(0.5, `rgba(220,200,240,${al * 0.75})`);
        axCore.addColorStop(1, `rgba(220,180,100,${al * 0.5})`);
        ctx.strokeStyle = axCore; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(aCx, axTop); ctx.lineTo(aCx, earthCenterY); ctx.stroke();
      }

      // When literally nothing is active, hero is hovering loosely with whirlwind
      const noAxes = activeCount === 0;
      let bobY = 0;
      if (noAxes) {
        bobY = Math.sin(aTime * 0.7) * 8;
        ctx.save();
        const headWY = aCy + 22 + bobY - 137;
        const chestWY = aCy + 22 + bobY - 88;
        const al = 0.5;
        
        for (let i = 0; i < 30; i++) {
          const angle = aTime * (1.8 + i * 0.06) + i * 0.45;
          const dist = 20 + i * 2.5 + Math.sin(aTime * 1.5 + i) * 8;
          const px = aCx + Math.cos(angle) * dist * 0.7;
          const py = headWY - 15 - i * 1.5 + Math.sin(angle) * dist * 0.25;
          const sa = al * (0.22 + Math.sin(aTime + i * 0.3) * 0.1) * (1 - i / 35);
          const sz = 2.2 - i * 0.02 + Math.sin(aTime * 3 + i) * 0.6;
          ctx.beginPath(); ctx.arc(px, py, Math.max(0.5, sz), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,100,80,${sa})`; ctx.fill();
        }
        ctx.restore();
      }

      // Base Body
      aBody(aCx, aCy + 36 + bobY, 0.65, 1, isBreath, bp, armPosT);

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    aLastT = performance.now();
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeAxes, reduceMotion]);

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 relative">
      <div className="mb-2 z-10 w-full text-center">
        <span className="text-[12px] uppercase tracking-[4px] text-white/40 font-serif italic drop-shadow-lg">
          {language === 'el' ? 'Κεντρο Ισορροπιας' : 'Center of Balance'}
        </span>
      </div>

      <div className="relative w-full h-[200px] flex justify-center items-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        
        {/* Subtle Labels Floating Above */}
        <div className="absolute inset-0 pointer-events-none text-[9px] uppercase tracking-[3px] font-medium z-10 w-full h-full">
          <div className={`absolute w-full text-center top-[30px] transition-opacity duration-1000 ${activeAxes.space || activeAxes.spaceSoft ? 'text-teal-400/80 drop-shadow-md' : 'text-white/20'}`}>
            {language === 'el' ? 'Χωρος' : 'Space'}
          </div>
          <div className={`absolute left-4 md:left-12 top-[60px] transition-opacity duration-1000 ${activeAxes.attention || activeAxes.attentionSoft ? 'text-amber-400/80 drop-shadow-md' : 'text-white/20'}`}>
            {language === 'el' ? 'Προσοχη' : 'Attention'}
          </div>
          <div className={`absolute right-4 md:right-12 top-[120px] transition-opacity duration-1000 ${activeAxes.breath || activeAxes.breathSoft ? 'text-sky-400/80 drop-shadow-md' : 'text-white/20'}`}>
            {language === 'el' ? 'Αναπνοη' : 'Breath'}
          </div>
          <div className={`absolute w-full text-center bottom-[10px] transition-opacity duration-1000 ${activeAxes.body || activeAxes.bodySoft ? 'text-purple-400/80 drop-shadow-md' : 'text-white/20'}`}>
            {language === 'el' ? 'Βαρυτητα' : 'Gravity'}
          </div>
        </div>
      </div>
      
      <div className="mt-2 flex flex-wrap justify-center gap-4 text-center px-4 z-10">
        <span className="text-[11px] text-white/40 leading-relaxed max-w-md font-serif italic text-center drop-shadow-lg">
          {language === 'el' 
            ? 'Κάθε άσκηση ζωντανεύει τον δικό της άξονα. Όσο εξασκείσαι, τόσο το πεδίο εμβαθύνει.'
            : 'Each practice sustains its axis. As you practice, the field deepens.'}
        </span>
      </div>
    </div>
  );
}
