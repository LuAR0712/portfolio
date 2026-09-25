import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { clients } from "@/content/clients";
import { profile } from "@/content/profile";
import { heroStep } from "@/lib/motion";

// Staggered entrance in CSS (runs before hydration); reduced motion collapses it in globals.css.
export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section aria-labelledby="hero-title">
      <Container className="flex min-h-[calc(100svh-var(--header-height))] flex-col justify-center gap-8 py-section">
        <div className="space-y-5">
          <h1 id="hero-title" className="animate-rise-solid text-display" style={heroStep(0)}>
            {profile.name}
          </h1>
          <p
            className="animate-rise font-display text-h3 font-semibold text-balance text-fg/85"
            style={heroStep(1)}
          >
            {t("headline")}
          </p>
        </div>

        <p className="max-w-prose animate-rise text-lg text-muted" style={heroStep(2)}>
          {t("positioning")}
        </p>

        <div className="flex animate-rise flex-wrap items-center gap-3" style={heroStep(3)}>
          <ButtonLink href="#projects">{t("ctaProjects")}</ButtonLink>
          <ButtonLink href="#contact" variant="secondary">
            {t("ctaContact")}
          </ButtonLink>
          <ButtonLink href={profile.cv[locale]} download variant="ghost">
            <Icon
              name="download"
              className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out-expo) motion-safe:group-hover:translate-y-0.5"
            />
            {t("ctaCv")}
            <span className="text-muted">{t("cvFormat")}</span>
          </ButtonLink>
        </div>

        {/* Client names as typography: an at-a-glance signal of the sectors, without brand marks. */}
        <div
          className="mt-6 flex animate-rise flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-baseline sm:gap-8"
          style={heroStep(4)}
        >
          <p id="hero-clients" className="font-mono text-xs tracking-wide text-muted uppercase">
            {t("clientsLabel")}
          </p>
          <ul
            aria-labelledby="hero-clients"
            className="flex flex-wrap gap-x-8 gap-y-2 font-display text-h3 font-bold tracking-tight text-muted"
          >
            {clients.map((client) => (
              <li
                key={client}
                className="transition-colors duration-(--duration-base) hover:text-fg"
              >
                {client}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
