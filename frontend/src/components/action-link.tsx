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
        "text-sky visited:text-sky hover:text-royal cursor-pointer transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}
