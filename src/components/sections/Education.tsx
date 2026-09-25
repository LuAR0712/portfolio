import { useTranslations } from "next-intl";
import { Stagger } from "@/components/motion/Stagger";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { Section } from "@/components/ui/Section";
import { education } from "@/content/education";

export function Education() {
  const t = useTranslations();

  return (
    <Section id="education" title={t("sections.education.title")}>
      <Stagger as="ul" className="divide-y divide-border border-y border-border">
        {education.map((item) => (
          <StaggerItem
            key={item.id}
            as="li"
            className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
          >
            <div>
              <h3 className="text-lg font-semibold">{t(`content.education.${item.id}.title`)}</h3>
              <p className="text-muted">{item.institution}</p>
            </div>
            {item.year && <p className="font-mono text-sm text-muted sm:text-right">{item.year}</p>}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
