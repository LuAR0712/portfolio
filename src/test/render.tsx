import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement, ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

const messages = { es, en } satisfies Record<Locale, unknown>;

type Options = Omit<RenderOptions, "wrapper"> & { locale?: Locale };

export function renderWithIntl(ui: ReactElement, { locale = "es", ...options }: Options = {}) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
