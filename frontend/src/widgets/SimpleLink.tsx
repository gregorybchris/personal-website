import { cn } from "../utilities/styleUtilities";

interface SimpleLink {
  link: string;
  sameWindow?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function SimpleLink({
  link,
  sameWindow,
  children,
  className,
}: SimpleLink) {
  const target = sameWindow ?? false ? "_self" : "_blank";
  return (
    <a
      className={cn(
        "cursor-pointer font-raleway text-accent transition-all visited:text-accent hover:text-accent-focus active:text-accent-focus",
        className,
      )}
      href={link}
      target={target}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
