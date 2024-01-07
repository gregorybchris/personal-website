import { useEffect, useState } from "react";

import { Command } from "cmdk";
import { XCircle } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

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
      name: "Links",
      route: "/links",
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
      className="bg-dark-mask absolute top-0 z-[15] flex h-full w-full justify-center px-10 py-10 md:py-24"
    >
      <div className="flex max-h-[400px] w-[400px] flex-col justify-center overflow-hidden rounded-lg bg-background px-3 pb-3 text-center shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]">
        <div className="flex flex-row items-center justify-between">
          <Command.Input
            placeholder="Search for a page..."
            className="mb-2 bg-transparent px-4 py-5 font-raleway font-bold outline-none"
          />
          <div
            className="mr-2 cursor-pointer rounded-full p-1 hover:bg-background-dark"
            onClick={toggleOpen}
          >
            <XCircle size={26} color="#6283c0" weight="regular" />
          </div>
        </div>

        <div className="h-full w-full border-l-2 border-r-2 border-accent p-5">
          <Command.List>
            <Command.Empty>
              <div className="font-raleway">No results found</div>
            </Command.Empty>

            {pages.map((page, i) => (
              <Command.Item
                key={i}
                value={page.name}
                onSelect={() => {
                  setOpen(false);
                  navigate(page.route);
                }}
                className="cursor-pointer py-1 font-raleway font-bold aria-selected:bg-background-dark aria-selected:text-accent"
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
