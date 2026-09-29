import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";

/*
 * Floating "Download CV" button, bottom right on every screen, so the CV is one click away from
 * anywhere on the page. A plain download link rendered on the server (no client JS), pointing at
 * the PDF for the active locale. Short label on phones so it covers as little as possible; the
 * accessible name is always the full "Download CV as PDF".
 * Hover/focus: the button lifts and the arrow drops into its tray (transform only, skipped with
 * reduced motion). It enters once the hero sequence has finished.
 */
export function CvButton() {
  const t = useTranslations("cvButton");
  const locale = useLocale();

  return (
    <a
      href={profile.cv[locale]}
      download
      aria-label={t("ariaLabel")}
      className="group fixed right-4 bottom-4 z-30 inline-flex h-12 animate-rise items-center gap-2.5 rounded-full bg-primary pr-5 pl-2 font-medium text-primary-fg shadow-lift transition-[translate,background-color,box-shadow] duration-(--duration-fast) [animation-delay:700ms] hover:bg-primary/90 motion-safe:hover:-translate-y-0.5 motion-safe:focus-visible:-translate-y-0.5 sm:right-6 sm:bottom-6"
    >
      <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-primary-fg/15">
        <Icon
          name="download"
          className="size-4 motion-safe:group-hover:animate-nudge-down motion-safe:group-focus-visible:animate-nudge-down"
        />
      </span>
      <span className="hidden sm:inline">{t("label")}</span>
      <span aria-hidden="true" className="sm:hidden">
        {t("short")}
      </span>
    </a>
  );
}
