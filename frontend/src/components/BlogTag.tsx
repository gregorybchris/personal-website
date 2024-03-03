interface BlogTagProps {
  text: string;
  onClickTag: (tag: string) => void;
}

export function BlogTag({ text, onClickTag }: BlogTagProps) {
  return (
    <div
      className="mr-1 inline-block cursor-pointer rounded-md px-3 py-1 text-accent transition-all hover:bg-background-highlight hover:text-accent-focus active:bg-background-highlight-active"
      onClick={() => onClickTag(text)}
    >
      <div className="font-raleway text-sm">#{text}</div>
    </div>
  );
}
