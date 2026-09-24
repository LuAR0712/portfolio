import { useTranslations } from "next-intl";
import { DateRangeText } from "@/components/ui/DateRangeText";
import { Section } from "@/components/ui/Section";
import { earlierExperience, experience } from "@/content/experience";

export function Experience() {
  const t = useTranslations();

  return (
    <Section id="experience" title={t("sections.experience.title")}>
      <ol className="relative space-y-12 border-l border-border pl-8">
        {experience.map((item) => (
          <li key={item.id} className="relative">
            {/* Timeline marker, centered on the rail. */}
            <span
              aria-hidden="true"
              className="absolute top-2 -left-[calc(2rem+5px)] size-2.5 rounded-full bg-primary ring-4 ring-bg"
            />
            <p className="font-mono text-sm text-muted">
              <DateRangeText start={item.start} end={item.end} />
            </p>
            <h3 className="mt-2 text-h3">{t(`content.experience.${item.id}.role`)}</h3>
            <p className="mt-1 text-fg/85">
              {item.company} · {item.location}
            </p>
            <p className="mt-4 max-w-prose text-muted">
              {t(`content.experience.${item.id}.summary`)}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-1 pl-8 text-sm text-muted sm:flex-row sm:gap-3">
        <span className="font-mono tracking-wide uppercase">{t("experience.earlierLabel")}</span>
        <ul>
          {earlierExperience.map((item) => (
            <li key={item.id}>
              {t(`content.earlierExperience.${item.id}.role`)} · {item.company} ·{" "}
              <DateRangeText start={item.start} end={item.end} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
