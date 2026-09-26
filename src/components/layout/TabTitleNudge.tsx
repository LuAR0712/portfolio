"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

/*
 * While the tab is in the background, its title becomes a short nudge; the real title comes back
 * the moment the visitor returns. Kept short so it fits a regular-width tab. Renders nothing.
 */
export function TabTitleNudge() {
  const away = useTranslations("tabNudge")("away");

  useEffect(() => {
    let original: string | null = null;

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        original = document.title;
        document.title = away;
      } else if (original !== null) {
        document.title = original;
        original = null;
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (original !== null) document.title = original;
    };
  }, [away]);

  return null;
}
