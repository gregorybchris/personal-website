interface SimpleLink {
  text: string;
  link: string;
}

export function SimpleLink({ text, link }: SimpleLink) {
  return (
    <a
      className="cursor-pointer font-raleway text-accent transition-all visited:text-accent hover:text-accent-focus active:text-accent-focus"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
}
