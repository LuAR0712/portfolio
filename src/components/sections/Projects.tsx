import { useTranslations } from "next-intl";
import { Stagger } from "@/components/motion/Stagger";
import { StaggerItem } from "@/components/motion/StaggerItem";
import { DateRangeText } from "@/components/ui/DateRangeText";
import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";

// Editorial list rather than a card grid: each project is a row separated by a rule,
// with context on top and the technical challenge in the body. On hover a primary rule
// draws over the separator and the highlight markers stretch (transform only).
export function Projects() {
  const t = useTranslations();

  return (
    <Section id="projects" title={t("sections.projects.title")}>
      <Stagger as="ol" className="space-y-16">
        {projects.map((project) => {
          const key = `content.projects.${project.id}` as const;
          const highlights = t.raw(`${key}.highlights`) as string[];
          const titleId = `project-${project.id}`;

          return (
            <StaggerItem key={project.id} as="li">
              <article
                aria-labelledby={titleId}
                className="group relative border-t border-border pt-6 before:absolute before:inset-x-0 before:-top-px before:h-px before:origin-left before:scale-x-0 before:bg-primary before:transition-transform before:duration-500 before:ease-(--ease-out-expo) hover:before:scale-x-100"
              >
                <p className="flex flex-wrap gap-x-3 font-mono text-sm text-muted">
                  <span>{t(`${key}.context`)}</span>
                  {project.period && (
                    <>
                      <span aria-hidden="true">/</span>
                      <DateRangeText {...project.period} />
                    </>
                  )}
                </p>

                <h3 id={titleId} className="mt-3 text-h3">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-3 max-w-prose text-lg text-fg/85">{t(`${key}.summary`)}</p>

                <ul
                  aria-label={t("projects.highlightsLabel")}
                  className="mt-6 max-w-prose space-y-3 text-muted"
                >
                  {highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.7em] h-px w-3 shrink-0 origin-left bg-primary transition-transform duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-x-150"
                      />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-[auto_1fr]">
                  <dt className="font-mono tracking-wide text-muted uppercase">
                    {t("projects.roleLabel")}
                  </dt>
                  <dd>{t(`${key}.role`)}</dd>
                  <dt className="font-mono tracking-wide text-muted uppercase">
                    {t("projects.stackLabel")}
                  </dt>
                  <dd>
                    <ul className="flex flex-wrap gap-x-2">
                      {project.stack.map((tech, i) => (
                        <li key={tech}>
                          {tech}
                          {i < project.stack.length - 1 && (
                            <span aria-hidden="true" className="ml-2 text-muted">
                              /
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </dl>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
