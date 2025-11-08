import { CaretDownIcon } from "@phosphor-icons/react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ReactNode, useState } from "react";
import { cn } from "../utilities/style-utilities";

interface CollapsibleSectionProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function CollapsibleSection({
  summary,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
      <Collapsible.Trigger asChild>
        <button className="group flex w-full cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-left text-sm font-medium text-black/75 transition-colors hover:bg-neutral-100">
          <CaretDownIcon
            size={16}
            weight="bold"
            className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-0",
              !isOpen && "-rotate-90",
            )}
          />
          <span>{summary}</span>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="data-[state=closed]:animate-collapse data-[state=open]:animate-expand overflow-hidden">
        <div className="pt-2">{children}</div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
