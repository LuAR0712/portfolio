// In-page anchors, in document order. Ids stay in English across locales so links are shareable.
export const SECTION_IDS = [
  "about",
  "experience",
  "projects",
  "skills",
  "education",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const MAIN_CONTENT_ID = "main";

// Dates are formatted in a fixed zone so server and client output match.
export const TIME_ZONE = "America/Argentina/Buenos_Aires";

// Open Graph locale codes per route locale.
export const OG_LOCALE = { es: "es_AR", en: "en_US" } as const;

// <meta name="theme-color">. Mirrors --color-bg per theme (ink-50 / ink-950) as hex, since the
// meta tag is read by browser chrome outside our CSS.
export const THEME_COLOR = { light: "#f8fafd", dark: "#090c14" } as const;
