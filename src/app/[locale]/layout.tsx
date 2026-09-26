import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { BackgroundMesh } from "@/components/layout/BackgroundMesh";
import { CursorSpotlight } from "@/components/layout/CursorSpotlight";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SkipLink } from "@/components/layout/SkipLink";
import { TabTitleNudge } from "@/components/layout/TabTitleNudge";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { pickClientMessages } from "@/i18n/client-messages";
import { routing } from "@/i18n/routing";
import { profile } from "@/content/profile";
import { MAIN_CONTENT_ID, OG_LOCALE, THEME_COLOR } from "@/lib/constants";
import { publicEnv } from "@/lib/env";
import { fontDisplay, fontSans } from "@/lib/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Browser UI color follows the OS scheme (next-themes can override the page, not this meta).
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLOR.dark },
  ],
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "metadata" });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));

  const title = t("title");
  const description = t("description");

  // og:image comes from the colocated opengraph-image.tsx.
  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title,
    description,
    authors: [{ name: profile.name, url: profile.linkedin }],
    creator: profile.name,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: "profile",
      url: `/${locale}`,
      siteName: profile.name,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      firstName: profile.givenName,
      lastName: profile.familyName,
    },
    twitter: { card: "summary_large_image", title, description },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const clientMessages = pickClientMessages(await getMessages());

  return (
    <html
      lang={locale}
      className={`${fontDisplay.variable} ${fontSans.variable}`}
      // next-themes sets data-theme on <html> before hydration.
      suppressHydrationWarning
    >
      <body id="top" className="bg-grain">
        {/* Without JavaScript, scroll reveals never run: show their content as-is. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        <NextIntlClientProvider messages={clientMessages}>
          <ThemeProvider>
            <MotionProvider>
              <BackgroundMesh />
              <CursorSpotlight />
              <ScrollProgress />
              <TabTitleNudge />
              <SkipLink />
              <Header />
              {/* Focusable so the skip link moves focus (and screen readers) into the content. */}
              <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
