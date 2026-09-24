"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Icon } from "@/components/ui/Icon";
import { useIsClient } from "@/hooks/useIsClient";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  // The icon is driven by CSS (`dark:`) so it's correct before hydration; the label needs JS.
  const isDark = isClient && resolvedTheme === "dark";
  const label = isDark ? t("toLight") : t("toDark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors duration-(--duration-fast) hover:bg-fg/5 hover:text-fg"
    >
      <Icon name="moon" className="size-5 dark:hidden" />
      <Icon name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
