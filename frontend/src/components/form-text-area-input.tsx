import { cn } from "../utilities/style-utilities";

interface TextareaInputProps {
  name?: string;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  className?: string;
}

export function FormTextAreaInput({
  name,
  placeholder,
  maxLength,
  required = false,
  className,
}: TextareaInputProps) {
  return (
    <textarea
      className={cn(
        "box-border resize-none border-2 border-[#6283c0] bg-transparent px-[10px] py-2 align-top text-sm transition-all outline-none placeholder:text-[#646464] placeholder:transition placeholder:duration-500 focus:bg-black/8 focus:caret-[#757d8b] focus:placeholder:text-[#646464]",
        className,
      )}
      name={name}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
    />
  );
}
