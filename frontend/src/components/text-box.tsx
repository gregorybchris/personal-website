import { XIcon } from "@phosphor-icons/react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr";
import { useRef } from "react";
import { cn } from "../utilities/style-utilities";

interface TextBoxProps {
  value: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  autoComplete?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  onClear?: () => void;
  showIcon?: boolean;
  className?: string;
}

export function TextBox({
  value,
  onChange,
  placeholder,
  autoComplete = true,
  maxLength,
  autoFocus = false,
  onClear,
  showIcon = true,
  className,
}: TextBoxProps) {
  const autoCompleteValue = autoComplete ? "on" : "off";
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={cn(
        "flex cursor-text items-center border-2 border-[#6283c0] px-2.5 transition-all focus:bg-[#e6e6e0]",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {showIcon && (
        <MagnifyingGlassIcon
          size={24}
          color="#6283c0"
          weight="duotone"
          className="flex-none p-0.5"
        />
      )}
      <input
        className="ml-1.5 w-full bg-transparent py-2.5 text-sm text-[#646464] outline-none placeholder:indent-0.5 placeholder:text-[#646464] placeholder:transition placeholder:duration-500 focus:caret-[#757d8b] focus:placeholder:text-[#646464]"
        onChange={(e) => onChange && onChange(e.target.value)}
        value={value}
        type="text"
        name="search"
        placeholder={placeholder}
        autoComplete={autoCompleteValue}
        maxLength={maxLength}
        autoFocus={autoFocus}
        ref={inputRef}
      />
      <div
        className={cn(
          "ml-1.5 flex-none cursor-pointer rounded-full p-1 transition-all hover:bg-black/8",
          !onClear || value.length === 0 ? "hidden" : "block",
        )}
      >
        <XIcon color="#6283c0" size={20} onClick={() => onClear && onClear()} />
      </div>
    </div>
  );
}
