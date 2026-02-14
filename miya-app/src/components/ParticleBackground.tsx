import { useEffect, useRef } from 'react';

interface SakuraPetal {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  hue: number; // purple to pink range
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const petals: SakuraPetal[] = [];
    const stars: Star[] = [];
    const PETAL_COUNT = 20;
    const STAR_COUNT = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize petals
    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: 3 + Math.random() * 7,
        speed: 0.2 + Math.random() * 0.5,
        wobble: 0,
        wobbleSpeed: 0.015 + Math.random() * 0.025,
        opacity: 0.08 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
      });
    }

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.5 + Math.random() * 1.5,
        twinkleSpeed: 0.0005 + Math.random() * 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: 260 + Math.random() * 60, // purple to pink range
      });
    }

    const drawPetal = (p: SakuraPetal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      // Draw sakura petal shape (now cyber particles)
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.5, p.size * 0.5, 0, p.size * 0.3);
      ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      gradient.addColorStop(0, '#80dfff'); // cyber-200
      gradient.addColorStop(1, '#00ffcc'); // teal-500
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.restore();
    };

    const drawStar = (s: Star, time: number) => {
      const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
      const alpha = 0.1 + (twinkle * 0.5 + 0.5) * 0.25;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 70%, 75%, 1)`;
      ctx.fill();

      // Small bloom glow
      if (s.size > 1) {
        ctx.globalAlpha = alpha * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
        const glowGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
        glowGrad.addColorStop(0, `hsla(${s.hue}, 70%, 75%, 0.3)`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = Date.now();

      // Draw stars
      for (const s of stars) {
        drawStar(s, now);
      }

      // Animate and draw petals
      for (const p of petals) {
        p.y += p.speed;
        p.wobble += p.wobbleSpeed;
        p.x += Math.sin(p.wobble) * 0.4;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        drawPetal(p);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
