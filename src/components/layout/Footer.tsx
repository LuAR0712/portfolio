import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/content/profile";

const linkClass =
  "inline-flex items-center gap-1.5 text-muted transition-colors duration-(--duration-fast) hover:text-fg";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-display text-h3 font-bold">{profile.name}</p>
          <p className="max-w-prose text-sm text-muted">{t("builtWith")}</p>
          <p className="text-sm text-muted">{t("copyright", { year, name: profile.name })}</p>
        </div>

        <nav aria-label={t("contactLabel")}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <li>
              <a href={`mailto:${profile.email}`} className={linkClass}>
                {t("email")}
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t("linkedin")}
                <span className="sr-only"> {t("newTab")}</span>
                <Icon name="arrowUpRight" className="size-4" />
              </a>
            </li>
            <li>
              <a href="#top" className={linkClass}>
                {t("backToTop")}
                <Icon name="arrowUp" className="size-4" />
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
