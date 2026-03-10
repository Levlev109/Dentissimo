import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  pulse: number;
  pulseSpeed: number;
  hue: number; // 0 = white, 1 = accent tint
}

export const DecorativeEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = document.documentElement.scrollHeight;

    const setSize = () => {
      W = window.innerWidth;
      H = document.documentElement.scrollHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const COUNT = isMobile ? 40 : 120;

    const makeParticle = (): Particle => {
      // Particles concentrate towards edges for a premium vignette feel
      const edgeBias = Math.random();
      let x: number;
      if (edgeBias < 0.35) {
        x = Math.random() * W * 0.15; // left edge
      } else if (edgeBias < 0.7) {
        x = W - Math.random() * W * 0.15; // right edge
      } else {
        x = W * 0.15 + Math.random() * W * 0.7; // middle (sparse)
      }

      return {
        x,
        y: Math.random() * H,
        size: 0.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.4,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: -0.1 - Math.random() * 0.3, // slowly rise
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.015,
        hue: Math.random(), // mix between white and accent
      };
    };

    particlesRef.current = Array.from({ length: COUNT }, makeParticle);

    const handleScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      const viewH = window.innerHeight;
      const scrollY = scrollRef.current;
      ctx.clearRect(0, 0, W, viewH);

      for (const p of particlesRef.current) {
        // Move
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += p.pulseSpeed;

        // Wrap around
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        // Only draw particles visible in viewport
        const screenY = p.y - scrollY;
        if (screenY < -20 || screenY > viewH + 20) continue;

        const pulseAlpha = Math.sin(p.pulse) * 0.15 + 0.85;
        const alpha = p.opacity * pulseAlpha;

        ctx.save();
        ctx.globalAlpha = alpha;

        // Accent tint: mix between pure white and soft emerald/cyan
        const r = Math.round(200 + p.hue * 55);
        const g = Math.round(220 + p.hue * 35);
        const b = Math.round(230 + p.hue * 25);

        // Glow
        const grad = ctx.createRadialGradient(p.x, screenY, 0, p.x, screenY, p.size * 3);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.8})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size * 3, screenY - p.size * 3, p.size * 6, p.size * 6);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        ctx.restore();
      }

      // Soft vignette edges
      const edgeW = isMobile ? 30 : 60;
      const edgeAlpha = 0.06;

      const lGlow = ctx.createLinearGradient(0, 0, edgeW, 0);
      lGlow.addColorStop(0, `rgba(140, 220, 255, ${edgeAlpha})`);
      lGlow.addColorStop(1, 'rgba(140, 220, 255, 0)');
      ctx.fillStyle = lGlow;
      ctx.fillRect(0, 0, edgeW, viewH);

      const rGlow = ctx.createLinearGradient(W, 0, W - edgeW, 0);
      rGlow.addColorStop(0, `rgba(140, 220, 255, ${edgeAlpha})`);
      rGlow.addColorStop(1, 'rgba(140, 220, 255, 0)');
      ctx.fillStyle = rGlow;
      ctx.fillRect(W - edgeW, 0, edgeW, viewH);

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      setSize();
      // Re-distribute particles across new page height
      const newH = document.documentElement.scrollHeight;
      for (const p of particlesRef.current) {
        p.y = Math.random() * newH;
      }
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 9998 }}
      aria-hidden="true"
    />
  );
};
