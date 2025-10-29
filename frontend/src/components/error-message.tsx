import { SmileyXEyesIcon } from "@phosphor-icons/react";
import { cn } from "../utilities/style-utilities";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className }: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-row items-center gap-2 text-center",
        className
      )}
    >
      <div className="text-black/75">{message}</div>
      <SmileyXEyesIcon size={32} weight="duotone" color="#6283c0" />
    </div>
  );
}
