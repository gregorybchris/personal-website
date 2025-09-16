import { cn } from "../utilities/style-utilities";

type TextInputType = "text" | "email" | "password";

interface TextInputProps {
  type: TextInputType;
  name?: string;
  placeholder?: string;
  autoComplete?: boolean;
  maxLength?: number;
  required?: boolean;
  className?: string;
}

export function FormTextInput({
  type,
  name,
  placeholder,
  autoComplete = true,
  maxLength,
  required = false,
  className,
}: TextInputProps) {
  const autoCompleteValue = autoComplete ? "on" : "off";

  return (
    <input
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[10px] py-2 align-top text-[14px] font-bold text-[#646464] outline-none transition duration-500 placeholder:text-[#646464] placeholder:transition placeholder:duration-500 focus:bg-[#e6e6e0] focus:caret-[#757d8b] focus:placeholder:text-[#646464]",
        className,
      )}
      type={type}
      name={name}
      placeholder={placeholder}
      autoComplete={autoCompleteValue}
      maxLength={maxLength}
      required={required}
    />
  );
}
