import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { skillCategories } from "@/content/skills";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

type PersonInput = { locale: Locale; siteUrl: string; jobTitle: string; description: string };

// schema.org Person built from the typed content, so structured data never drifts from the page.
export function buildPersonJsonLd({ locale, siteUrl, jobTitle, description }: PersonInput) {
  const current = experience.find((item) => item.end === null);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle,
    description,
    url: `${siteUrl}/${locale}`,
    email: `mailto:${profile.email}`,
    sameAs: [profile.linkedin],
    knowsLanguage: [...routing.locales],
    knowsAbout: skillCategories.flatMap((category) => category.skills.map((skill) => skill.name)),
    ...(current && {
      worksFor: { "@type": "Organization", name: current.company },
      address: { "@type": "PostalAddress", addressLocality: current.location },
    }),
    alumniOf: education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.institution,
    })),
  };
}

// JSON inside <script> must not be able to close the tag.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
