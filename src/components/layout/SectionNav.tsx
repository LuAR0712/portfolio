"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import { SECTION_IDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { NavItem } from "./MobileNav";

type SectionNavProps = { items: NavItem[]; label: string };

// Desktop in-page navigation. The link of the section being read is highlighted and marked with
// aria-current="location", so position is visible and announced.
export function SectionNav({ items, label }: SectionNavProps) {
  const active = useActiveSection(SECTION_IDS);

  return (
    <nav aria-label={label} className="hidden lg:block">
      <ul className="flex items-center gap-7">
        {items.map(({ id, label: itemLabel }) => {
          const current = id === active;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "relative text-sm transition-colors duration-(--duration-fast) after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-fg after:transition-transform after:duration-(--duration-base) after:ease-(--ease-out-expo) hover:text-fg hover:after:scale-x-100 focus-visible:after:scale-x-100",
                  current ? "text-fg after:scale-x-100" : "text-muted after:scale-x-0",
                )}
              >
                {itemLabel}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
