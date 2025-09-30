import logo from "../assets/icons/logo-blue.svg";
import { cn } from "../utilities/style-utilities";

interface LoaderProps {
  children?: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export function Loader({
  children,
  duration = 1200,
  delay = 0,
  className,
}: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {children}
      <img
        src={logo}
        alt="Loading page logo"
        className="size-20 animate-pulse opacity-25"
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${duration}ms`,
        }}
      />
    </div>
  );
}
