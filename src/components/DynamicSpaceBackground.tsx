import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
}

export const DynamicSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Δημιουργία αστεριών με βάθος (z-index)
    const numStars = 150;
    const stars: Star[] = [];

    const createStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2, // Βάθος για το parallax εφέ
      size: Math.random() * 1.5 + 0.5,
      color: `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.4})`,
    });

    for (let i = 0; i < numStars; i++) {
      stars.push(createStar());
    }

    // Παρακολούθηση της κίνησης του ποντικιού/δαχτύλου για το parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX - width / 2) * 0.05;
      targetY = (e.clientY - height / 2) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const render = () => {
      // Απαλή κίνηση ποντικιού (smoothing)
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Δημιουργία του βαθέος background με gradient (όπως στο βίντεο)
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 10,
        width / 2, height / 2, Math.max(width, height)
      );
      gradient.addColorStop(0, '#0d1117'); // Πολύ βαθύ μπλε/γκρι στο κέντρο
      gradient.addColorStop(0.5, '#070a0e');
      gradient.addColorStop(1, '#020406'); // Σχεδόν μαύρο στις άκρες
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Σχεδίαση και κίνηση αστεριών
      stars.forEach((star) => {
        // Αργή, οργανική κίνηση προς τα πάνω/πλάι (cosmic drift)
        star.y -= 0.1 * star.z;
        if (star.y < 0) star.y = height;

        // Εφαρμογή του Parallax βάσει της κίνησης του ποντικιού
        const renderX = star.x + mouseX * star.z;
        const renderY = star.y + mouseY * star.z;

        // Λάμψη αστεριών (twinkle εφέ)
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};
