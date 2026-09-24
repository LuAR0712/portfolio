import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { education } from "@/content/education";

export function Education() {
  const t = useTranslations();

  return (
    <Section id="education" title={t("sections.education.title")}>
      <ul className="divide-y divide-border border-y border-border">
        {education.map((item) => (
          <li
            key={item.id}
            className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6"
          >
            <div>
              <h3 className="text-lg font-semibold">{t(`content.education.${item.id}.title`)}</h3>
              <p className="text-muted">{item.institution}</p>
            </div>
            {(item.inProgress || item.year) && (
              <p className="font-mono text-sm text-muted sm:text-right">
                {item.inProgress ? t("education.inProgress") : item.year}
              </p>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
