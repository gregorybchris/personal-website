import { cn } from "../utilities/styleUtilities";

interface BookTagProps {
  tag: string;
  active: boolean;
  onClick: (tag: string) => void;
}

export function BookTag(props: BookTagProps) {
  return (
    <div
      onClick={() => props.onClick(props.tag)}
      className={cn(
        "mx-1 cursor-pointer px-3 py-1.5 text-accent duration-150 hover:bg-background-highlight-active hover:text-accent-focus hover:ease-linear",
        props.active && "bg-background-highlight",
      )}
    >
      <div className="text-sm">#{props.tag}</div>
    </div>
  );
}
