import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const itemClass = "inline-flex h-10 min-w-10 items-center justify-center rounded-md px-2";

// Plain links (no client JS): crawlable, work before hydration, and carry hreflang.
export function LanguageSwitcher() {
  const t = useTranslations("language");
  const current = useLocale();

  return (
    <ul aria-label={t("label")} className="flex items-center text-sm font-medium">
      {routing.locales.map((locale) => {
        const code = locale.toUpperCase();

        return (
          <li key={locale}>
            {locale === current ? (
              <span className={cn(itemClass, "text-fg")}>
                <span aria-hidden="true">{code}</span>
                <span className="sr-only">{t(`names.${locale}`)}</span>
              </span>
            ) : (
              <Link
                href="/"
                locale={locale}
                hrefLang={locale}
                scroll={false}
                aria-label={t("switchTo", { language: t(`names.${locale}`) })}
                className={cn(
                  itemClass,
                  "text-muted transition-colors duration-(--duration-fast) hover:bg-fg/5 hover:text-fg",
                )}
              >
                {code}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
