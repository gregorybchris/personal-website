interface BookTagProps {
  tag: string;
  active: boolean;
  onClick: (tag: string) => void;
}

export default function BookTag(props: BookTagProps) {
  const background = props.active ? "bg-background-highlight" : "";

  return (
    <div
      onClick={() => props.onClick(props.tag)}
      className={`px-3 py-1.5 mx-1 text-accent hover:cursor-pointer hover:bg-background-highlight hover:text-accent-focus hover:ease-linear duration-150 active:bg-background-highlight-active ${background}`}
    >
      <div className="text-sm">#{props.tag}</div>
    </div>
  );
}
