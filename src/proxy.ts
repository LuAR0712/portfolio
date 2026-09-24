import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Detects the locale from the NEXT_LOCALE cookie, then Accept-Language, falling back to `es`.
export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, Vercel internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\..*).*)",
};
