import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { clients } from "@/content/clients";
import { profile } from "@/content/profile";
import { heroStep } from "@/lib/motion";

// Staggered entrance in CSS (runs before hydration); reduced motion collapses it in globals.css.
// The name and the portrait are LCP candidates, so they move in without fading (animate-rise-solid).
export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section aria-labelledby="hero-title">
      <Container className="grid min-h-[calc(100svh-var(--header-height))] content-center gap-x-12 gap-y-8 py-section lg:grid-cols-12">
        {/* Portrait: a small round avatar above the name on mobile, a 4:5 framed photo on desktop. */}
        <div
          className="relative w-28 animate-rise-solid sm:w-36 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:w-full lg:max-w-sm lg:self-center lg:justify-self-end"
          style={heroStep(1)}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden translate-x-4 translate-y-4 rounded-lg bg-primary/15 lg:block"
          />
          {/* The frame crops by scaling from the face: head-and-shoulders on desktop, a face-only
              avatar on mobile, and the background clutter at the photo's edge stays out. */}
          <div className="relative aspect-square overflow-hidden rounded-full shadow-lift ring-1 ring-border lg:aspect-[4/5] lg:rounded-lg">
            <Image
              src={profile.portrait}
              alt={t("photoAlt")}
              placeholder="blur"
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 24rem, (min-width: 640px) 9rem, 7rem"
              className="size-full origin-[45%_15%] scale-[1.9] object-cover lg:origin-[30%_28%] lg:scale-[1.35]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7 lg:row-start-1">
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
        </div>

        {/* Client names as typography: an at-a-glance signal of the sectors, without brand marks. */}
        <div
          className="mt-6 flex animate-rise flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-baseline sm:gap-8 lg:col-span-12"
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
