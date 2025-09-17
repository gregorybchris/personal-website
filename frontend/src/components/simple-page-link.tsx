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
        "text-sky visited:text-sky cursor-pointer transition-all hover:text-royal",
        className,
      )}
    >
      {children}
    </Link>
  );
}
