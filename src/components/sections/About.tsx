import { useTranslations } from "next-intl";
import { Stagger } from "@/components/motion/Stagger";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { Section } from "@/components/ui/Section";
import { careerStart } from "@/content/experience";
import { fullYearsSince } from "@/lib/dates";

export function About() {
  const t = useTranslations();
  const paragraphs = t.raw("about.paragraphs") as string[];

  const facts = [
    [
      t("about.facts.experienceLabel"),
      t("about.facts.experienceValue", { years: fullYearsSince(careerStart) }),
    ],
    [t("about.facts.sectorsLabel"), t("about.facts.sectorsValue")],
    [t("about.facts.currentLabel"), t("about.facts.currentValue")],
  ] as const;

  return (
    <Section id="about" title={t("sections.about.title")}>
      <Stagger className="space-y-6 text-lg">
        {paragraphs.map((paragraph) => (
          <StaggerItem
            key={paragraph}
            as="p"
            className="max-w-prose first:text-fg [&:not(:first-child)]:text-muted"
          >
            {paragraph}
          </StaggerItem>
        ))}
      </Stagger>

      <Stagger as="dl" className="mt-14 grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <StaggerItem key={label} className="space-y-1">
            <dt className="font-mono text-xs tracking-wide text-muted uppercase">{label}</dt>
            <dd className="font-display text-h3 font-semibold">{value}</dd>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
