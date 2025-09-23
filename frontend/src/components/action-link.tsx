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
        "cursor-pointer text-sky transition-all visited:text-sky hover:text-royal",
        className,
      )}
    >
      {children}
    </div>
  );
}
