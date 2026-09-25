import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { routing } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/structured-data";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const person = buildPersonJsonLd({
    locale,
    siteUrl: publicEnv.NEXT_PUBLIC_SITE_URL,
    jobTitle: t("content.experience.cda.role"),
    description: t("metadata.description"),
  });

  return (
    <>
      <script
        type="application/ld+json"
        // Serialized from typed content and escaped by serializeJsonLd.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(person) }}
      />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </>
  );
}
