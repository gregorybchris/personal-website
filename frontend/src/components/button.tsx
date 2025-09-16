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
    <div
      onClick={onClick}
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[15px] py-2 align-top text-[14px] font-bold text-[#646464] transition duration-200 hover:cursor-pointer hover:bg-[#e6e6e0]",
        !enabled &&
          "border-[#acb5c4] bg-[#e6e6e0] text-[#b9b9b9] hover:cursor-default hover:bg-[#e6e6e0] hover:text-[#b9b9b9]",
        className,
      )}
    >
      {text}
    </div>
  );
}
