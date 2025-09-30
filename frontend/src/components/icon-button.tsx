import { cn } from "../utilities/style-utilities";

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  enabled?: boolean;
  className?: string;
}

export function IconButton({
  children,
  onClick,
  enabled = true,
  className,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-row items-center gap-2 rounded-md px-3 py-1 hover:bg-black/5",
        !enabled && "opacity-50 hover:cursor-not-allowed hover:bg-transparent",
        className,
      )}
      aria-disabled={!enabled}
      disabled={!enabled}
    >
      {children}
    </button>
  );
}
