import { useEffect, useState } from "react";
import pixelMeEyesClosed from "../assets/icons/pixel-me-eyes-closed.svg";
import pixelMeEyesOpen from "../assets/icons/pixel-me.svg";

interface PixelMeProps {
  className?: string;
  title?: string;
}

function boxMullerGaussian(mean: number, stddev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + stddev * z0;
}

export function PixelMe({ className, title }: PixelMeProps) {
  const [eyesClosed, setEyesClosed] = useState(false);

  useEffect(() => {
    let mounted = true;
    let blinkTimeoutId: number | null = null;
    let closeTimeoutId: number | null = null;

    const scheduleNextBlink = () => {
      if (!mounted) return;

      // Cornelis et al (2025)
      // blinks per minute: μ = 10.3, σ = 5.9
      // blink duration: μ = 128.8ms, σ = 56.4ms

      const delayMeanSec = 60 / 10.3;
      const delayStddevSec = (5.9 / (10.3 * 10.3)) * 60; // Approximation
      const randomDelayMs =
        boxMullerGaussian(delayMeanSec, delayStddevSec) * 1000;
      const durMeanMs = 128.8;
      const durStddevMs = 56.4;
      const blinkDurMs = boxMullerGaussian(durMeanMs, durStddevMs);

      blinkTimeoutId = window.setTimeout(() => {
        if (!mounted) return;
        setEyesClosed(true);

        closeTimeoutId = window.setTimeout(() => {
          if (!mounted) return;
          setEyesClosed(false);
          scheduleNextBlink();
        }, blinkDurMs);
      }, randomDelayMs);
    };

    scheduleNextBlink();

    return () => {
      mounted = false;
      if (blinkTimeoutId !== null) clearTimeout(blinkTimeoutId);
      if (closeTimeoutId !== null) clearTimeout(closeTimeoutId);
    };
  }, []);

  return (
    <img
      src={eyesClosed ? pixelMeEyesClosed : pixelMeEyesOpen}
      alt="Pixel art avatar of Chris Gregory"
      className={className}
      title={title || "Blink timing based on Cornelis et al. (2025)"}
    />
  );
}
