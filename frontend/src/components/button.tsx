import { cn } from "../utilities/style-utilities";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  enabled?: boolean;
  className?: string;
}

export function Button({
  text,
  onClick,
  enabled = true,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[15px] py-2 align-top text-sm transition-all duration-200 hover:cursor-pointer hover:bg-black/8",
        !enabled &&
          "border-[#acb5c4] bg-black/8 text-[#b9b9b9] hover:cursor-not-allowed hover:bg-black/8 hover:text-[#b9b9b9]",
        className,
      )}
      aria-disabled={!enabled}
      disabled={!enabled}
    >
      {text}
    </button>
  );
}
