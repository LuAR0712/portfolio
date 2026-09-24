import type { ReactNode } from "react";
import { fontDisplay, fontSans } from "@/lib/fonts";
import "@/styles/globals.css";

// Temporary root layout. Phase 2 moves it to `app/[locale]/layout.tsx` with next-intl and next-themes.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
