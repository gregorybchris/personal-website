import { cn } from "../utilities/style-utilities";

interface FormSubmitButtonProps {
  text: string;
  className?: string;
}

export function FormSubmitButton({ text, className }: FormSubmitButtonProps) {
  return (
    <input
      type="submit"
      value={text}
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[15px] py-2 align-top text-[14px] font-bold text-[#646464] transition duration-200 hover:cursor-pointer hover:bg-[#e6e6e0] active:bg-[#d6d6d1] disabled:border-[#acb5c4] disabled:bg-[#e6e6e0] disabled:text-[#b9b9b9] disabled:hover:cursor-default disabled:hover:bg-[#e6e6e0] disabled:hover:text-[#b9b9b9]",
        className,
      )}
    />
  );
}
