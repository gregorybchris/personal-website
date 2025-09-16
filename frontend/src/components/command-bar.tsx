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
      name: "Blog",
      route: "/blog",
    },
    {
      name: "Projects",
      route: "/projects",
    },
    {
      name: "Running",
      route: "/running",
    },
    {
      name: "Books",
      route: "/books",
    },
    {
      name: "Music",
      route: "/music",
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
      className="absolute top-0 z-[15] flex w-full justify-center px-10 py-10 font-raleway md:py-24"
    >
      <div
        className={cn(
          "flex w-[400px] flex-col justify-center overflow-hidden bg-background",
          "rounded-lg px-3 py-3 text-center shadow-[0_0_200px_30px_rgba(0,0,0,0.2)]",
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <Command.Input
            placeholder="Search for a page..."
            className="w-full bg-transparent px-3 py-3 text-black/75 outline-none"
          />

          <div
            className="cursor-pointer rounded-full p-1 transition-all hover:bg-black/[8%]"
            onClick={toggleOpen}
          >
            <XCircle size={26} color="#6283c0" weight="regular" />
          </div>
        </div>

        <div className="h-full w-full border-t-2 border-blue-500/60 px-1 py-3">
          <Command.List>
            <Command.Empty>
              <div className="text-text-2">No results found</div>
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
                  "cursor-pointer rounded py-1",
                  "transition-all aria-selected:bg-black/[8%] aria-selected:text-blue-500",
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
