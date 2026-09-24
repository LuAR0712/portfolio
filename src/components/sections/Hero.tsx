import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";

export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section aria-labelledby="hero-title">
      <Container className="flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center gap-8 py-section">
        <div className="space-y-5">
          <h1 id="hero-title" className="text-display">
            {profile.name}
          </h1>
          <p className="font-display text-h3 font-semibold text-balance text-fg/85">
            {t("headline")}
          </p>
        </div>

        <p className="max-w-prose text-lg text-muted">{t("positioning")}</p>

        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="#projects">{t("ctaProjects")}</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">
            {t("ctaContact")}
          </ButtonLink>
          <ButtonLink href={profile.cv[locale]} download variant="ghost">
            <Icon name="download" className="size-4" />
            {t("ctaCv")}
            <span className="text-muted">{t("cvFormat")}</span>
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
