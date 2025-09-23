import { cn } from "../utilities/style-utilities";

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
  const target = (sameWindow ?? false) ? "_self" : "_blank";
  return (
    <a
      className={cn(
        "text-sky visited:text-sky hover:text-royal cursor-pointer transition-all",
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
