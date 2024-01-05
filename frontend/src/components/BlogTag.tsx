interface BlogTagProps {
  text: string;
  onClickTag: (tag: string) => void;
}

export function BlogTag(props: BlogTagProps) {
  return (
    <div
      className="inline-block mr-1 text-accent py-1 px-3 transition-all cursor-pointer hover:bg-background-highlight hover:text-accent-focus active:bg-background-highlight-active"
      onClick={() => props.onClickTag(props.text)}
    >
      <span className="font-raleway text-sm">#{props.text}</span>
    </div>
  );
}
