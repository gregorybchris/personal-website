import { cn } from "../utilities/style-utilities";

interface TextAreaProps {
  value: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  autoComplete?: boolean;
  maxLength?: number;
  className?: string;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  autoComplete = true,
  maxLength,
  className,
}: TextAreaProps) {
  const autoCompleteValue = autoComplete ? "on" : "off";

  return (
    <textarea
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[10px] py-2 align-top text-[14px] font-bold text-[#646464] outline-none transition duration-500 placeholder:text-[#646464] placeholder:transition placeholder:duration-500 focus:bg-[#e6e6e0] focus:caret-[#757d8b] focus:placeholder:text-[#646464]",
        className,
      )}
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
      placeholder={placeholder}
      autoComplete={autoCompleteValue}
      maxLength={maxLength}
    />
  );
}
