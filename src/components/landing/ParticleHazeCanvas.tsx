import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
  alphaSpeed: number;
  color: string;
}

const COLORS = [
  'rgba(255, 62, 65, ',   // #FF3E41
  'rgba(223, 54, 124, ',  // #DF367C
  'rgba(255, 112, 153, ', // #FF7099
  'rgba(255, 255, 255, ', // White dust highlight
];

export const ParticleHazeCanvas: React.FC<{ isPaused?: boolean }> = ({ isPaused = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Responsive particle count (fewer on mobile for 60fps)
    const particleCount = width < 640 ? 20 : 36;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.45 + 0.18),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!reduced && !isPaused) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.alpha += p.alphaSpeed;

          if (p.alpha <= 0.1 || p.alpha >= 0.8) {
            p.alphaSpeed = -p.alphaSpeed;
          }

          // Loop particles when they float off the top or sides
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color}0.8)`;
        ctx.fill();
      }

      if (!isPaused) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isPaused, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full select-none z-5"
    />
  );
};
