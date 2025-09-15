import { cn } from "../utilities/style-utilities";

interface TagProps {
  tag: string;
  active: boolean;
  onClick: (tag: string) => void;
}

export function Tag({ tag, active, onClick }: TagProps) {
  return (
    <div
      onClick={() => onClick(tag)}
      className={cn(
        "cursor-pointer rounded-md px-3 py-1 text-accent transition-all hover:bg-background-highlight hover:text-accent-focus active:bg-background-highlight-active",
        active && "bg-background-highlight",
      )}
    >
      <div className="font-raleway text-sm">#{tag}</div>
    </div>
  );
}
