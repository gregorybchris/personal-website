import { cn } from "../utilities/style-utilities";

interface TagProps {
  tag: string;
  selected: boolean;
  onClick: (tag: string) => void;
  className?: string;
}

export function Tag({ tag, selected, onClick, className }: TagProps) {
  return (
    <button
      onClick={() => onClick(tag)}
      className={cn(
        "text-sky hover:text-royal group cursor-pointer rounded-md px-2 py-1 text-sm transition-all hover:bg-black/5",
        selected && "bg-black/5 hover:bg-black/10",
        className,
      )}
    >
      <span className="text-sky/50 group-hover:text-black/20">#</span>
      {tag}
    </button>
  );
}
