import { useTranslations } from "next-intl";
import { MAIN_CONTENT_ID } from "@/lib/constants";

export function SkipLink() {
  const t = useTranslations();

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only rounded-md bg-surface px-4 py-3 font-medium text-fg shadow-lift focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      {t("skipLink")}
    </a>
  );
}
