import { XIcon } from "@phosphor-icons/react";
import { cn } from "../utilities/style-utilities";

interface TextBoxProps {
  value: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  autoComplete?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  onClear?: () => void;
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
  className,
}: TextBoxProps) {
  const autoCompleteValue = autoComplete ? "on" : "off";

  return (
    <div className={cn("relative", className)}>
      <input
        className="box-border w-full border-2 border-[#6283c0] bg-transparent px-[10px] py-2 align-top text-[14px] text-[#646464] transition-all outline-none placeholder:text-[#646464] placeholder:transition placeholder:duration-500 focus:bg-[#e6e6e0] focus:caret-[#757d8b] focus:placeholder:text-[#646464]"
        onChange={(e) => onChange && onChange(e.target.value)}
        value={value}
        type="text"
        placeholder={placeholder}
        autoComplete={autoCompleteValue}
        maxLength={maxLength}
        autoFocus={autoFocus}
      />
      <div
        className={cn(
          "absolute top-2 right-2.5 cursor-pointer rounded-full p-0.5 transition-all hover:bg-black/8",
          !onClear || value.length === 0 ? "hidden" : "block",
        )}
      >
        <XIcon color="#6283c0" size={20} onClick={() => onClear && onClear()} />
      </div>
    </div>
  );
}
