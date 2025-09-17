import { cn } from "../utilities/style-utilities";

interface ActionLinkProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function ActionLink({ onClick, children, className }: ActionLinkProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "text-sky visited:text-sky cursor-pointer transition-all hover:text-royal",
        className,
      )}
    >
      {children}
    </div>
  );
}
