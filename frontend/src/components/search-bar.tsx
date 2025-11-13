import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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
  debounceMs?: number;
  autoSubmit?: boolean;
}

export function SearchBar({
  placeholder,
  text,
  setText,
  onSubmit,
  autoFocus,
  className,
  debounceMs = 300,
  autoSubmit = true,
}: SearchBarProps) {
  const [localText, setLocalText] = useState(text);

  // Only debounce when onSubmit exists and autoSubmit is enabled
  const effectiveDebounce = onSubmit && autoSubmit ? debounceMs : 0;
  const [debouncedText] = useDebounce(localText, effectiveDebounce);

  // Sync external text changes to local state
  useEffect(() => {
    setLocalText(text);
  }, [text]);

  // Update parent with debounced text
  useEffect(() => {
    setText(debouncedText);
  }, [debouncedText, setText]);

  // Auto-trigger onSubmit when autoSubmit is enabled and debounced text changes
  useEffect(() => {
    if (onSubmit && autoSubmit) {
      onSubmit(debouncedText);
    }
  }, [debouncedText, onSubmit, autoSubmit]);

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.key === "Enter" && onSubmit) {
        onSubmit(localText);
      }
    }

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [localText, onSubmit]);

  const placeholderText = placeholder ?? "Search";

  function onClear() {
    setLocalText("");
    setText("");
    if (onSubmit) {
      onSubmit("");
    }
  }

  return (
    <div className={cn("flex flex-row gap-1", className)}>
      <TextBox
        value={localText}
        onChange={(text) => setLocalText(text)}
        placeholder={placeholderText}
        autoFocus={autoFocus}
        className="w-full"
        onClear={onClear}
      />

      {onSubmit && !autoSubmit && (
        <Button text="Search" onClick={() => onSubmit(localText)} />
      )}
    </div>
  );
}
