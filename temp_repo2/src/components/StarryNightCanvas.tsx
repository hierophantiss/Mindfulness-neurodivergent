import React, { useRef, useEffect } from 'react';

export default function StarryNightCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    interface Star {
      x: number;
      y: number;
      radius: number;
      alpha: number;
      color: string;
      phase: number;
      speed: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      alpha: number;
      angle: number;
    }

    const stars: Star[] = [];
    const colors = ['#ffffff', '#ffffff', '#ffffff', '#a8d8ff', '#ffd6a0'];
    const numStars = 180;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.2 + Math.random() * 1.4,
        alpha: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.02
      });
    }

    let shootingStars: ShootingStar[] = [];
    let lastShootingStar = 0;

    const render = (time: number) => {
      // 1. Clear background
      ctx.fillStyle = '#050d1a';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Nebula
      const grad1 = ctx.createRadialGradient(width * 0.2, height * 0.3, 0, width * 0.2, height * 0.3, width * 0.6);
      grad1.addColorStop(0, 'rgba(74, 158, 202, 0.15)'); // teal-ish blue
      grad1.addColorStop(1, 'transparent');
      
      const grad2 = ctx.createRadialGradient(width * 0.8, height * 0.7, 0, width * 0.8, height * 0.7, width * 0.5);
      grad2.addColorStop(0, 'rgba(155, 126, 224, 0.15)'); // purple
      grad2.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Stars
      stars.forEach(star => {
        star.phase += star.speed;
        const twinkle = 0.5 + 0.5 * Math.sin(star.phase);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Update and Draw Shooting Stars (spawn every ~3 seconds)
      if (time - lastShootingStar > 3000 && Math.random() > 0.5) {
        shootingStars.push({
          x: Math.random() * width,
          y: 0,
          length: 40 + Math.random() * 80,
          speed: 4 + Math.random() * 4,
          alpha: 1,
          angle: Math.PI / 4 // diagonal
        });
        lastShootingStar = time;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= 0.022;

        if (ss.alpha <= 0) {
          shootingStars.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      requestAnimationFrame(render);
    };

    let animationId = requestAnimationFrame(render);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none" 
      style={{ zIndex: -1 }}
    />
  );
}
