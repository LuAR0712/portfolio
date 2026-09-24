"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { SectionId } from "@/lib/constants";

export type NavItem = { id: SectionId; label: string };

type MobileNavProps = {
  items: NavItem[];
  navLabel: string;
  openLabel: string;
  closeLabel: string;
};

// Disclosure pattern: the button toggles a panel below the header. Escape closes it and
// returns focus to the button; following a link closes it too.
export function MobileNav({ items, navLabel, openLabel, closeLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    // Close when the viewport reaches the breakpoint where the inline nav takes over.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-md text-fg transition-colors duration-(--duration-fast) hover:bg-fg/5"
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      <nav
        id={panelId}
        aria-label={navLabel}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-bg shadow-soft"
      >
        <ul className="mx-auto flex max-w-content flex-col px-gutter py-4">
          {items.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="block py-3 font-display text-h3 font-semibold"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
