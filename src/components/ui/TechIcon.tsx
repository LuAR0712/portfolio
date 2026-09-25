import type { CSSProperties } from "react";
import { brandHoverColor, TECH_ICON_SPRITE, type TechIconId } from "@/lib/tech-icons";
import { cn } from "@/lib/utils";

type TechIconProps = { id: TechIconId; className?: string };

/*
 * Monochrome logo (currentColor) that takes its brand color when an ancestor `.group` is hovered.
 * Decorative: the technology name is always rendered next to it as text.
 * The brand color comes from Simple Icons data, not from the palette (see CLAUDE.md).
 */
export function TechIcon({ id, className }: TechIconProps) {
  const hover = brandHoverColor(id);

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      style={hover ? ({ "--brand": hover } as CSSProperties) : undefined}
      className={cn(
        "size-5 shrink-0 transition-colors duration-(--duration-base)",
        hover && "group-hover:text-(--brand)",
        className,
      )}
    >
      <use href={`${TECH_ICON_SPRITE}#${id}`} />
    </svg>
  );
}
