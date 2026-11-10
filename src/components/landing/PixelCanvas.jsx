import { useEffect, useRef } from 'react';

/* ---------------------------------------------------------------------------
 * PixelCanvas: a low-res canvas (one canvas pixel per `cell` CSS px) that is
 * upscaled with `image-rendering: pixelated`, so each pixel renders as a crisp
 * square block. `paint(cx, cy, cols, rows)` returns [r, g, b, a(0–1)] or null.
 * ------------------------------------------------------------------------- */

// Deterministic per-cell noise so the mosaic is stable across redraws.
export const cellNoise = (cx, cy) => {
  const s = Math.sin(cx * 127.1 + cy * 311.7) * 43758.5453;
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

const draw = (canvas, cell, paint) => {
  const cols = Math.max(1, Math.ceil(canvas.clientWidth / cell));
  const rows = Math.max(1, Math.ceil(canvas.clientHeight / cell));
  canvas.width = cols;
  canvas.height = rows;

  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(cols, rows);

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      const px = paint(cx, cy, cols, rows);
      if (!px) continue;
      const i = (cy * cols + cx) * 4;
      img.data[i] = px[0];
      img.data[i + 1] = px[1];
      img.data[i + 2] = px[2];
      img.data[i + 3] = Math.round(px[3] * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
};

export const PixelCanvas = ({ cell, paint, className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    draw(canvas, cell, paint);
    const observer = new ResizeObserver(() => draw(canvas, cell, paint));
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [cell, paint]);

  return <canvas ref={canvasRef} className={`pixel-canvas ${className || ''}`} aria-hidden="true" />;
};

export default PixelCanvas;
