import { useTranslations } from "next-intl";
import { Stagger } from "@/components/motion/Stagger";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { Section } from "@/components/ui/Section";
import { TechIcon } from "@/components/ui/TechIcon";
import { skillCategories } from "@/content/skills";

// Typographic list grouped by category: no levels or charts. Logos are monochrome and sit beside
// the name; they take their brand color on hover.
export function Skills() {
  const t = useTranslations();

  return (
    <Section id="skills" title={t("sections.skills.title")}>
      <Stagger as="dl" className="divide-y divide-border border-y border-border">
        {skillCategories.map((category) => (
          <StaggerItem
            key={category.id}
            className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6"
          >
            <dt className="pt-1 font-mono text-xs tracking-wide text-muted uppercase">
              {t(`content.skills.categories.${category.id}`)}
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="group inline-flex items-center gap-2 font-display text-lg font-semibold"
                  >
                    {skill.icon && <TechIcon id={skill.icon} className="text-muted" />}
                    {skill.name}
                    {skill.note && (
                      <span className="ml-1.5 font-sans text-sm font-normal text-muted">
                        ({t(`content.skills.notes.${skill.note}`)})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </dd>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
