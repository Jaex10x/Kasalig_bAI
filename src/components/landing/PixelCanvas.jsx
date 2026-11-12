import { useEffect, useRef } from 'react';

/* ---------------------------------------------------------------------------
 * PixelCanvas: a low-res canvas (one canvas pixel per `cell` CSS px) that is
 * upscaled with `image-rendering: pixelated`, so each pixel renders as a crisp
 * square block. `paint(cx, cy, cols, rows, tick)` returns [r, g, b, a(0–1)] or null.
 *
 * Pass `interval` (ms) to animate: every interval the `tick` handed to `paint`
 * advances by one and the mosaic cross-fades to the new frame over `fade` ms.
 * ------------------------------------------------------------------------- */

// Deterministic per-cell noise so the mosaic is stable across redraws.
// `seed` re-rolls the pattern (used as the animation tick).
export const cellNoise = (cx, cy, seed = 0) => {
  const s = Math.sin(cx * 127.1 + cy * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Build a color ramp from [[stop, '#hex'], ...]; returns t(0–1) => [r, g, b]. */
export const makeRamp = (stops) => {
  const parsed = stops.map(([t, hex]) => [t, hexToRgb(hex)]);
  return (t) => {
    if (t <= parsed[0][0]) return parsed[0][1];
    for (let i = 1; i < parsed.length; i++) {
      const [t1, c1] = parsed[i];
      if (t <= t1) {
        const [t0, c0] = parsed[i - 1];
        const k = (t - t0) / (t1 - t0);
        return c0.map((c, j) => c + (c1[j] - c) * k);
      }
    }
    return parsed[parsed.length - 1][1];
  };
};

const gridSize = (canvas, cell) => ({
  cols: Math.max(1, Math.ceil(canvas.clientWidth / cell)),
  rows: Math.max(1, Math.ceil(canvas.clientHeight / cell)),
});

/** RGBA bytes for one frame of the mosaic at the given tick. */
const buildFrame = (cols, rows, paint, tick) => {
  const data = new Uint8ClampedArray(cols * rows * 4);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const px = paint(cx, cy, cols, rows, tick);
      if (!px) continue;
      const i = (cy * cols + cx) * 4;
      data[i] = px[0];
      data[i + 1] = px[1];
      data[i + 2] = px[2];
      data[i + 3] = Math.round(px[3] * 255);
    }
  }
  return data;
};

const present = (canvas, cols, rows, data) => {
  // Assigning width/height clears the canvas, so only touch them on a real resize.
  if (canvas.width !== cols) canvas.width = cols;
  if (canvas.height !== rows) canvas.height = rows;
  canvas.getContext('2d').putImageData(new ImageData(data, cols, rows), 0, 0);
};

export const PixelCanvas = ({ cell, paint, className, interval = 0, fade = 450 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let tick = 0;
    let rafId = 0;
    let timerId = 0;

    const drawStatic = () => {
      cancelAnimationFrame(rafId); // a resize invalidates any in-flight cross-fade
      const { cols, rows } = gridSize(canvas, cell);
      present(canvas, cols, rows, buildFrame(cols, rows, paint, tick));
    };

    drawStatic();
    const resizeObserver = new ResizeObserver(drawStatic);
    resizeObserver.observe(canvas);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!(interval > 0) || reducedMotion) {
      return () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
      };
    }

    // Advance one tick, cross-fading from the current frame to the next.
    const step = () => {
      if (document.hidden) return;
      cancelAnimationFrame(rafId);

      const { cols, rows } = gridSize(canvas, cell);
      const from = buildFrame(cols, rows, paint, tick);
      tick += 1;
      const to = buildFrame(cols, rows, paint, tick);

      const duration = Math.min(fade, interval);
      if (!(duration > 0)) {
        present(canvas, cols, rows, to);
        return;
      }

      const mixed = new Uint8ClampedArray(from.length);
      const startedAt = performance.now();
      const frame = (now) => {
        const k = Math.min(1, Math.max(0, (now - startedAt) / duration));
        for (let i = 0; i < mixed.length; i++) mixed[i] = from[i] + (to[i] - from[i]) * k;
        present(canvas, cols, rows, mixed);
        if (k < 1) rafId = requestAnimationFrame(frame);
      };
      rafId = requestAnimationFrame(frame);
    };

    // Only run the clock while the canvas is actually on screen.
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      clearInterval(timerId);
      timerId = entry.isIntersecting ? setInterval(step, interval) : 0;
    });
    visibilityObserver.observe(canvas);

    return () => {
      clearInterval(timerId);
      cancelAnimationFrame(rafId);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [cell, paint, interval, fade]);

  return <canvas ref={canvasRef} className={`pixel-canvas ${className || ''}`} aria-hidden="true" />;
};

export default PixelCanvas;
