"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { useIsClient } from "@/hooks/useIsClient";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  // The icon is driven by CSS (`dark:`) so it's correct before hydration; the label needs JS.
  const isDark = isClient && resolvedTheme === "dark";
  const label = isDark ? t("toLight") : t("toDark");

  function switchTheme(next: Theme) {
    const apply = () => {
      // Set the attribute synchronously so the view transition captures the new state;
      // next-themes then persists the choice and keeps its own state in sync.
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      flushSync(() => setTheme(next));
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }
    // Cross-fade between the old and new theme (duration in globals.css).
    document.startViewTransition(apply);
  }

  return (
    <button
      type="button"
      onClick={() => switchTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors duration-(--duration-fast) hover:bg-fg/5 hover:text-fg"
    >
      <Icon name="moon" className="size-5 dark:hidden" />
      <Icon name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
