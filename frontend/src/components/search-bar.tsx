import { cn } from "../utilities/style-utilities";
import { Button } from "./button";
import { TextBox } from "./text-box";

interface SearchBarProps {
  placeholder?: string;
  text: string;
  setText: (text: string) => void;
  onSubmit?: (text: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder,
  text,
  setText,
  onSubmit,
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
        className="w-full"
      />

      {onSubmit && <Button text="Search" onClick={() => onSubmit(text)} />}

      <Button text="Clear" onClick={onClear} />
    </div>
  );
}
