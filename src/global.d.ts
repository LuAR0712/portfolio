import type { Locale } from "@/i18n/routing";
import type messages from "../messages/es.json";

declare module "next-intl" {
  // Module augmentation requires an interface.
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
