interface SimpleLink {
  text: string;
  onClick?: () => void;
}

export function ActionLink({ text, onClick }: SimpleLink) {
  return (
    <span
      onClick={onClick}
      className="cursor-pointer font-raleway text-accent transition-all visited:text-accent hover:text-accent-focus active:text-accent-focus"
    >
      {text}
    </span>
  );
}
