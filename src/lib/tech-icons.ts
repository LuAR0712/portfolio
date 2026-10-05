import {
  siClaude,
  siCss,
  siDart,
  siDotnet,
  siFigma,
  siFlutter,
  siGit,
  siGithubcopilot,
  siHtml5,
  siJavascript,
  siJest,
  siMui,
  siNextdotjs,
  siReact,
  siStyledcomponents,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

/*
 * Technology logos from Simple Icons (CC0). Named imports keep the bundle to the icons we use,
 * and they are served once as a static SVG sprite (no client JS, no inline path data).
 * Azure and C# have no entry: Microsoft asked Simple Icons to remove its logos, so those skills
 * render as text only.
 */
const icons = {
  javascript: siJavascript,
  typescript: siTypescript,
  html: siHtml5,
  css: siCss,
  react: siReact,
  flutter: siFlutter,
  dart: siDart,
  nextjs: siNextdotjs,
  mui: siMui,
  styledComponents: siStyledcomponents,
  jest: siJest,
  figma: siFigma,
  dotnet: siDotnet,
  git: siGit,
  githubCopilot: siGithubcopilot,
  claude: siClaude,
} as const satisfies Record<string, SimpleIcon>;

export type TechIconId = keyof typeof icons;

export const TECH_ICON_IDS = Object.keys(icons) as TechIconId[];

// Where the sprite is served (app/tech-icons.svg/route.ts).
export const TECH_ICON_SPRITE = "/tech-icons.svg";

export function getTechIcon(id: TechIconId): SimpleIcon {
  return icons[id];
}

// Relative luminance of an sRGB hex color (WCAG definition).
function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/*
 * Brand color for hover, as a CSS color. Near-black or near-white brands (Next.js, Copilot) would
 * vanish on one of the two themes, so they keep the text color instead.
 */
export function brandHoverColor(id: TechIconId): string | undefined {
  const { hex } = icons[id];
  const lum = luminance(hex);
  return lum < 0.03 || lum > 0.85 ? undefined : `#${hex}`;
}
