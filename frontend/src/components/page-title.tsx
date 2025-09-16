import { cn } from "../utilities/style-utilities";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <div
      className={cn(
        "text-center font-sanchez text-3xl text-black/75",
        className,
      )}
    >
      {children}
    </div>
  );
}
