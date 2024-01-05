interface SimpleLink {
  text: string;
  link: string;
}

export function SimpleLink({ text, link }: SimpleLink) {
  return (
    <a
      className="text-accent font-raleway transition-all hover:text-accent-focus cursor-pointer active:text-accent-focus visited:text-accent"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
}
