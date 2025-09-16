import { useEffect, useState } from "react";

import { XCircle } from "@phosphor-icons/react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { cn } from "../utilities/style-utilities";

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function toggleOpen() {
    setOpen((isOpen) => !isOpen);
    const activeEl = document.activeElement;
    if (activeEl instanceof HTMLElement) {
      activeEl.blur();
    }
  }

  useEffect(() => {
    function keydown(e: KeyboardEvent) {
      if (e.key === "k" && e.metaKey) {
        toggleOpen();
      }
    }

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, []);

  const pages = [
    {
      name: "Home",
      route: "/",
    },
    {
      name: "Code",
      route: "/Code",
    },
    {
      name: "Running",
      route: "/running",
    },
    {
      name: "Music",
      route: "/music",
    },
    {
      name: "Books",
      route: "/books",
    },
    {
      name: "Contact",
      route: "/contact",
    },
  ];

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Bar"
      className="absolute top-0 z-[15] flex h-full w-full justify-center px-10 py-10 md:py-24"
    >
      <div
        className={cn(
          "flex max-h-[400px] w-[400px] flex-col justify-center overflow-hidden",
          "rounded-lg px-3 pb-3 text-center shadow-[0_0_200px_30px_rgba(0,0,0,0.2)]",
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <Command.Input
            placeholder="Search for a page..."
            className="mb-2 bg-transparent px-4 py-5 font-bold text-black/75 outline-none"
          />

          <div
            className="mr-2 cursor-pointer rounded-full p-1 transition-all hover:bg-background-dark"
            onClick={toggleOpen}
          >
            <XCircle size={26} color="#6283c0" weight="regular" />
          </div>
        </div>

        <div className="h-full w-full border-l-2 border-r-2 border-accent p-5">
          <Command.List>
            <Command.Empty>
              <div className="font-bold text-text-2">No results found</div>
            </Command.Empty>

            {pages.map((page, i) => (
              <Command.Item
                key={i}
                value={page.name}
                onSelect={() => {
                  setOpen(false);
                  navigate(page.route);
                }}
                className={cn(
                  "cursor-pointer rounded-md py-1 font-bold",
                  "transition-all aria-selected:bg-background-dark aria-selected:text-accent",
                )}
              >
                {page.name}
              </Command.Item>
            ))}
          </Command.List>
        </div>
      </div>
    </Command.Dialog>
  );
}
