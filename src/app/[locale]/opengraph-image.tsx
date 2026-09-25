import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { profile } from "@/content/profile";
import { routing, type Locale } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";

// Rendered at build time per locale. CSS variables don't exist here, so colors are the hex
// equivalents of the dark theme tokens (ink-950, brand-900, brand-50, ink-400, accent-400).
const COLORS = {
  bg: "#090c14",
  glow: "#1a2a78",
  fg: "#f0f5ff",
  muted: "#a3aabb",
  accent: "#00d1ee",
} as const;

const size = { width: 1200, height: 630 };

function localeFrom(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}

export async function generateImageMetadata({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: localeFrom(params.locale), namespace: "metadata" });
  return [{ id: "default", alt: t("title"), size, contentType: "image/png" }];
}

// Bricolage Grotesque subset to the characters drawn. Falls back to the default font offline.
async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(cssUrl)).text();
    const fontUrl = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)?.[1];
    return fontUrl ? await (await fetch(fontUrl)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = localeFrom((await params).locale);
  const t = await getTranslations({ locale });
  const headline = t("hero.headline");
  const host = new URL(publicEnv.NEXT_PUBLIC_SITE_URL).host;

  const font = await loadDisplayFont(`${profile.name}${headline}${host}`);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(900px 600px at 90% -10%, ${COLORS.glow}, transparent 70%)`,
        color: COLORS.fg,
        fontFamily: font ? "Bricolage" : "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.accent }} />
        <div style={{ fontSize: 28, color: COLORS.muted }}>{host}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {profile.name}
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.muted, lineHeight: 1.2 }}>
          {headline}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: font ? [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] : [],
    },
  );
}
