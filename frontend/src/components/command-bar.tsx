import { useEffect, useState } from "react";

import { XIcon } from "@phosphor-icons/react";
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
      name: "Books",
      route: "/books",
    },
    {
      name: "Contact",
      route: "/contact",
    },
    {
      name: "Music",
      route: "/music",
    },
    {
      name: "Projects",
      route: "/projects",
    },
    {
      name: "Running",
      route: "/running",
    },
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command Bar"
      className="font-raleway absolute top-0 z-[15] flex w-full justify-center px-10 py-10 md:py-24"
    >
      <div
        className={cn(
          "bg-parchment flex w-[400px] flex-col justify-center overflow-hidden",
          "rounded-lg px-3 py-1 text-center shadow-[0_0_200px_30px_rgba(0,0,0,0.2)]",
        )}
      >
        <div className="flex flex-row items-center justify-between">
          <Command.Input
            placeholder="Search for a page..."
            className="w-full bg-transparent px-3 py-3 text-black/75 outline-none"
          />

          <div
            className="flex size-8 cursor-pointer flex-row items-center justify-center rounded-full transition-all hover:bg-black/5"
            onClick={toggleOpen}
          >
            <XIcon color="#444" />
          </div>
        </div>

        <div className="h-full w-full border-t border-black/8 px-1 py-3">
          <Command.List>
            <Command.Empty>
              <div className="text-black/75">No results found</div>
            </Command.Empty>

            {pages.map((page, i) => (
              <Command.Item
                key={i}
                value={page.name}
                onSelect={() => {
                  setOpen(false);
                  navigate(page.route);
                }}
                className="font-sanchez aria-selected:text-sky cursor-pointer rounded py-1 transition-all aria-selected:bg-black/5"
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
