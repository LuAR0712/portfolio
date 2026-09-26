import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import { SECTION_IDS } from "@/lib/constants";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav, type NavItem } from "./MobileNav";
import { SectionNav } from "./SectionNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const t = useTranslations();
  const items: NavItem[] = SECTION_IDS.map((id) => ({ id, label: t(`nav.${id}`) }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-(--header-height) items-center justify-between gap-3 sm:gap-6">
        {/* Native anchor, not the router Link: it always scrolls to the top, from anywhere on the
            page (a Link to the current URL may keep the scroll position). */}
        <a
          href="#top"
          aria-label={t("header.homeLabel", { name: profile.name })}
          className="font-display text-base font-bold tracking-tight whitespace-nowrap sm:text-lg"
        >
          {profile.name}
        </a>

        <SectionNav items={items} label={t("header.navLabel")} />

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <MobileNav
            items={items}
            navLabel={t("header.navLabel")}
            openLabel={t("header.menu.open")}
            closeLabel={t("header.menu.close")}
          />
        </div>
      </Container>
    </header>
  );
}
