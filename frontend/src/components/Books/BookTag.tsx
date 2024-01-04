import { cn } from "../../utilities/styleUtilities";

interface BookTagProps {
  tag: string;
  active: boolean;
  onClick: (tag: string) => void;
}

export default function BookTag(props: BookTagProps) {
  return (
    <div
      onClick={() => props.onClick(props.tag)}
      className={cn(
        "px-3 py-1.5 mx-1 text-accent hover:cursor-pointer hover:bg-background-highlight-active hover:text-accent-focus hover:ease-linear duration-150",
        props.active && "bg-background-highlight"
      )}
    >
      <div className="text-sm">#{props.tag}</div>
    </div>
  );
}
