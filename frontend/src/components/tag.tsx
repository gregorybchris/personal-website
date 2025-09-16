import { cn } from "../utilities/style-utilities";

interface TagProps {
  tag: string;
  selected: boolean;
  onClick: (tag: string) => void;
}

export function Tag({ tag, selected, onClick }: TagProps) {
  return (
    <div
      onClick={() => onClick(tag)}
      className={cn(
        "hover:text-royal cursor-pointer rounded-md px-3 py-1 text-accent transition-all hover:bg-black/5",
        selected && "bg-black/5 hover:bg-black/10",
      )}
    >
      <div className="text-sm">#{tag}</div>
    </div>
  );
}
