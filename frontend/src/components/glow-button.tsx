import { useCallback, useRef, type ReactNode } from "react";
import "../styles/glow-button.css";

interface GlowButtonProps {
  text: string;
  icon?: ReactNode;
  className?: string;
  glowColor?: string;
}

const HIDDEN_POSITION = "-100px";

export function GlowButton({
  text,
  icon,
  className,
  glowColor = "#2b7fff",
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      buttonRef.current?.style.setProperty("--pointer-x", `${x}px`);
      buttonRef.current?.style.setProperty("--pointer-y", `${y}px`);
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    buttonRef.current?.style.setProperty("--pointer-x", HIDDEN_POSITION);
    buttonRef.current?.style.setProperty("--pointer-y", HIDDEN_POSITION);
  }, []);

  return (
    <button
      ref={buttonRef}
      className={className ? `glow-button ${className}` : "glow-button"}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ "--glow-color": glowColor } as React.CSSProperties}
    >
      <div className="glow-button-glow" />
      <span className="glow-button-content">{text}</span>
      {icon && <span className="glow-button-content">{icon}</span>}
    </button>
  );
}
