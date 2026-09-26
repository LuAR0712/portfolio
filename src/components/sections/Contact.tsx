import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Icon } from "@/components/ui/Icon";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { ContactForm } from "@/features/contact/ContactForm";
import { CopyEmailButton } from "@/features/contact/CopyEmailButton";

// The form is the main path; direct channels stay underneath as compact actions that never wrap
// mid-address: email (with copy, for people without a mail client) and LinkedIn by name, not URL.
export function Contact() {
  const t = useTranslations();

  return (
    <Section id="contact" title={t("sections.contact.title")}>
      <Reveal as="p" className="max-w-prose text-lg text-muted">
        {t("contact.lead")}
      </Reveal>

      <Reveal className="mt-10">
        <ContactForm />
      </Reveal>

      <Reveal className="mt-16 space-y-5 border-t border-border pt-8">
        <p className="text-muted">{t("contact.directLabel")}</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href={`mailto:${profile.email}`} variant="secondary">
              <Icon name="mail" className="size-4" />
              {profile.email}
            </ButtonLink>
            <CopyEmailButton email={profile.email} />
          </div>
          <ButtonLink
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            <Icon name="user" className="size-4" />
            {t("contact.linkedinLabel")}
            <span className="sr-only"> {t("contact.newTab")}</span>
            <Icon
              name="arrowUpRight"
              className="size-4 transition-transform duration-(--duration-base) ease-(--ease-out-expo) motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            />
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
