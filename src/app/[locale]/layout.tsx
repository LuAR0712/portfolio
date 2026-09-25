import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { BackgroundMesh } from "@/components/layout/BackgroundMesh";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { pickClientMessages } from "@/i18n/client-messages";
import { routing } from "@/i18n/routing";
import { MAIN_CONTENT_ID } from "@/lib/constants";
import { publicEnv } from "@/lib/env";
import { fontDisplay, fontSans } from "@/lib/fonts";
import "@/styles/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "metadata" });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `/${l}`]));

  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, "x-default": `/${routing.defaultLocale}` },
    },
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
              <ScrollProgress />
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
