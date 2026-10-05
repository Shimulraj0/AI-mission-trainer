import React, { useEffect, useRef } from 'react';

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate stars
    const starCount = 140;
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      alpha: number;
      speed: number;
      pulseSpeed: number;
      pulseAngle: number;
      color: string;
    }> = [];

    const colors = ['#ffffff', '#a5f3fc', '#bae6fd', '#fde047', '#ddd6fe'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.2 + 0.05,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Shooting star
    let shootingStar: {
      x: number;
      y: number;
      length: number;
      speed: number;
      dx: number;
      dy: number;
      active: boolean;
      life: number;
    } | null = null;

    const maybeSpawnShootingStar = () => {
      if (!shootingStar && Math.random() < 0.007) {
        shootingStar = {
          x: Math.random() * width * 0.8,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 50,
          speed: Math.random() * 7 + 9,
          dx: 1,
          dy: 0.6,
          active: true,
          life: 1.0,
        };
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep space ambient nebula glow
      const grad = ctx.createRadialGradient(
        width * 0.8,
        height * 0.2,
        20,
        width * 0.8,
        height * 0.2,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(14, 116, 144, 0.08)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
      grad.addColorStop(1, 'rgba(5, 8, 17, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render stars
      stars.forEach((star) => {
        star.pulseAngle += star.pulseSpeed;
        const currentAlpha = Math.max(
          0.1,
          star.alpha + Math.sin(star.pulseAngle) * 0.25
        );

        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow parallax drift
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      });

      // Render shooting star
      maybeSpawnShootingStar();
      if (shootingStar && shootingStar.active) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, ' + shootingStar.life + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.dx * shootingStar.length,
          shootingStar.y - shootingStar.dy * shootingStar.length
        );
        ctx.stroke();
        ctx.restore();

        shootingStar.x += shootingStar.dx * shootingStar.speed;
        shootingStar.y += shootingStar.dy * shootingStar.speed;
        shootingStar.life -= 0.02;

        if (shootingStar.life <= 0) {
          shootingStar = null;
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
