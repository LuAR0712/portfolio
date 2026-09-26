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
        {/* Portrait: a round photo with a brand ring. Small above the name on mobile; beside the
            text on desktop, sized to stay secondary to the name (and sharp at 2x from the source). */}
        <div
          className="relative w-28 animate-rise-solid sm:w-36 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:w-56 lg:self-center lg:justify-self-center"
          style={heroStep(1)}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden translate-x-3 translate-y-3 rounded-full border border-primary/30 lg:block"
          />
          {/* Head-and-shoulders crop of a full-length photo: object-top plus a 2.25x scale whose
              origin centers the face (~58% across, ~28% down the source). */}
          <div className="relative aspect-square overflow-hidden rounded-full shadow-lift ring-2 ring-primary/60 ring-offset-4 ring-offset-bg">
            <Image
              src={profile.portrait}
              alt={t("photoAlt")}
              placeholder="blur"
              loading="eager"
              fetchPriority="high"
              // The image is scaled 2.25x inside the frame to crop, so request 2.25x the frame width.
              sizes="(min-width: 1024px) 32rem, (min-width: 640px) 20rem, 16rem"
              className="size-full origin-[67.5%_45.6%] scale-[2.25] object-cover object-top"
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
