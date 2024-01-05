interface BlogTagProps {
  text: string;
  onClickTag: (tag: string) => void;
}

export function BlogTag(props: BlogTagProps) {
  return (
    <div
      className="mr-1 inline-block cursor-pointer px-3 py-1 text-accent transition-all hover:bg-background-highlight hover:text-accent-focus active:bg-background-highlight-active"
      onClick={() => props.onClickTag(props.text)}
    >
      <span className="font-raleway text-sm">#{props.text}</span>
    </div>
  );
}
