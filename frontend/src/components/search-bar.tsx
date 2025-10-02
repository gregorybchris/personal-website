import { cn } from "../utilities/style-utilities";
import { Button } from "./button";
import { TextBox } from "./text-box";

interface SearchBarProps {
  placeholder?: string;
  text: string;
  setText: (text: string) => void;
  onSubmit?: (text: string) => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  placeholder,
  text,
  setText,
  onSubmit,
  autoFocus,
  className,
}: SearchBarProps) {
  const placeholderText = placeholder ?? "Search";

  function onClear() {
    setText("");
    if (onSubmit) {
      onSubmit("");
    }
  }

  return (
    <div className={cn("flex w-[400px] flex-row gap-1", className)}>
      <TextBox
        value={text}
        onChange={(text) => setText(text)}
        placeholder={placeholderText}
        autoFocus={autoFocus}
        className="w-full"
        onClear={onClear}
      />

      {onSubmit && <Button text="Search" onClick={() => onSubmit(text)} />}
    </div>
  );
}
