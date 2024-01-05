interface SimpleLink {
  text: string;
  link: string;
  sameWindow?: boolean;
}

export function SimpleLink({ text, link, sameWindow }: SimpleLink) {
  const target =
    sameWindow === undefined ? "_blank" : sameWindow ? "_self" : "_blank";
  return (
    <a
      className="cursor-pointer font-raleway text-accent transition-all visited:text-accent hover:text-accent-focus active:text-accent-focus"
      href={link}
      target={target}
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
}
