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
        "cursor-pointer font-raleway text-accent transition-all visited:text-accent hover:text-accent-focus active:text-accent-focus",
        className,
      )}
    >
      {children}
    </div>
  );
}
