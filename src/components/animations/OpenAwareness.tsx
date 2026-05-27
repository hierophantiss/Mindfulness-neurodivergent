import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { PlayPauseOverlay } from '../PlayPauseOverlay';

export default function OpenAwareness() {
  const { language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [curScene, setCurScene] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [trans, setTrans] = useState(false);
  
  const curSceneRef = useRef(0);
  const targetSceneRef = useRef(0);
  const transRef = useRef(false);
  const transTRef = useRef(0);
  const autoPlayRef = useRef(false);
  
  const localeData = {
    el: {
      scenes: [
        { label: 'Εγκλωβισμός', sub: 'Τυλιγμένοι στα πέπλα των σκέψεων', bg: [30, 15, 35] },
        { label: 'Γείωση & Εστίαση', sub: 'Ο άξονας φωτίζει — το βλέμμα εστιάζει', bg: [15, 20, 38] },
        { label: 'Διεύρυνση', sub: 'Η βεντάλια ανοίγει — όραση, ακοή, αίσθηση', bg: [12, 25, 30] },
        { label: 'Ανοιχτή Επίγνωση (Mahamudra)', sub: 'Ο ουρανός που χωράει τα πάντα (Maha Ati)', bg: [15, 30, 25] }
      ],
      thoughtWords: ['σκέψη', 'ανησυχία', 'σχέδιο', 'θυμός', 'χαρά', 'φόβος', 'ανάμνηση', 'προσδοκία', 'κρίση', 'επιθυμία'],
      introTitle: 'Χώρος',
      introSub: 'Ανοιχτή Επίγνωση — Mahamudra & Maha Ati',
      introHint: '▶ Ξεκινήστε'
    },
    en: {
      scenes: [
        { label: 'Entrapment', sub: 'Wrapped in veils of thought', bg: [30, 15, 35] },
        { label: 'Grounding & Focus', sub: 'The axis illuminates — the gaze focuses', bg: [15, 20, 38] },
        { label: 'Expansion', sub: 'The fan opens — sight, hearing, sensation', bg: [12, 25, 30] },
        { label: 'Open Awareness (Mahamudra)', sub: 'The sky that holds everything (Maha Ati)', bg: [15, 30, 25] }
      ],
      thoughtWords: ['thought', 'worry', 'plan', 'anger', 'joy', 'fear', 'memory', 'expectation', 'judgment', 'desire'],
      introTitle: 'Space',
      introSub: 'Open Awareness — Mahamudra & Maha Ati',
      introHint: '▶ Begin'
    }
  };

  const currentLang = language === 'en' ? 'en' : 'el';
  const data = localeData[currentLang];
  const [showIntro, setShowIntro] = useState(true);

  const goToScene = (i: number) => {
    if (i < 0 || i > 3 || i === curSceneRef.current || transRef.current) return;
    targetSceneRef.current = i;
    transRef.current = true;
    transTRef.current = 0;
    setTrans(true);
    
    setTimeout(() => {
      curSceneRef.current = targetSceneRef.current;
      setCurScene(targetSceneRef.current);
      transRef.current = false;
      setTrans(false);
    }, 2000);
  };

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  useEffect(() => {
    let autoT: ReturnType<typeof setTimeout>;
    
    const runA = () => {
      if (!autoPlayRef.current) return;
      if (curSceneRef.current < 3 && !transRef.current) {
        goToScene(curSceneRef.current + 1);
        autoT = setTimeout(runA, 4200);
      } else if (curSceneRef.current >= 3) {
        setAutoPlay(false);
      } else {
        autoT = setTimeout(runA, 100);
      }
    };

    if (autoPlay) {
      autoT = setTimeout(runA, 2000);
    }

    return () => clearTimeout(autoT);
  }, [autoPlay]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    
    let W: number, H: number, cx: number, cy: number;
    let animationFrameId: number;
    
    const resize = () => {
      const parent = cv.parentElement;
      if (!parent) return;
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = parent.clientWidth;
      H = 450; 
      cv.width = W * d;
      cv.height = H * d;
      cv.style.width = W + 'px';
      cv.style.height = H + 'px';
      ctx.setTransform(d, 0, 0, d, 0, 0);
      cx = W / 2;
      cy = H / 2;
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    let time = 0;
    let gA = 0;
    
    // Noise functions
    const n = (x: number, y: number) => {
      const v = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    
    const sn = (x: number, y: number) => {
      const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      return n(ix, iy) + (n(ix + 1, iy) - n(ix, iy)) * sx + (n(ix, iy + 1) - n(ix, iy)) * sy + (n(ix, iy) - n(ix + 1, iy) - n(ix, iy + 1) + n(ix + 1, iy + 1)) * sx * sy;
    };
    
    const fbm = (x: number, y: number, o = 4) => {
      let v = 0, a = 0.5, f = 1;
      for (let i = 0; i < o; i++) {
        v += a * sn(x * f, y * f);
        a *= 0.5;
        f *= 2;
      }
      return v;
    };
    
    // Ambient particles
    const amb: any[] = [];
    for (let i = 0; i < 35; i++) {
      amb.push({
        x: Math.random() * 2000, 
        y: Math.random() * 2000, 
        vx: (Math.random() - 0.5) * 0.12, 
        vy: (Math.random() - 0.5) * 0.08, 
        sz: 0.3 + Math.random() * 1, 
        al: 0.03 + Math.random() * 0.06, 
        ph: Math.random() * Math.PI * 2
      });
    }

    // Veils
    const veils: any[] = [];
    for (let i = 0; i < 12; i++) {
      const a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 80;
      veils.push({
        x: Math.cos(a) * r, y: Math.sin(a) * r,
        w: 25 + Math.random() * 40, h: 15 + Math.random() * 25,
        rot: Math.random() * Math.PI * 2,
        sp: 0.1 + Math.random() * 0.3,
        drift: Math.random() * Math.PI * 2,
        co: Math.random() > 0.5 ? [180, 140, 190] : [160, 120, 170]
      });
    }

    const cloudThoughts: any[] = [];
    for (let i = 0; i < 10; i++) {
      cloudThoughts.push({
        active: false,
        timer: 0,
        x: 0, y: 0,
        size: 0,
        word: '',
        color: [200, 200, 230],
        speed: 0,
        angle: 0
      });
    }

    const drawTopBody = (x: number, y: number, scale: number, alpha: number, lightLevel: number, transparent = 1) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.globalAlpha = alpha * transparent;

      // Shoulders
      ctx.fillStyle = `rgba(180,170,155,${0.08 * transparent})`;
      ctx.beginPath();
      ctx.ellipse(0, 8, 28, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(200,190,175,${0.5 * transparent})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Arms
      ctx.strokeStyle = `rgba(200,190,175,${0.4 * transparent})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-26, 4); ctx.quadraticCurveTo(-30, -12, -15, -18); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(26, 4); ctx.quadraticCurveTo(30, -12, 15, -18); ctx.stroke();
      
      // Hands
      ctx.beginPath(); ctx.arc(-14, -18, 3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(14, -18, 3, 0, Math.PI * 2); ctx.stroke();

      // Head
      const headR = 14;
      if (lightLevel > 0) {
        const hg = ctx.createRadialGradient(0, -3, 0, 0, -3, headR * 2 + lightLevel * 20);
        hg.addColorStop(0, `rgba(140,200,220,${alpha * lightLevel * 0.2 * transparent})`);
        hg.addColorStop(0.5, `rgba(120,180,200,${alpha * lightLevel * 0.08 * transparent})`);
        hg.addColorStop(1, 'rgba(120,180,200,0)');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(0, -3, headR * 2 + lightLevel * 20, 0, Math.PI * 2); ctx.fill();
      }
      
      ctx.fillStyle = `rgba(200,190,170,${0.15 * transparent})`;
      ctx.beginPath(); ctx.arc(0, -3, headR, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(210,200,185,${0.7 * transparent})`;
      ctx.lineWidth = 2; ctx.stroke();

      // Hair
      ctx.strokeStyle = `rgba(150,140,120,${0.3 * transparent})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, -3 - headR); ctx.lineTo(0, -3 + 4); ctx.stroke();

      // Nose
      ctx.fillStyle = `rgba(210,200,185,${0.4 * transparent})`;
      ctx.beginPath(); ctx.moveTo(-3, -3 - headR + 2); ctx.lineTo(3, -3 - headR + 2); ctx.lineTo(0, -3 - headR - 4); ctx.closePath(); ctx.fill();

      // Ears
      ctx.fillStyle = `rgba(200,190,175,${0.2 * transparent})`;
      ctx.beginPath(); ctx.ellipse(-headR - 2, -3, 3, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = `rgba(210,200,185,${0.4 * transparent})`; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(headR + 2, -3, 3, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Gravity axis
      if (lightLevel > 0) {
        const ag = ctx.createRadialGradient(0, -3, 0, 0, -3, 5 + lightLevel * 3);
        ag.addColorStop(0, `rgba(220,210,180,${alpha * lightLevel * 0.8 * transparent})`);
        ag.addColorStop(1, `rgba(220,210,180,0)`);
        ctx.fillStyle = ag;
        ctx.beginPath(); ctx.arc(0, -3, 5 + lightLevel * 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(240,230,200,${alpha * lightLevel * 0.9 * transparent})`;
        ctx.beginPath(); ctx.arc(0, -3, 2, 0, Math.PI * 2); ctx.fill();
      }

      ctx.restore();
    };

    const drawVeils = (alpha: number, opacity: number, dissolve: boolean, extraDim = 1) => {
      veils.forEach(v => {
        const px = cx + v.x + Math.sin(time * v.sp + v.drift) * 12;
        const py = cy + v.y + Math.cos(time * v.sp * 0.7 + v.drift) * 8;
        const rot = v.rot + time * 0.05;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        const nv = fbm(px * 0.01 + time * 0.1, py * 0.01 + time * 0.08, 3);
        const w = v.w * (1 + (nv - 0.5) * 0.3);
        const h = v.h * (1 + (nv - 0.5) * 0.2);
        const vg = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h));
        const baseA = alpha * opacity * (dissolve ? 0.04 : 0.15) * extraDim;
        vg.addColorStop(0, `rgba(${v.co[0]},${v.co[1]},${v.co[2]},${baseA})`);
        vg.addColorStop(0.6, `rgba(${v.co[0]},${v.co[1]},${v.co[2]},${baseA * 0.5})`);
        vg.addColorStop(1, `rgba(${v.co[0]},${v.co[1]},${v.co[2]},0)`);
        ctx.fillStyle = vg;
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          const nr = 1 + fbm(Math.cos(a) + time * 0.15 + v.drift, Math.sin(a) + time * 0.1, 2) * 0.35;
          const rx = Math.cos(a) * w * nr, ry = Math.sin(a) * h * nr;
          a === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });
    };

    const drawCloudThoughts = (alpha: number) => {
      ctx.save();
      cloudThoughts.forEach(cloud => {
        if (!cloud.active && Math.random() < 0.003) {
          cloud.active = true;
          cloud.timer = 0;
          cloud.angle = Math.random() * Math.PI * 2;
          const dist = 90 + Math.random() * 70;
          cloud.x = cx + Math.cos(cloud.angle) * dist;
          cloud.y = cy - 3 + Math.sin(cloud.angle) * dist * 0.7;
          cloud.size = 12 + Math.random() * 12;
          cloud.speed = 0.015 + Math.random() * 0.025;
          // IMPORTANT: Capture localeData inside closure, wait, data is passed inside render.
          // In effect, data changes on re-mount, we use latest words.
          
        }

        // Just assign a word safely
        if (cloud.active && !cloud.word) {
            cloud.word = localeData[currentLang].thoughtWords[Math.floor(Math.random() * localeData[currentLang].thoughtWords.length)];
        }
        
        if (cloud.active) {
          cloud.timer += cloud.speed;
          const lifePhase = cloud.timer * Math.PI;
          if (lifePhase < Math.PI) {
            const opacity = Math.sin(lifePhase) * 0.7;
            const driftX = Math.sin(lifePhase * 0.8) * 10;
            const driftY = Math.cos(lifePhase * 0.6) * 8;
            const currentX = cloud.x + driftX;
            const currentY = cloud.y + driftY - 15 * Math.sin(lifePhase);
            
            ctx.save();
            ctx.translate(currentX, currentY);
            ctx.globalAlpha = alpha * opacity;
            
            ctx.shadowColor = 'rgba(220, 230, 255, 0.5)';
            ctx.shadowBlur = 20;
            
            const cloudR = cloud.size * 0.7;
            ctx.fillStyle = `rgba(${cloud.color[0]}, ${cloud.color[1]}, ${cloud.color[2]}, ${alpha * opacity * 0.6})`;
            ctx.beginPath();
            ctx.arc(0, 0, cloudR, 0, Math.PI * 2);
            ctx.arc(cloudR * 0.7, -cloudR * 0.3, cloudR * 0.8, 0, Math.PI * 2);
            ctx.arc(-cloudR * 0.7, -cloudR * 0.2, cloudR * 0.9, 0, Math.PI * 2);
            ctx.arc(cloudR * 0.3, -cloudR * 0.6, cloudR * 0.7, 0, Math.PI * 2);
            ctx.arc(-cloudR * 0.3, -cloudR * 0.7, cloudR * 0.8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.shadowBlur = 8;
            ctx.font = `${Math.floor(cloudR * 0.8)}px sans-serif`;
            ctx.fillStyle = `rgba(255, 255, 245, ${alpha * opacity * 0.9})`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cloud.word, 0, -cloudR * 0.2);
            
            ctx.restore();
          } else {
            cloud.active = false;
            cloud.word = ''; // clear word to reset next time
          }
        }
      });
      ctx.restore();
    };

    const s0 = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      drawTopBody(cx, cy, 1.2, alpha * 0.6, 0);
      drawVeils(alpha, 1, false);
      const fog = ctx.createRadialGradient(cx, cy, 20, cx, cy, 150);
      fog.addColorStop(0, `rgba(140,110,160,${alpha * 0.04})`);
      fog.addColorStop(1, `rgba(100,80,130,${alpha * 0.08})`);
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    };

    const s1 = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      const pulse = Math.sin(time * 0.6) * 0.5 + 0.5;
      drawTopBody(cx, cy, 1.2, alpha, 0.3 + pulse * 0.5);

      const ba = ctx.createRadialGradient(cx, cy, 10, cx, cy, 55 + pulse * 15);
      ba.addColorStop(0, `rgba(130,200,220,${alpha * 0.1})`);
      ba.addColorStop(0.6, `rgba(110,180,200,${alpha * 0.04})`);
      ba.addColorStop(1, 'rgba(110,180,200,0)');
      ctx.fillStyle = ba;
      ctx.beginPath(); ctx.arc(cx, cy, 55 + pulse * 15, 0, Math.PI * 2); ctx.fill();

      const focusDist = 100 + Math.sin(time * 0.3) * 10;
      const focusX = cx, focusY = cy - 14 * 1.2 - focusDist;
      const eyeL = { x: cx - 5 * 1.2, y: cy - 3 * 1.2 - 14 * 1.2 };
      const eyeR = { x: cx + 5 * 1.2, y: cy - 3 * 1.2 - 14 * 1.2 };

      const bl = ctx.createLinearGradient(eyeL.x, eyeL.y, focusX, focusY);
      bl.addColorStop(0, `rgba(235,200,80,${alpha * 0.45})`);
      bl.addColorStop(1, `rgba(235,200,80,${alpha * 0.6})`);
      ctx.strokeStyle = bl; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(eyeL.x, eyeL.y); ctx.lineTo(focusX, focusY); ctx.stroke();
      ctx.strokeStyle = `rgba(235,200,80,${alpha * 0.04})`; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(eyeL.x, eyeL.y); ctx.lineTo(focusX, focusY); ctx.stroke();

      const br = ctx.createLinearGradient(eyeR.x, eyeR.y, focusX, focusY);
      br.addColorStop(0, `rgba(235,200,80,${alpha * 0.45})`);
      br.addColorStop(1, `rgba(235,200,80,${alpha * 0.6})`);
      ctx.strokeStyle = br; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(eyeR.x, eyeR.y); ctx.lineTo(focusX, focusY); ctx.stroke();
      ctx.strokeStyle = `rgba(235,200,80,${alpha * 0.04})`; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(eyeR.x, eyeR.y); ctx.lineTo(focusX, focusY); ctx.stroke();

      const fp = ctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, 12 + pulse * 5);
      fp.addColorStop(0, `rgba(245,220,90,${alpha * 0.5})`);
      fp.addColorStop(1, 'rgba(245,220,90,0)');
      ctx.fillStyle = fp; ctx.beginPath(); ctx.arc(focusX, focusY, 12 + pulse * 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255,240,120,${alpha * 0.7})`;
      ctx.beginPath(); ctx.arc(focusX, focusY, 2.5, 0, Math.PI * 2); ctx.fill();

      ctx.globalAlpha = 0.3;
      drawVeils(alpha, 0.3, false);
      ctx.globalAlpha = 1;

      ctx.restore();
    };

    const s2 = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      const pulse = Math.sin(time * 0.5) * 0.5 + 0.5;

      drawTopBody(cx, cy, 1.2, alpha, 0.7);

      const ba = ctx.createRadialGradient(cx, cy, 15, cx, cy, 70 + pulse * 10);
      ba.addColorStop(0, `rgba(120,190,210,${alpha * 0.12})`);
      ba.addColorStop(1, 'rgba(120,190,210,0)');
      ctx.fillStyle = ba; ctx.beginPath(); ctx.arc(cx, cy, 70 + pulse * 10, 0, Math.PI * 2); ctx.fill();

      const noseY = cy - 3 * 1.2 - 14 * 1.2 - 4 * 1.2;
      const fanDist = Math.min(W, H) * 0.45;
      const fanAngleHalf = Math.PI * 0.42;

      ctx.save(); ctx.translate(cx, noseY);
      for (let i = 20; i >= 0; i--) {
        const layerA = alpha * (0.008 + i * 0.003);
        const spread = fanAngleHalf * (0.5 + i / 20 * 0.5);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, fanDist * (0.4 + i / 20 * 0.6), -Math.PI / 2 - spread, -Math.PI / 2 + spread);
        ctx.closePath();
        ctx.fillStyle = `rgba(235,210,100,${layerA})`; ctx.fill();
      }
      ctx.strokeStyle = `rgba(235,210,100,${alpha * 0.06})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 0);
      ctx.arc(0, 0, fanDist, -Math.PI / 2 - fanAngleHalf, -Math.PI / 2 + fanAngleHalf);
      ctx.closePath(); ctx.stroke();
      ctx.restore();

      const earLx = cx - 16 * 1.2 - 2 * 1.2, earRx = cx + 16 * 1.2 + 2 * 1.2, earY = cy - 3 * 1.2;

      ctx.save(); ctx.translate(earLx, earY);
      for (let i = 15; i >= 0; i--) {
        const layerA = alpha * (0.006 + i * 0.002);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, fanDist * 0.7 * (0.4 + i / 15 * 0.6), Math.PI / 2, Math.PI / 2 + Math.PI);
        ctx.closePath();
        ctx.fillStyle = `rgba(150,200,180,${layerA})`; ctx.fill();
      }
      ctx.restore();

      ctx.save(); ctx.translate(earRx, earY);
      for (let i = 15; i >= 0; i--) {
        const layerA = alpha * (0.006 + i * 0.002);
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, fanDist * 0.7 * (0.4 + i / 15 * 0.6), -Math.PI / 2, -Math.PI / 2 + Math.PI);
        ctx.closePath();
        ctx.fillStyle = `rgba(150,200,180,${layerA})`; ctx.fill();
      }
      ctx.restore();

      const circR = 40 + pulse * 20 + ((time * 5) % 120);
      const circA = Math.max(0, 1 - circR / 200);
      ctx.strokeStyle = `rgba(180,220,200,${alpha * circA * 0.08})`; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(cx, cy - 3 * 1.2, circR, 0, Math.PI * 2); ctx.stroke();

      const ag = ctx.createLinearGradient(cx, cy - 120, cx, cy + 40);
      ag.addColorStop(0, `rgba(220,210,180,0)`);
      ag.addColorStop(0.3, `rgba(220,210,180,${alpha * 0.25})`);
      ag.addColorStop(0.7, `rgba(220,210,180,${alpha * 0.25})`);
      ag.addColorStop(1, `rgba(220,210,180,0)`);
      ctx.strokeStyle = ag; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(cx, cy - 120); ctx.lineTo(cx, cy + 40); ctx.stroke();

      ctx.restore();
    };

    const s3 = (alpha: number) => {
      if (alpha <= 0) return;
      ctx.save();
      const pulse = Math.sin(time * 0.4) * 0.5 + 0.5;

      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2 + time * 0.02;
        const nv = fbm(Math.cos(angle) + time * 0.08, Math.sin(angle) + time * 0.06, 3);
        const len = 90 + nv * 130 + Math.sin(time * 0.2 + i * 0.4) * 25;
        const sx = cx + Math.cos(angle) * 22, sy = cy - 3 + Math.sin(angle) * 22 * 0.85;
        const ex = cx + Math.cos(angle) * len, ey = cy - 3 + Math.sin(angle) * len * 0.85;
        
        const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, len * 0.6);
        const isForward = angle > Math.PI * 1.25 || angle < Math.PI * 0.75;
        const col = isForward ? '235,210,100' : '150,200,180';
        rg.addColorStop(0, `rgba(${col},${alpha * 0.08})`);
        rg.addColorStop(0.4, `rgba(${col},${alpha * 0.04})`);
        rg.addColorStop(1, `rgba(${col},0)`);
        
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(sx, sy, len * 0.8, 0, Math.PI * 2); ctx.fill();
      }

      const rainbowRadius = Math.min(W, H) * 0.35;
      const rainbowColors = [
        'rgba(255, 120, 120, 0.2)',
        'rgba(255, 200, 100, 0.2)',
        'rgba(255, 255, 120, 0.2)',
        'rgba(120, 255, 120, 0.2)',
        'rgba(120, 200, 255, 0.2)',
        'rgba(200, 120, 255, 0.2)'
      ];
      
      for (let i = 0; i < rainbowColors.length; i++) {
        ctx.save();
        ctx.globalAlpha = alpha * 0.5;
        ctx.beginPath();
        ctx.arc(cx, cy - 3, rainbowRadius + i * 6, 0, Math.PI * 2);
        ctx.strokeStyle = rainbowColors[i];
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();
      }

      drawTopBody(cx, cy, 1.2, alpha, 1, 0.8);

      const ba = ctx.createRadialGradient(cx, cy - 3, 10, cx, cy - 3, 90 + pulse * 15);
      ba.addColorStop(0, `rgba(160,220,200,${alpha * 0.1})`);
      ba.addColorStop(0.6, `rgba(140,200,180,${alpha * 0.05})`);
      ba.addColorStop(1, 'rgba(140,200,180,0)');
      ctx.fillStyle = ba; ctx.beginPath(); ctx.arc(cx, cy - 3, 90 + pulse * 15, 0, Math.PI * 2); ctx.fill();

      drawCloudThoughts(alpha);

      ctx.globalAlpha = alpha * 0.02;
      for (let i = 0; i < 3; i++) {
        const dist = 150 + i * 30;
        ctx.beginPath(); ctx.arc(cx, cy - 3, dist, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(200,220,240,0.2)'; ctx.lineWidth = 0.5; ctx.stroke();
      }

      ctx.strokeStyle = `rgba(220,210,180,${alpha * 0.12})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, cy - 160); ctx.lineTo(cx, cy + 80); ctx.stroke();

      ctx.restore();
    };

    const draws = [s0, s1, s2, s3];

    const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const drawBg = (sf: number) => {
      const idx = Math.floor(sf), fr = sf - idx, nx = Math.min(idx + 1, 3);
      const sceneBg = data.scenes[idx].bg;
      const nextBg = data.scenes[nx].bg;
      const r = sceneBg[0] * (1 - fr) + nextBg[0] * fr;
      const g = sceneBg[1] * (1 - fr) + nextBg[1] * fr;
      const b = sceneBg[2] * (1 - fr) + nextBg[2] * fr;
      const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.75);
      gr.addColorStop(0, `rgb(${r | 0},${g | 0},${b | 0})`);
      gr.addColorStop(1, 'rgb(5,5,16)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
      
      ctx.globalAlpha = gA;
      amb.forEach(p => {
        p.x += p.vx + Math.sin(time * 0.2 + p.ph) * 0.02;
        p.y += p.vy + Math.cos(time * 0.15 + p.ph) * 0.015;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,195,185,${p.al * (0.7 + Math.sin(time * 0.5 + p.ph) * 0.3)})`;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    let lt = 0;
    const loop = (ts: number) => {
      if (!lt) lt = ts;
      const dt = Math.min((ts - lt) / 1000, 0.05);
      lt = ts;
      time += dt;
      
      if (gA < 1) gA = Math.min(1, gA + dt * 0.5);
      if (transRef.current) transTRef.current = Math.min(transTRef.current + dt * 0.6, 1);
      
      ctx.clearRect(0, 0, W, H);
      
      const sf = transRef.current ? curSceneRef.current + (targetSceneRef.current - curSceneRef.current) * ease(transTRef.current) : curSceneRef.current;
      drawBg(sf);
      
      ctx.globalAlpha = gA;
      if (transRef.current) {
        const e2 = ease(transTRef.current);
        draws[curSceneRef.current](1 - e2);
        draws[targetSceneRef.current](e2);
      } else {
        draws[curSceneRef.current](1);
      }
      ctx.globalAlpha = 1;
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [data]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden aspect-[4/5] md:aspect-[16/9] shadow-2xl border border-white/10 mt-8 mb-12" style={{ backgroundColor: '#050510' }}>
      
      {showIntro && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm bg-black/60 transition-opacity duration-1000"
          onClick={() => setShowIntro(false)}
        >
          <h3 className="text-3xl md:text-4xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-[#e8e4df] to-[#a89880] mb-3 text-center px-4">
            {data.introTitle}
          </h3>
          <p className="text-sm md:text-base tracking-[0.2em] text-[#e8e4df]/60 italic mb-12 text-center px-4">
            {data.introSub}
          </p>
          <div className="px-8 py-3 rounded-full border border-white/20 bg-white/5 text-white/70 tracking-[0.2em] uppercase text-sm animate-pulse hover:bg-white/10 transition-colors">
            {data.introHint}
          </div>
        </div>
      )}

      {/* Canvas Layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block cursor-pointer" 
        onClick={() => setAutoPlay(!autoPlay)}
      />
      <PlayPauseOverlay isPlaying={autoPlay} />

      {/* UI Overlay Layer */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* Top Info */}
        <div className="absolute top-6 right-6 text-white/30 tracking-[0.3em] font-mono text-xs z-10">
          {curScene + 1} / 4
        </div>
        
        {/* Caption Label */}
        <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 w-[85%] text-center transition-all duration-1000 ${trans ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="text-lg md:text-2xl font-light tracking-[0.25em] md:tracking-[0.35em] text-[#e8e4df] uppercase shadow-black drop-shadow-md">
            {data.scenes[curScene].label}
          </div>
          <div className="text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] text-[#e8e4df]/50 mt-2 italic shadow-black drop-shadow-md">
            {data.scenes[curScene].sub}
          </div>
        </div>

        {/* Progress Track */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
          <div className="h-full bg-gradient-to-r from-purple-400/40 via-cyan-400/40 to-emerald-400/40 transition-all duration-1000 ease-out" style={{ width: `${(curScene / 3) * 100}%` }} />
        </div>

        {/* Right dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
          {[0, 1, 2, 3].map(i => (
            <button 
              key={i}
              onClick={() => goToScene(i)}
              className={`w-2 h-2 rounded-full transition-all duration-500 border-none p-0
                ${i === curScene 
                  ? 'bg-white/70 scale-[1.8] shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/20 hover:bg-white/40'}`}
              aria-label={`Scene ${i + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => goToScene(curScene - 1)}
            disabled={curScene === 0}
            className="w-10 h-10 rounded-full border border-[#e8e4df]/20 bg-[#e8e4df]/5 text-[#e8e4df]/60 flex items-center justify-center hover:bg-[#e8e4df]/20 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-[#e8e4df]/5"
          >
            ◀
          </button>
          
          <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className="px-6 h-10 rounded-full border border-[#e8e4df]/20 bg-[#e8e4df]/5 text-[#e8e4df]/60 flex items-center justify-center hover:bg-[#e8e4df]/20 hover:text-white transition-all text-sm tracking-widest uppercase font-serif"
          >
            {autoPlay ? '⏸ pause' : '▶ auto'}
          </button>

          <button 
            onClick={() => goToScene(curScene + 1)}
            disabled={curScene === 3}
            className="w-10 h-10 rounded-full border border-[#e8e4df]/20 bg-[#e8e4df]/5 text-[#e8e4df]/60 flex items-center justify-center hover:bg-[#e8e4df]/20 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-[#e8e4df]/5"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
