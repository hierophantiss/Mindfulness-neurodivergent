import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useLanguage } from '../hooks/useLanguage';
import { useAccessibility } from '../hooks/useAccessibility';
import { Link } from 'react-router-dom';
import { Info, X } from 'lucide-react';

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
  const [showLegend, setShowLegend] = useState(false);

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


      ctx.restore();
    }

    const renderLoop = (ts: number) => {
      const dt = Math.min((ts - aLastT) / 1000, 0.05);
      aLastT = ts;
      aTime += reduceMotion ? 0 : dt;
      
      ctx.clearRect(0, 0, aW, aH);

      // Render subtle drifting particles (Space dust)
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
      
      let activeCount = 0;
      if (activeAxes.body || activeAxes.bodySoft) activeCount++;
      if (activeAxes.breath || activeAxes.breathSoft) activeCount++;
      if (activeAxes.attention || activeAxes.attentionSoft) activeCount++;
      if (activeAxes.space || activeAxes.spaceSoft) activeCount++;
      
      const armPosT = activeCount >= 2 ? 0.15 : 0;

      const isSpace = activeAxes.space || activeAxes.spaceSoft;
      const isAtt = activeAxes.attention || activeAxes.attentionSoft;
      const isBreath = activeAxes.breath || activeAxes.breathSoft;
      const isGravity = activeAxes.body || activeAxes.bodySoft;

      const noAxes = activeCount === 0;
      let bobY = 0;
      if (noAxes) {
        bobY = Math.sin(aTime * 0.7) * 5;
      }

      ctx.save();
      ctx.translate(aCx, aCy + 36 + bobY);
      ctx.scale(0.65, 0.65);

      // --- 1. Space Dashed Rays (drawn behind) ---
      const spaceColor = `45, 212, 191`; // teal-400
      
      ctx.save();
      ctx.lineWidth = activeAxes.space ? 1.5 : 1;
      ctx.setLineDash([12, 15]);
      for(let i = 0; i < 16; i++) {
         const angle = (i / 16) * Math.PI * 2 + (reduceMotion ? 0 : aTime * 0.05);
         ctx.beginPath();
         ctx.moveTo(Math.cos(angle) * 30, -86 + Math.sin(angle) * 30);
         const dist = 800;
         ctx.lineTo(Math.cos(angle) * dist, -86 + Math.sin(angle) * dist);
         
         ctx.strokeStyle = `rgba(${spaceColor}, 0.85)`;
         if (activeAxes.space) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = `rgba(${spaceColor}, 0.8)`;
            ctx.strokeStyle = `rgba(${spaceColor}, 1)`;
         } else if (activeAxes.spaceSoft) {
            ctx.strokeStyle = `rgba(${spaceColor}, 0.95)`;
         }
         ctx.stroke();
      }
      ctx.restore();

      // --- Draw Monk ---
      aBody(0, 0, 1, 1, isBreath, bp, armPosT);

      // --- Draw Geometric Overlays (Front) ---
      
      // 2. Gravity Axis (Vertical Line)
      const gravColor = `192, 132, 252`; // purple-400
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, -171); // Top of head
      ctx.lineTo(0, 0); // Center of earth
      ctx.lineWidth = activeAxes.body ? 2.5 : 1.5;
      ctx.strokeStyle = `rgba(${gravColor}, 0.85)`;
      if (activeAxes.body) {
         ctx.shadowBlur = 15;
         ctx.shadowColor = `rgba(${gravColor}, 1)`;
         ctx.strokeStyle = `rgba(${gravColor}, 1)`;
      } else if (activeAxes.bodySoft) {
         ctx.strokeStyle = `rgba(${gravColor}, 0.95)`;
      }
      ctx.stroke();
      
      // Grounding diamond at the center of earth
      ctx.translate(0, 0);
      ctx.beginPath();
      ctx.moveTo(0, -8); ctx.lineTo(8, 0); ctx.lineTo(0, 8); ctx.lineTo(-8, 0);
      ctx.closePath();
      if (activeAxes.body) {
         ctx.fillStyle = `rgba(${gravColor}, 1)`;
         ctx.fill();
      } else {
         ctx.strokeStyle = `rgba(${gravColor}, 0.85)`;
         if (activeAxes.bodySoft) ctx.strokeStyle = `rgba(${gravColor}, 0.95)`;
         ctx.stroke();
      }
      ctx.restore();

      // 3. Attention (Triangle)
      const attColor = `251, 191, 36`; // amber-400
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, -145); // Third eye / between eyes
      ctx.lineTo(-85, -20);
      ctx.lineTo(85, -20);
      ctx.closePath();
      ctx.lineWidth = activeAxes.attention ? 2.0 : 1.5;
      ctx.strokeStyle = `rgba(${attColor}, 0.85)`;
      if (activeAxes.attention) {
         ctx.shadowBlur = 15;
         ctx.shadowColor = `rgba(${attColor}, 0.8)`;
         ctx.strokeStyle = `rgba(${attColor}, 1)`;
         ctx.fillStyle = `rgba(${attColor}, 0.1)`;
         ctx.fill();
      } else if (activeAxes.attentionSoft) {
         ctx.strokeStyle = `rgba(${attColor}, 0.95)`;
      }
      ctx.stroke();
      ctx.restore();

      // 4. Breath (Circle)
      const breathColor = `56, 189, 248`; // sky-400
      const breathPulse = activeAxes.breath && !reduceMotion ? Math.sin(aTime * 2) * 4 : 0;
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, -63, 115 + breathPulse, 0, Math.PI * 2);
      ctx.lineWidth = activeAxes.breath ? 2.0 : 1.5;
      ctx.strokeStyle = `rgba(${breathColor}, 0.85)`;
      if (activeAxes.breath) {
         ctx.shadowBlur = 15;
         ctx.shadowColor = `rgba(${breathColor}, 0.8)`;
         ctx.strokeStyle = `rgba(${breathColor}, 1)`;
      } else if (activeAxes.breathSoft) {
         ctx.strokeStyle = `rgba(${breathColor}, 0.95)`;
      }
      ctx.stroke();
      ctx.restore();

      // 5. Space (Infinity Symbol & Rays)
      ctx.save();
      ctx.translate(0, -86); // Chest position
      
      // Draw inner infinity
      ctx.lineWidth = activeAxes.space ? 2.5 : 1.5;
      ctx.strokeStyle = `rgba(${spaceColor}, 0.85)`;
      if (activeAxes.space) {
         ctx.shadowBlur = 15;
         ctx.shadowColor = `rgba(${spaceColor}, 0.8)`;
         ctx.strokeStyle = `rgba(${spaceColor}, 1)`;
      } else if (activeAxes.spaceSoft) {
         ctx.strokeStyle = `rgba(${spaceColor}, 0.95)`;
      }
      const iR = 14;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-iR*1.5, -iR*1.2, -iR*1.5, iR*1.2, 0, 0);
      ctx.bezierCurveTo(iR*1.5, -iR*1.2, iR*1.5, iR*1.2, 0, 0);
      ctx.stroke();
      
      // Glowing core to infinity
      if (activeAxes.space) {
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,0.9)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255,255,255,1)`;
        ctx.fill();
      } else if (activeAxes.spaceSoft) {
        ctx.beginPath();
        ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,0.5)`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,0.8)`;
        ctx.fill();
      }
      ctx.restore();

      ctx.restore(); // Restore global translation


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
        
        {/* Legend Toggle Button */}
        <button
          onClick={() => setShowLegend(!showLegend)}
          className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-20 p-2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-sm"
          aria-label={language === 'el' ? 'Πληροφορίες στοιχείων' : 'Element information'}
        >
          {showLegend ? <X size={16} /> : <Info size={16} />}
        </button>

        {/* Legend Tooltip */}
        <div 
          className={`absolute bottom-12 right-2 md:bottom-14 md:right-4 pointer-events-auto text-[8px] md:text-[9px] uppercase tracking-[2px] font-bold z-10 flex flex-col items-end gap-2 md:gap-3 text-right bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 transition-all duration-300 origin-bottom-right ${showLegend ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          <div className={`transition-opacity duration-1000 flex items-center gap-3 text-purple-400 ${activeAxes.body || activeAxes.bodySoft ? 'drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] opacity-100' : 'opacity-70'}`}>
            <span>{language === 'el' ? '1 ΒΑΡΥΤΗΤΑ • ΓΗ' : '1 GRAVITY • EARTH'}</span>
            <div className="text-[13px] font-mono leading-none font-bold">I</div>
          </div>
          <div className={`transition-opacity duration-1000 flex items-center gap-3 text-sky-400 ${activeAxes.breath || activeAxes.breathSoft ? 'drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] opacity-100' : 'opacity-70'}`}>
            <span>{language === 'el' ? '2 ΑΝΑΠΝΟΗ • ΑΕΡΑΣ' : '2 BREATH • AIR'}</span>
            <div className="w-2 h-2 rounded-full bg-current"></div>
          </div>
          <div className={`transition-opacity duration-1000 flex items-center gap-3 text-amber-400 ${activeAxes.attention || activeAxes.attentionSoft ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] opacity-100' : 'opacity-70'}`}>
            <span>{language === 'el' ? '3 ΠΡΟΣΟΧΗ • ΦΩΤΙΑ' : '3 ATTENTION • FIRE'}</span>
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-current"></div>
          </div>
          <div className={`transition-opacity duration-1000 flex items-center gap-3 text-teal-400 ${activeAxes.space || activeAxes.spaceSoft ? 'drop-shadow-[0_0_8px_rgba(45,212,191,0.8)] opacity-100' : 'opacity-70'}`}>
            <span>{language === 'el' ? '4 ΧΩΡΟΣ • ΝΕΡΟ' : '4 SPACE • WATER'}</span>
            <div className="text-[16px] leading-none -mt-1 font-serif">∞</div>
          </div>
          
          <div className="w-full h-px bg-white/10 my-1"></div>
          
          <Link 
            to="/chapters"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span>{language === 'el' ? 'ΜΕΛΕΤΗ ΕΓΧΕΙΡΙΔΙΟΥ' : 'STUDY THE MANUAL'}</span>
            <Info size={12} />
          </Link>
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
