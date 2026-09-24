import type { Locale } from "@/i18n/routing";

// Non-translatable profile data. Translatable copy lives in messages/*.json.
// The phone number is intentionally absent: it only appears in the PDF CV.

export type Profile = {
  name: string;
  email: string;
  linkedin: string;
  cv: Record<Locale, string>;
};

export const profile: Profile = {
  name: "Luciano Rossi",
  email: "lrossi0798@gmail.com",
  linkedin: "https://www.linkedin.com/in/luciano-rossi-98a38817b",
  // TODO: add public/cv/luciano-rossi-cv-es.pdf and public/cv/luciano-rossi-cv-en.pdf
  cv: {
    es: "/cv/luciano-rossi-cv-es.pdf",
    en: "/cv/luciano-rossi-cv-en.pdf",
  },
};
