import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
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

  return (
    <html
      lang={locale}
      className={`${fontDisplay.variable} ${fontSans.variable}`}
      // next-themes sets data-theme on <html> before hydration.
      suppressHydrationWarning
    >
      <body id="top" className="bg-grain bg-mesh">
        <NextIntlClientProvider>
          <ThemeProvider>
            <SkipLink />
            <Header />
            <main id={MAIN_CONTENT_ID}>{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
