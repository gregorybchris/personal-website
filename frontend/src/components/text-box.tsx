import { cn } from "../utilities/style-utilities";

interface TextBoxProps {
  value: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  autoComplete?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  className?: string;
}

export function TextBox({
  value,
  onChange,
  placeholder,
  autoComplete = true,
  maxLength,
  autoFocus = false,
  className,
}: TextBoxProps) {
  const autoCompleteValue = autoComplete ? "on" : "off";

  return (
    <input
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[10px] py-2 align-top text-[14px] text-[#646464] transition-all outline-none placeholder:text-[#646464] placeholder:transition placeholder:duration-500 focus:bg-[#e6e6e0] focus:caret-[#757d8b] focus:placeholder:text-[#646464]",
        className,
      )}
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
      type="text"
      placeholder={placeholder}
      autoComplete={autoCompleteValue}
      maxLength={maxLength}
      autoFocus={autoFocus}
    />
  );
}
