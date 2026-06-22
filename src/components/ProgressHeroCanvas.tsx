import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useActivityTracker } from '../contexts/ActivityTrackerContext';
import { useAccessibility } from '../hooks/useAccessibility';
import { useLanguage } from '../hooks/useLanguage';
import { useTime } from '../contexts/TimeContext';

// ─── Streak & Evolution Logic ───────────────────────────────────────────────

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function calculateStreak(logs: { timestamp: string }[]): number {
  if (logs.length === 0) return 0;

  const activeDays = new Set(logs.map(l => l.timestamp.split('T')[0]));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = getDateString(d);
    if (activeDays.has(ds)) {
      streak++;
    } else {
      // Allow today to be missing (user hasn't practiced yet today)
      if (i === 0) continue;
      break;
    }
  }
  return streak;
}

// Evolution stage: 0 = beginner, 1 = intermediate, 2 = advanced
function getEvolutionStage(streak: number): 0 | 1 | 2 {
  if (streak >= 28) return 2; // 4+ weeks
  if (streak >= 7) return 1;  // 1+ week
  return 0;
}

function getWeeklyActivity(logs: { timestamp: string; category: string }[]): boolean[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const ds = getDateString(d);
    return logs.some(l => l.timestamp.startsWith(ds));
  });
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ProgressHeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { logs, getDailySummary } = useActivityTracker();
  const { reduceMotion } = useAccessibility();
  const { language } = useLanguage();
  const { hour } = useTime();

  const isNight = hour >= 18 || hour < 6;

  const [stages, setStages] = useState({
    grounding: false,
    breathing: false,
    attention: false,
    space: false,
  });

  const streak = useMemo(() => calculateStreak(logs), [logs]);
  const evolutionStage = useMemo(() => getEvolutionStage(streak), [streak]);
  const weeklyActivity = useMemo(() => getWeeklyActivity(logs), [logs]);
  const allActive = stages.grounding && stages.breathing && stages.attention && stages.space;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const summary = getDailySummary(today);

    let grounding = false, breathing = false, attention = false, space = false;
    summary.activities.forEach(act => {
      if (act.category === 'grounding' || act.category === 'movement' || act.category === 'swaying') grounding = true;
      if (act.category === 'breath' || act.category === 'vocal') breathing = true;
      if (act.category === 'checkin' || act.category === 'microdose') attention = true;
      if (act.category === 'journal' || act.category === 'chapter' || act.category === 'rabbithole') space = true;
    });

    setStages({ grounding, breathing, attention, space });
  }, [getDailySummary, logs]);

  // ─── Canvas Render ──────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0, height = 0;
    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // ── Precompute Stars ──
    const starCount = 80;
    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.3 + 0.2, // Slightly larger variation
      speed: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      time += reduceMotion ? 0 : 0.016;
      ctx.clearRect(0, 0, width, height);

      if (isNight) {
        // ── Starry Sky Background ──
        ctx.save();
        stars.forEach(star => {
          const sx = star.x * width;
          const sy = star.y * height;
          // Twinkling effect
          const opacity = 0.2 + ((Math.sin(time * star.speed + star.phase) + 1) / 2) * 0.6;
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Very slow upward drift
          if (!reduceMotion) {
            star.y -= star.speed * 0.0003; // Slower drift
            if (star.y < 0) star.y = 1;
          }
        });
        ctx.restore();

        // ── Northern Lights Waves ──
        ctx.save();
        for (let j = 0; j < 3; j++) {
            ctx.beginPath();
            ctx.moveTo(0, height);
            for (let i = 0; i <= width; i += 20) {
                const waveY = height * 0.35 + 
                     Math.sin((i * 0.008) + time * (0.15 + j * 0.05)) * 40 +
                     Math.cos((i * 0.004) - time * 0.1) * 35;
                ctx.lineTo(i, waveY - j * 25);
            }
            ctx.lineTo(width, height);
            ctx.lineTo(0, height);
            ctx.closePath();
            
            const gradient = ctx.createLinearGradient(0, height * 0.1, 0, height);
            if (j === 0) {
                gradient.addColorStop(0, `rgba(16, 185, 129, ${0.12 + Math.sin(time * 0.8) * 0.04})`); // Emerald
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else if (j === 1) {
                gradient.addColorStop(0, `rgba(6, 182, 212, ${0.1 + Math.cos(time * 0.7) * 0.04})`); // Cyan
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            } else {
                gradient.addColorStop(0, `rgba(139, 92, 246, ${0.08 + Math.sin(time * 0.9) * 0.03})`); // Purple
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        ctx.restore();
      } else {
         // Soft glow for daytime (Deep Blue atmosphere)
         ctx.save();
         const dayGlow = ctx.createRadialGradient(width/2, height, height*0.1, width/2, height, height);
         dayGlow.addColorStop(0, 'rgba(56, 189, 248, 0.1)'); // Sky blue subtle glow
         dayGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
         ctx.fillStyle = dayGlow;
         ctx.fillRect(0, 0, width, height);
         ctx.restore();
      }

      const cx = width / 2;
      const cy = height / 2.4;

      ctx.save();

      // ── Hover or Aura ──
      let hoverY = 0;
      if (allActive) {
        // Subtle levitation when all axes complete
        hoverY = Math.sin(time * 1.2) * 3;
      } else if (!stages.grounding && !stages.attention) {
        hoverY = Math.sin(time * 2) * 6;
      }

      ctx.translate(cx, cy + hoverY);

      // ── Stage 2: Full Aura (all axes active) ──
      if (allActive) {
        const auraRadius = 55 + Math.sin(time * 1.5) * 8;
        const aurap = (Math.sin(time * 1.5) + 1) / 2;
        const auraGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, auraRadius);
        auraGrad.addColorStop(0, `rgba(255,255,255,${0.08 + aurap * 0.06})`);
        auraGrad.addColorStop(0.5, `rgba(100,220,200,${0.06 + aurap * 0.04})`);
        auraGrad.addColorStop(1, 'rgba(100,220,200,0)');
        ctx.beginPath();
        ctx.arc(0, 5, auraRadius, 0, Math.PI * 2);
        ctx.fillStyle = auraGrad;
        ctx.fill();
      }

      // ── Space: Expanding waves + rotating rays ──
      if (stages.space) {
        ctx.save();
        ctx.translate(0, 5);
        for (let i = 0; i < 3; i++) {
          const phase = (time * 1.5 + i * (Math.PI * 2 / 3)) % (Math.PI * 2);
          const r = (phase / (Math.PI * 2)) * 120;
          const alpha = Math.max(0, 1 - r / 120);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${0.35 * alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.rotate(time * 0.1);
        for (let i = 0; i < 12; i++) {
          ctx.rotate(Math.PI / 6);
          ctx.beginPath();
          ctx.moveTo(15, 0);
          ctx.lineTo(250, 0);
          ctx.strokeStyle = `rgba(255,255,255,${0.08 + Math.sin(time * 2 + i) * 0.04})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Grounding: Golden axis ──
      if (stages.grounding) {
        ctx.save();
        ctx.shadowColor = 'rgba(250,204,21,0.8)';
        ctx.shadowBlur = 10;
        const grad = ctx.createLinearGradient(0, -height, 0, height);
        grad.addColorStop(0, 'rgba(250,204,21,0)');
        grad.addColorStop(0.3, 'rgba(250,204,21,0.9)');
        grad.addColorStop(0.5, 'rgba(239,68,68,0.9)');
        grad.addColorStop(0.8, 'rgba(250,204,21,0.9)');
        grad.addColorStop(1, 'rgba(250,204,21,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -height);
        ctx.lineTo(0, height);
        ctx.stroke();
        ctx.restore();
      }

      // ── Breathing: Pulsing circle ──
      if (stages.breathing) {
        ctx.save();
        ctx.translate(0, 5);
        const breathRadius = 30 + Math.sin(time * 2.5) * 15;
        ctx.shadowColor = 'rgba(56,189,248,0.5)';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = `rgba(56,189,248,${0.4 + Math.sin(time * 2.5) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, breathRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // ── Evolution Stage Effects ──
      if (evolutionStage >= 1) {
        // Stage 1+: Subtle particle orbit
        ctx.save();
        const particleCount = evolutionStage >= 2 ? 8 : 4;
        for (let i = 0; i < particleCount; i++) {
          const angle = time * 0.6 + (i * Math.PI * 2) / particleCount;
          const orbitR = evolutionStage >= 2 ? 48 : 40;
          const px = Math.cos(angle) * orbitR;
          const py = Math.sin(angle) * orbitR * 0.4 + 5;
          const alpha = 0.3 + Math.sin(time * 2 + i) * 0.2;
          ctx.beginPath();
          ctx.arc(px, py, evolutionStage >= 2 ? 2 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,255,220,${alpha})`;
          ctx.shadowColor = 'rgba(100,255,180,0.8)';
          ctx.shadowBlur = 4;
          ctx.fill();
        }
        ctx.restore();
      }

      // ── Hero Body ──
      ctx.save();
      const isActive = stages.grounding || stages.attention || stages.breathing || stages.space;
      const baseAlpha = isActive ? 1 : 0.6;

      const skinColor = `rgba(235,182,123,${baseAlpha})`;
      const hoodieColor = evolutionStage >= 2
        ? `rgba(20,40,35,${baseAlpha})`   // Deep teal for advanced
        : evolutionStage === 1
        ? `rgba(25,38,32,${baseAlpha})`   // Slightly warmer for intermediate
        : `rgba(30,42,36,${baseAlpha})`;  // Default
      const outlineColor = `rgba(15,20,18,${baseAlpha})`;
      const detailColor = `rgba(34,17,0,${baseAlpha})`;

      // Hood back
      ctx.fillStyle = hoodieColor;
      ctx.beginPath();
      ctx.arc(0, -32, 19, Math.PI, 0);
      ctx.lineTo(20, -10);
      ctx.lineTo(-20, -10);
      ctx.fill();

      // Face
      ctx.fillStyle = skinColor;
      ctx.beginPath();
      ctx.arc(0, -30, 11, 0, Math.PI * 2);
      ctx.fill();

      // Eyes — evolution-aware
      if (stages.attention) {
        const focusY = 25;
        ctx.save();
        let gradL = ctx.createLinearGradient(-4, -29, 0, focusY);
        gradL.addColorStop(0, 'rgba(255,255,255,0.9)');
        gradL.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradL;
        ctx.beginPath();
        ctx.moveTo(-5, -29); ctx.lineTo(-3, -29); ctx.lineTo(4, focusY); ctx.lineTo(-4, focusY);
        ctx.fill();
        let gradR = ctx.createLinearGradient(4, -29, 0, focusY);
        gradR.addColorStop(0, 'rgba(255,255,255,0.9)');
        gradR.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradR;
        ctx.beginPath();
        ctx.moveTo(3, -29); ctx.lineTo(5, -29); ctx.lineTo(4, focusY); ctx.lineTo(-4, focusY);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, focusY, 2 + Math.sin(time * 5), 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(-4, -30, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(4, -30, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (evolutionStage >= 2) {
        // Stage 2: half-open eyes with golden tint
        ctx.strokeStyle = 'rgba(250,204,21,0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-6, -30); ctx.quadraticCurveTo(-3, -27, -1, -30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1, -30); ctx.quadraticCurveTo(3, -27, 6, -30); ctx.stroke();
        // Golden dot pupils
        ctx.fillStyle = 'rgba(250,204,21,0.6)';
        ctx.beginPath(); ctx.arc(-3.5, -29, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3.5, -29, 1, 0, Math.PI * 2); ctx.fill();
      } else {
        // Default closed eyes
        ctx.strokeStyle = detailColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-6, -30); ctx.quadraticCurveTo(-3, -28, -1, -30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1, -30); ctx.quadraticCurveTo(3, -28, 6, -30); ctx.stroke();
      }

      // Nose & smile
      ctx.strokeStyle = detailColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-0.5, -26); ctx.quadraticCurveTo(0, -25, 0.5, -26); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-3, -22); ctx.quadraticCurveTo(0, -20, 3, -22); ctx.stroke();

      // Hood overlap
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -31, 13, -Math.PI * 0.8, Math.PI * 1.8, false);
      ctx.stroke();

      // Body
      ctx.fillStyle = hoodieColor;
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-13, -19);
      ctx.quadraticCurveTo(-26, -5, -26, 23);
      ctx.quadraticCurveTo(-28, 40, -15, 38);
      ctx.quadraticCurveTo(0, 42, 15, 38);
      ctx.quadraticCurveTo(28, 40, 26, 23);
      ctx.quadraticCurveTo(26, -5, 13, -19);
      ctx.fill();
      ctx.stroke();

      // Arm creases
      ctx.beginPath(); ctx.moveTo(-15, -12); ctx.quadraticCurveTo(-18, 20, -5, 28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(15, -12); ctx.quadraticCurveTo(18, 20, 5, 28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-15, 38); ctx.quadraticCurveTo(0, 32, 15, 38); ctx.stroke();

      // Hands (Dhyana mudra)
      ctx.fillStyle = skinColor;
      ctx.strokeStyle = detailColor;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(-4, 28, 8, 4, Math.PI * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(3, 27, 8, 4, -Math.PI * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-2, 25); ctx.lineTo(2, 24); ctx.stroke();

      // ── Rainbow Infinity ──
      ctx.lineWidth = 3.5;
      const gradInf = ctx.createLinearGradient(-15, 0, 15, 0);
      gradInf.addColorStop(0, `rgba(239,68,68,${baseAlpha})`);
      gradInf.addColorStop(0.2, `rgba(249,115,22,${baseAlpha})`);
      gradInf.addColorStop(0.4, `rgba(234,179,8,${baseAlpha})`);
      gradInf.addColorStop(0.6, `rgba(34,197,94,${baseAlpha})`);
      gradInf.addColorStop(0.8, `rgba(59,130,246,${baseAlpha})`);
      gradInf.addColorStop(1, `rgba(168,85,247,${baseAlpha})`);
      ctx.strokeStyle = gradInf;

      if (isActive) { ctx.shadowColor = 'rgba(255,255,255,0.4)'; ctx.shadowBlur = 6; }
      if (allActive) { ctx.shadowColor = 'rgba(255,255,255,0.8)'; ctx.shadowBlur = 12; }

      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.bezierCurveTo(-15, -6, -24, 15, -7, 13);
      ctx.bezierCurveTo(-2, 12, 0, 8, 0, 5);
      ctx.bezierCurveTo(15, -6, 24, 15, 7, 13);
      ctx.bezierCurveTo(2, 12, 0, 8, 0, 5);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [stages, reduceMotion, evolutionStage, allActive, isNight]);

  const bgClass = isNight ? 'bg-[#0A0C10]' : 'bg-[#0B152A]';

  return (
    <div className={`w-full h-[360px] rounded-[16px] ${bgClass} border border-white/[0.05] relative overflow-hidden flex flex-col justify-end transition-colors duration-1000`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
