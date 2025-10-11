import { cn } from "../utilities/style-utilities";

interface FormSubmitButtonProps {
  text: string;
  enabled?: boolean;
  className?: string;
}

export function FormSubmitButton({
  text,
  enabled = true,
  className,
}: FormSubmitButtonProps) {
  return (
    <input
      type="submit"
      value={text}
      className={cn(
        "box-border border-2 border-[#6283c0] bg-transparent px-[15px] py-1.5 align-top text-sm transition-all hover:cursor-pointer hover:bg-black/8",
        !enabled &&
          "border-[#acb5c4] bg-black/8 text-[#b9b9b9] hover:cursor-not-allowed hover:bg-black/8 hover:text-[#b9b9b9]",
        className,
      )}
    />
  );
}
