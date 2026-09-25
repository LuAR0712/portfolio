import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { profile } from "@/content/profile";
import { Link } from "@/i18n/navigation";
import { SECTION_IDS } from "@/lib/constants";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav, type NavItem } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const t = useTranslations();
  const items: NavItem[] = SECTION_IDS.map((id) => ({ id, label: t(`nav.${id}`) }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-md">
      <Container className="flex h-(--header-height) items-center justify-between gap-6">
        <Link
          href="/"
          aria-label={t("header.homeLabel", { name: profile.name })}
          className="font-display text-lg font-bold tracking-tight"
        >
          {profile.name}
        </Link>

        <nav aria-label={t("header.navLabel")} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="relative text-sm text-muted transition-colors duration-(--duration-fast) after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-fg after:transition-transform after:duration-(--duration-base) after:ease-(--ease-out-expo) hover:text-fg hover:after:scale-x-100 focus-visible:after:scale-x-100"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

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
