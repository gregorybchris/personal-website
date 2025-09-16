import { cn } from "../utilities/style-utilities";

interface TagProps {
  tag: string;
  selected: boolean;
  onClick: (tag: string) => void;
  className?: string;
}

export function Tag({ tag, selected, onClick, className }: TagProps) {
  return (
    <div
      onClick={() => onClick(tag)}
      className={cn(
        "cursor-pointer rounded-md px-2 py-1 text-sm text-accent transition-all hover:bg-black/5 hover:text-royal",
        selected && "bg-black/5 hover:bg-black/10",
        className,
      )}
    >
      #{tag}
    </div>
  );
}
