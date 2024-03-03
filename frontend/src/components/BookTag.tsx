import { cn } from "../utilities/styleUtilities";

interface BookTagProps {
  tag: string;
  active: boolean;
  onClick: (tag: string) => void;
}

export function BookTag({ tag, active, onClick }: BookTagProps) {
  return (
    <div
      onClick={() => onClick(tag)}
      className={cn(
        "mx-1 cursor-pointer rounded-md px-3 py-1 text-accent duration-150 hover:bg-background-highlight-active hover:text-accent-focus hover:ease-linear",
        active && "bg-background-highlight",
      )}
    >
      <div className="text-sm">#{tag}</div>
    </div>
  );
}
