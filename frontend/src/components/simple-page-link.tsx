import { Link } from "react-router-dom";
import { cn } from "../utilities/style-utilities";

interface SimplePageLinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
}

export function SimplePageLink({
  to,
  children,
  className,
}: SimplePageLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "hover:text-royal cursor-pointer text-accent transition-all visited:text-accent",
        className,
      )}
    >
      {children}
    </Link>
  );
}
