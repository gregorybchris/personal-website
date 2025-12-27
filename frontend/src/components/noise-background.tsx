import { useEffect, useRef } from "react";
import { cn } from "../utilities/style-utilities";

interface NoiseBackgroundProps {
  opacity?: number;
  fps?: number;
  scale?: number;
  blur?: number;
  colorDark?: string;
  colorLight?: string;
  className?: string;
}

const parseHex = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const val = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16,
  );
  return [(val >> 16) & 255, (val >> 8) & 255, val & 255];
};

export default function NoiseBackground({
  opacity = 0.9,
  fps = 10,
  scale = 1.2,
  blur = 0.0,
  colorDark = "#181B1E",
  colorLight = "#222429",
  className,
}: NoiseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let imageData: ImageData;
    let buffer: Uint32Array;

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.ceil(rect.width / scale);
      canvas.height = Math.ceil(rect.height / scale);
      imageData = ctx.createImageData(canvas.width, canvas.height);
      buffer = new Uint32Array(imageData.data.buffer);
    };

    setCanvasSize();
    const resizeObserver = new ResizeObserver(setCanvasSize);
    resizeObserver.observe(canvas);

    const [r1, g1, b1] = parseHex(colorDark);
    const [r2, g2, b2] = parseHex(colorLight);
    const dr = r2 - r1;
    const dg = g2 - g1;
    const db = b2 - b1;

    const draw = () => {
      for (let i = 0; i < buffer.length; i++) {
        const t = Math.random();
        const r = (r1 + t * dr) | 0;
        const g = (g1 + t * dg) | 0;
        const b = (b1 + t * db) | 0;
        buffer[i] = (255 << 24) | (b << 16) | (g << 8) | r;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const interval = setInterval(draw, 1000 / fps);
    draw();

    return () => {
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, [fps, scale, colorDark, colorLight]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none fixed inset-0 z-0 h-full w-full [image-rendering:pixelated]",
        className,
      )}
      style={{
        opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    />
  );
}
