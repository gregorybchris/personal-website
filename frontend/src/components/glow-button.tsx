import { useCallback, useRef, type ReactNode } from "react";
import "../styles/glow-button.css";

interface GlowButtonProps {
  text: string;
  icon?: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowButton({
  text,
  icon,
  className = "",
  glowColor = "#3b82f6",
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      button.style.setProperty("--pointer-x", `${x}px`);
      button.style.setProperty("--pointer-y", `${y}px`);
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    button.style.setProperty("--pointer-x", `-100px`);
    button.style.setProperty("--pointer-y", `-100px`);
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`glow-button ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
    >
      <div className="glow-button-glow" />
      <span className="glow-button-text">{text}</span>
      {icon && <span className="glow-button-icon">{icon}</span>}
    </button>
  );
}
