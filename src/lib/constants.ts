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
