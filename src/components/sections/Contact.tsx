import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { ContactForm } from "@/features/contact/ContactForm";

const linkClass =
  "group inline-flex items-center gap-2 font-display text-lg font-semibold break-all underline decoration-border decoration-2 underline-offset-6 transition-[text-decoration-color] duration-(--duration-fast) hover:decoration-primary";

const labelClass = "font-mono text-xs tracking-wide text-muted uppercase";

// The form is the main path; direct channels stay underneath for people who prefer them.
export function Contact() {
  const t = useTranslations();
  const linkedinDisplay = profile.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "");

  return (
    <Section id="contact" title={t("sections.contact.title")}>
      <Reveal as="p" className="max-w-prose text-lg text-muted">
        {t("contact.lead")}
      </Reveal>

      <Reveal className="mt-10">
        <ContactForm />
      </Reveal>

      <Reveal className="mt-16 space-y-6 border-t border-border pt-8">
        <p className="text-muted">{t("contact.directLabel")}</p>
        <dl className="flex flex-col gap-6 sm:flex-row sm:gap-12">
          <div className="space-y-2">
            <dt className={labelClass}>{t("contact.emailLabel")}</dt>
            <dd>
              <a href={`mailto:${profile.email}`} className={linkClass}>
                {profile.email}
              </a>
            </dd>
          </div>
          <div className="space-y-2">
            <dt className={labelClass}>{t("contact.linkedinLabel")}</dt>
            <dd>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {linkedinDisplay}
                <span className="sr-only"> {t("contact.newTab")}</span>
                <Icon
                  name="arrowUpRight"
                  className="size-4 shrink-0 transition-transform duration-(--duration-base) ease-(--ease-out-expo) motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                />
              </a>
            </dd>
          </div>
        </dl>
      </Reveal>
    </Section>
  );
}
