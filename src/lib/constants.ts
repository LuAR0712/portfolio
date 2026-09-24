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
