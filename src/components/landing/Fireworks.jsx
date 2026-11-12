import { useEffect, useImperativeHandle, useRef } from 'react';

/* ---------------------------------------------------------------------------
 * Fireworks: a transparent canvas overlay that plays a short fireworks show.
 * It only animates while a show is running, and never intercepts the pointer.
 *
 *   const fireworks = useRef(null);
 *   <Fireworks ref={fireworks} className="..." />
 *   fireworks.current.launch(clientX, clientY); // pops there, then rockets go up
 * ------------------------------------------------------------------------- */

const COLORS = ['#DE7A40', '#F59E0B', '#FBBF24', '#10B981', '#38BDF8', '#8B5CF6', '#EC4899', '#EF4444'];
const ROCKET_LANES = [0.5, 0.2, 0.8, 0.34, 0.66]; // horizontal targets, as a share of the width
const GRAVITY = 300; // px/s²
const DRAG = 1.9; // velocity lost per second

const rand = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

export const Fireworks = ({ ref, className }) => {
  const canvasRef = useRef(null);
  const launchRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let sparks = [];
    let rockets = [];
    let rings = [];
    let timers = [];
    let rafId = 0;
    let running = false;
    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // One shell bursting: a ring flash plus a round spray of sparks in two colours.
    const explode = (x, y, scale = 1) => {
      const primary = pick(COLORS);
      const secondary = pick(COLORS);
      const count = Math.round(64 * scale);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + rand(-0.12, 0.12);
        const speed = rand(180, 520) * scale;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          ttl: rand(0.9, 1.5),
          size: rand(2.6, 4.6),
          color: i % 3 === 0 ? secondary : primary,
        });
      }
      rings.push({ x, y, life: 0, ttl: 0.45, radius: 110 * scale, color: primary });
    };

    const frame = (now) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      // Rockets: a streak easing up to its target, then it bursts.
      rockets = rockets.filter((r) => {
        r.life += dt;
        const k = Math.min(1, r.life / r.ttl);
        const head = 1 - (1 - k) ** 3;
        const tail = Math.max(0, head - 0.07);
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(r.fromX + (r.toX - r.fromX) * tail, r.fromY + (r.toY - r.fromY) * tail);
        ctx.lineTo(r.fromX + (r.toX - r.fromX) * head, r.fromY + (r.toY - r.fromY) * head);
        ctx.stroke();
        if (k < 1) return true;
        explode(r.toX, r.toY);
        return false;
      });

      // Ring flash at the moment of the burst.
      rings = rings.filter((ring) => {
        ring.life += dt;
        const k = ring.life / ring.ttl;
        if (k >= 1) return false;
        ctx.globalAlpha = (1 - k) * 0.55;
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 3 * (1 - k) + 0.5;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius * (0.25 + 0.75 * k), 0, Math.PI * 2);
        ctx.stroke();
        return true;
      });

      // Sparks: slow down, fall, twinkle and fade.
      sparks = sparks.filter((s) => {
        s.life += dt;
        const k = s.life / s.ttl;
        if (k >= 1) return false;
        const keep = Math.max(0, 1 - DRAG * dt);
        s.vx *= keep;
        s.vy = s.vy * keep + GRAVITY * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        const twinkle = k > 0.55 ? rand(0.45, 1) : 1;
        ctx.globalAlpha = (1 - k * k) * twinkle;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size * (1 - k * 0.5);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 0.07, s.y - s.vy * 0.07);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        return true;
      });

      ctx.globalAlpha = 1;
      if (rockets.length || rings.length || sparks.length) {
        rafId = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      rafId = requestAnimationFrame(frame);
    };

    launchRef.current = (clientX, clientY) => {
      if (reducedMotion) return;
      const rect = canvas.getBoundingClientRect();
      // Skip the show entirely when the canvas is scrolled out of view.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      // Immediate pop where the answer was clicked…
      const originX = clientX == null ? width / 2 : clientX - rect.left;
      const originY = clientY == null ? height / 2 : clientY - rect.top;
      explode(originX, originY, 0.9);
      start();

      // …followed by rockets rising from the bottom edge.
      ROCKET_LANES.forEach((lane, i) => {
        const timerId = setTimeout(() => {
          timers = timers.filter((t) => t !== timerId);
          const toX = width * lane + rand(-40, 40);
          rockets.push({
            fromX: toX + rand(-90, 90),
            fromY: height,
            toX,
            toY: height * rand(0.1, 0.42),
            life: 0,
            ttl: rand(0.45, 0.6),
            color: pick(COLORS),
          });
          start();
        }, 140 + i * 190);
        timers.push(timerId);
      });
    };

    return () => {
      launchRef.current = null;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    launch: (clientX, clientY) => launchRef.current?.(clientX, clientY),
  }), []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default Fireworks;
