import { forwardRef } from "react";

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  ({ target = "_blank", rel = "noopener noreferrer", ...props }, ref) => {
    return <a ref={ref} target={target} rel={rel} {...props} />;
  },
);

ExternalLink.displayName = "ExternalLink";
