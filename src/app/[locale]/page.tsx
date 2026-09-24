import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { routing } from "@/i18n/routing";
import { SECTION_IDS } from "@/lib/constants";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      {/* Phase 3 replaces this block with the Hero section. */}
      <section aria-labelledby="hero-title">
        <Container className="flex min-h-[70dvh] flex-col justify-center py-section">
          <h1 id="hero-title" className="text-display">
            {profile.name}
          </h1>
          <p className="mt-6 max-w-prose text-lg text-muted">{t("hero.headline")}</p>
        </Container>
      </section>

      {SECTION_IDS.map((id, index) => (
        <Section key={id} id={id} index={index + 1} title={t(`sections.${id}.title`)} />
      ))}
    </>
  );
}
