interface SimpleLink {
  text: string;
  onClick?: () => void;
}

export function ActionLink({ text, onClick }: SimpleLink) {
  return (
    <span
      onClick={onClick}
      className="text-accent font-raleway transition-all hover:text-accent-focus cursor-pointer active:text-accent-focus visited:text-accent"
    >
      {text}
    </span>
  );
}
