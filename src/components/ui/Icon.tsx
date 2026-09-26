import type { SVGProps } from "react";

const paths = {
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  arrowUp: "M12 19V5M5 12l7-7 7 7",
  arrowUpRight: "M7 17 17 7M8 7h9v9",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  mail: "M4 6h16v12H4zM4 7l8 6 8-6",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  check: "m5 12 5 5L20 7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0",
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & { name: IconName };

// Decorative by default: the accessible name belongs to the control that contains the icon.
export function Icon({ name, className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className ?? "size-5"}
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
