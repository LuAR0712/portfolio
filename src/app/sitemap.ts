import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";

// One entry per locale, each listing its translations so search engines pair them.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${base}/${locale}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
