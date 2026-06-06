import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

export default function CoreHeroAvatar({ 
  stages, 
  evolutionStage, 
  allActive 
}: { 
  stages: { grounding: boolean; breathing: boolean; attention: boolean; space: boolean };
  evolutionStage: number;
  allActive: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduceMotion } = useAccessibility();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed size for the avatar canvas
    const size = 120;
    canvas.width = size * window.devicePixelRatio;
    canvas.height = size * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += reduceMotion ? 0 : 0.016;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2; // Perfectly centered

      ctx.save();
      
      // Levitation
      let hoverY = 0;
      if (allActive) hoverY = Math.sin(time * 1.2) * 3;
      else if (!stages.grounding && !stages.attention) hoverY = Math.sin(time * 2) * 4;

      ctx.translate(cx, cy + hoverY);

      // ── Evolution Stage Particles ──
      if (evolutionStage >= 1 && !reduceMotion) {
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
      const isActive = stages.grounding || stages.attention || stages.breathing || stages.space;
      const baseAlpha = isActive ? 1 : 0.6;

      const skinColor = `rgba(235,182,123,${baseAlpha})`;
      const hoodieColor = evolutionStage >= 2
        ? `rgba(20,40,35,${baseAlpha})`
        : evolutionStage === 1
        ? `rgba(25,38,32,${baseAlpha})`
        : `rgba(30,42,36,${baseAlpha})`;
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

      // Eyes
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
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(-4, -30, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(4, -30, 2, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else if (evolutionStage >= 2) {
        ctx.strokeStyle = 'rgba(250,204,21,0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-6, -30); ctx.quadraticCurveTo(-3, -27, -1, -30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(1, -30); ctx.quadraticCurveTo(3, -27, 6, -30); ctx.stroke();
        ctx.fillStyle = 'rgba(250,204,21,0.6)';
        ctx.beginPath(); ctx.arc(-3.5, -29, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(3.5, -29, 1, 0, Math.PI * 2); ctx.fill();
      } else {
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

      // Hands
      ctx.fillStyle = skinColor;
      ctx.strokeStyle = detailColor;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(-4, 28, 8, 4, Math.PI * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(3, 27, 8, 4, -Math.PI * 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-2, 25); ctx.lineTo(2, 24); ctx.stroke();

      // Infinity Rainbow
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
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [stages, evolutionStage, allActive, reduceMotion]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: 90, height: 90 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" 
    />
  );
}
