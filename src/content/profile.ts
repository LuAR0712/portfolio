import type { Locale } from "@/i18n/routing";

// Non-translatable profile data. Translatable copy lives in messages/*.json.
// The phone number is intentionally absent: it only appears in the PDF CV.

export type Profile = {
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  linkedin: string;
  cv: Record<Locale, string>;
};

export const profile: Profile = {
  name: "Luciano Rossi",
  givenName: "Luciano",
  familyName: "Rossi",
  email: "lrossi0798@gmail.com",
  linkedin: "https://www.linkedin.com/in/luciano-a-rossi-98a38817b/",
  cv: {
    es: "/cv/luciano-rossi-cv-es.pdf",
    en: "/cv/luciano-rossi-cv-en.pdf",
  },
};
