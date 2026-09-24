import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "@/test/axe";
import { MobileNav, type NavItem } from "./MobileNav";

const items: NavItem[] = [
  { id: "about", label: "Sobre mí" },
  { id: "contact", label: "Contacto" },
];

function renderNav() {
  return render(
    <MobileNav
      items={items}
      navLabel="Principal"
      openLabel="Abrir menú"
      closeLabel="Cerrar menú"
    />,
  );
}

describe("MobileNav", () => {
  it("starts collapsed with the panel hidden", () => {
    renderNav();

    expect(screen.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("opens the panel and exposes the section links", async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));

    expect(screen.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    const nav = screen.getByRole("navigation", { name: "Principal" });
    expect(nav).toBeVisible();
    expect(screen.getByRole("link", { name: "Contacto" })).toHaveAttribute("href", "#contact");
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    await user.tab();
    expect(screen.getByRole("link", { name: "Sobre mí" })).toHaveFocus();

    await user.keyboard("{Escape}");

    const toggle = screen.getByRole("button", { name: "Abrir menú" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

  it("closes after following a link", async () => {
    const user = userEvent.setup();
    renderNav();

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    await user.click(screen.getByRole("link", { name: "Sobre mí" }));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("has no axe violations when open", async () => {
    const user = userEvent.setup();
    const { container } = renderNav();

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));

    await expectNoAxeViolations(container);
  });
});
