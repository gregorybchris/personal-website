import logo from "../assets/icons/logo-blue.svg";
import { cn } from "../utilities/style-utilities";

interface LoaderProps {
  text?: string;
  showEllipses?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export function Loader({
  text,
  showEllipses = true,
  duration = 1200,
  delay = 0,
  className,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 text-black/75",
        className,
      )}
    >
      {text && (
        <div className="flex items-center">
          <span>{text}</span>
          {showEllipses && <AnimatedEllipses />}
        </div>
      )}
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

function AnimatedEllipses() {
  return (
    <span className="inline-flex w-6">
      <style>{`
        @keyframes ellipsis {
          0% { content: '...'; }
          25% { content: '..'; }
          50% { content: '.'; }
          75% { content: '..'; }
        }
        .ellipsis::after {
          content: '';
          animation: ellipsis 1200ms infinite;
        }
      `}</style>
      <span className="ellipsis" />
    </span>
  );
}
