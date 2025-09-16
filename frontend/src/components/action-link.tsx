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
        "hover:text-royal cursor-pointer text-accent transition-all visited:text-accent",
        className,
      )}
    >
      {children}
    </div>
  );
}
