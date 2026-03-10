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
  hue: number;
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

    const COUNT = isMobile ? 35 : 90;
    const CONNECT_DIST = isMobile ? 80 : 120;

    const makeParticle = (): Particle => {
      const edgeBias = Math.random();
      let x: number;
      if (edgeBias < 0.3) {
        x = Math.random() * W * 0.12;
      } else if (edgeBias < 0.6) {
        x = W - Math.random() * W * 0.12;
      } else {
        x = W * 0.12 + Math.random() * W * 0.76;
      }

      return {
        x,
        y: Math.random() * H,
        size: 0.4 + Math.random() * 1.5,
        opacity: 0.08 + Math.random() * 0.3,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: -0.08 - Math.random() * 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.012,
        hue: Math.random(),
      };
    };

    particlesRef.current = Array.from({ length: COUNT }, makeParticle);

    const handleScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      const viewH = window.innerHeight;
      const scrollY = scrollRef.current;
      ctx.clearRect(0, 0, W, viewH);

      // Collect visible particles for connection lines
      const visible: { x: number; sy: number; alpha: number }[] = [];

      for (const p of particlesRef.current) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.pulse += p.pulseSpeed;

        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const screenY = p.y - scrollY;
        if (screenY < -20 || screenY > viewH + 20) continue;

        const pulseAlpha = Math.sin(p.pulse) * 0.15 + 0.85;
        const alpha = p.opacity * pulseAlpha;

        visible.push({ x: p.x, sy: screenY, alpha });

        ctx.save();
        ctx.globalAlpha = alpha;

        const r = Math.round(200 + p.hue * 55);
        const g = Math.round(220 + p.hue * 35);
        const b = Math.round(230 + p.hue * 25);

        // Soft glow
        const grad = ctx.createRadialGradient(p.x, screenY, 0, p.x, screenY, p.size * 3);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
        grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.15})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size * 3, screenY - p.size * 3, p.size * 6, p.size * 6);

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        ctx.restore();
      }

      // Connection lines between nearby particles
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const dx = visible[i].x - visible[j].x;
          const dy = visible[i].sy - visible[j].sy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.04 * Math.min(visible[i].alpha, visible[j].alpha);
            ctx.save();
            ctx.globalAlpha = lineAlpha;
            ctx.strokeStyle = 'rgba(200, 230, 255, 1)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(visible[i].x, visible[i].sy);
            ctx.lineTo(visible[j].x, visible[j].sy);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      setSize();
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
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 9998 }}
        aria-hidden="true"
      />
      {/* Film grain texture overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 9997,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
    </>
  );
};
