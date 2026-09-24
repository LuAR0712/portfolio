import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";

const linkClass =
  "inline-flex items-center gap-2 font-display text-h3 font-semibold break-all underline decoration-border decoration-2 underline-offset-8 transition-[text-decoration-color] duration-(--duration-fast) hover:decoration-primary";

// Direct channels. The contact form is added to this section in the contact feature.
export function Contact() {
  const t = useTranslations();
  const linkedinDisplay = profile.linkedin.replace(/^https:\/\/(www\.)?/, "");

  return (
    <Section id="contact" title={t("sections.contact.title")}>
      <p className="max-w-prose text-lg text-muted">{t("contact.lead")}</p>

      <dl className="mt-10 space-y-8">
        <div className="space-y-2">
          <dt className="font-mono text-xs tracking-wide text-muted uppercase">
            {t("contact.emailLabel")}
          </dt>
          <dd>
            <a href={`mailto:${profile.email}`} className={linkClass}>
              {profile.email}
            </a>
          </dd>
        </div>
        <div className="space-y-2">
          <dt className="font-mono text-xs tracking-wide text-muted uppercase">
            {t("contact.linkedinLabel")}
          </dt>
          <dd>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              {linkedinDisplay}
              <span className="sr-only"> {t("contact.newTab")}</span>
              <Icon name="arrowUpRight" className="size-5 shrink-0" />
            </a>
          </dd>
        </div>
      </dl>
    </Section>
  );
}
