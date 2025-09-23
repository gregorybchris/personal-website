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
        "cursor-pointer text-sky transition-all visited:text-sky hover:text-royal",
        className,
      )}
    >
      {children}
    </Link>
  );
}
