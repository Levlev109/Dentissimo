import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  size: number;
  speedY: number;
  drift: number;
  opacity: number;
  wobblePhase: number;
  wobbleSpeed: number;
  side: 'left' | 'right';
}

export const DecorativeEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<Drop[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    const setSize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    const BAND = 55; // how far from edge droplets appear

    const makeDrop = (): Drop => {
      const side: 'left' | 'right' = Math.random() < 0.5 ? 'left' : 'right';
      return {
        x: side === 'left'
          ? Math.random() * BAND
          : W - Math.random() * BAND,
        y: -Math.random() * 80,
        size: 1 + Math.random() * 2.5,
        speedY: 2 + Math.random() * 4,
        drift: (Math.random() - 0.5) * 0.15,
        opacity: 0.08 + Math.random() * 0.18,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.01 + Math.random() * 0.025,
        side,
      };
    };

    // Init drops
    const getCount = () => Math.min(Math.floor(W / 6), 220);
    dropsRef.current = Array.from({ length: getCount() }, () => {
      const d = makeDrop();
      d.y = Math.random() * H;
      return d;
    });

    // ── Draw flowing water streams along edges ─────────────

    const drawStreams = (time: number) => {
      // Multiple stream layers for depth
      const layers = [
        { width: 3, alphaBase: 0.04, speed: 0.002, freq: 0.018, amp: 12 },
        { width: 2, alphaBase: 0.03, speed: 0.003, freq: 0.025, amp: 8 },
        { width: 1.5, alphaBase: 0.025, speed: 0.004, freq: 0.04, amp: 5 },
      ];

      for (const layer of layers) {
        // Left stream
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let y = 0; y < H; y += 2) {
          const wave = Math.sin((y + time * layer.speed) * layer.freq) * layer.amp;
          ctx.lineTo(wave + 3, y);
        }
        ctx.lineTo(0, H);
        ctx.closePath();
        const lgLeft = ctx.createLinearGradient(0, 0, layer.amp + 10, 0);
        lgLeft.addColorStop(0, `rgba(140, 210, 255, ${layer.alphaBase + Math.sin(time * 0.0008) * 0.01})`);
        lgLeft.addColorStop(1, 'rgba(140, 210, 255, 0)');
        ctx.fillStyle = lgLeft;
        ctx.fill();

        // Right stream
        ctx.beginPath();
        ctx.moveTo(W, 0);
        for (let y = 0; y < H; y += 2) {
          const wave = Math.sin((y + time * layer.speed + 1.5) * layer.freq) * layer.amp;
          ctx.lineTo(W - wave - 3, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();
        const lgRight = ctx.createLinearGradient(W, 0, W - layer.amp - 10, 0);
        lgRight.addColorStop(0, `rgba(140, 210, 255, ${layer.alphaBase + Math.sin(time * 0.001) * 0.01})`);
        lgRight.addColorStop(1, 'rgba(140, 210, 255, 0)');
        ctx.fillStyle = lgRight;
        ctx.fill();
      }

      // Subtle flowing lines (like rivulets)
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const offsetPhase = i * 1.2;
        const speed = 0.0015 + i * 0.0005;

        // Left rivulet
        ctx.beginPath();
        for (let y = 0; y < H; y += 2) {
          const x = Math.sin((y + time * speed + offsetPhase) * 0.03) * (6 + i * 3)
                  + Math.sin((y + time * speed * 1.3) * 0.05) * 3;
          if (y === 0) ctx.moveTo(x + 2, y);
          else ctx.lineTo(x + 2, y);
        }
        ctx.strokeStyle = `rgba(160, 220, 255, ${0.04 + Math.sin(time * 0.0007 + i) * 0.015})`;
        ctx.stroke();

        // Right rivulet
        ctx.beginPath();
        for (let y = 0; y < H; y += 2) {
          const x = Math.sin((y + time * speed + offsetPhase + 2) * 0.03) * (6 + i * 3)
                  + Math.sin((y + time * speed * 1.3 + 1) * 0.05) * 3;
          if (y === 0) ctx.moveTo(W - x - 2, y);
          else ctx.lineTo(W - x - 2, y);
        }
        ctx.strokeStyle = `rgba(160, 220, 255, ${0.04 + Math.sin(time * 0.0009 + i) * 0.015})`;
        ctx.stroke();
      }

      // Soft edge glow
      const glowW = 35;
      const pulse = Math.sin(time * 0.0006) * 0.008;

      const lGlow = ctx.createLinearGradient(0, 0, glowW, 0);
      lGlow.addColorStop(0, `rgba(140, 215, 255, ${0.045 + pulse})`);
      lGlow.addColorStop(1, 'rgba(140, 215, 255, 0)');
      ctx.fillStyle = lGlow;
      ctx.fillRect(0, 0, glowW, H);

      const rGlow = ctx.createLinearGradient(W, 0, W - glowW, 0);
      rGlow.addColorStop(0, `rgba(140, 215, 255, ${0.045 + pulse})`);
      rGlow.addColorStop(1, 'rgba(140, 215, 255, 0)');
      ctx.fillStyle = rGlow;
      ctx.fillRect(W - glowW, 0, glowW, H);
    };

    // ── Draw water droplets ────────────────────────────────

    const drawDrop = (d: Drop) => {
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.globalAlpha = d.opacity;

      // Elongated teardrop shape based on speed
      const stretch = Math.min(d.speedY * 0.8, 4);
      const r = d.size;

      // Main drop body
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.6, r + stretch, 0, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(0, -stretch * 0.3, 0, 0, 0, r + stretch);
      grad.addColorStop(0, 'rgba(180, 230, 255, 0.5)');
      grad.addColorStop(0.4, 'rgba(140, 210, 255, 0.3)');
      grad.addColorStop(1, 'rgba(120, 200, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Tiny highlight
      ctx.beginPath();
      ctx.arc(-r * 0.15, -r * 0.4, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();

      ctx.restore();
    };

    // ── Animation loop ─────────────────────────────────────

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const now = Date.now();

      drawStreams(now);

      for (const d of dropsRef.current) {
        d.y += d.speedY;
        d.wobblePhase += d.wobbleSpeed;
        d.x += d.drift + Math.sin(d.wobblePhase) * 0.3;

        // Keep drops in their side band
        if (d.side === 'left') {
          if (d.x > BAND + 5) d.x = BAND;
          if (d.x < 0) d.x = 1;
        } else {
          if (d.x < W - BAND - 5) d.x = W - BAND;
          if (d.x > W) d.x = W - 1;
        }

        // Reset when off-screen
        if (d.y > H + 15) {
          Object.assign(d, makeDrop());
          d.y = -d.size - Math.random() * 30;
        }

        drawDrop(d);
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      setSize();
      const target = getCount();
      const drops = dropsRef.current;
      while (drops.length < target) {
        const d = makeDrop();
        d.y = Math.random() * H;
        drops.push(d);
      }
      while (drops.length > target) drops.pop();
    };

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 9998 }}
      aria-hidden="true"
    />
  );
};
