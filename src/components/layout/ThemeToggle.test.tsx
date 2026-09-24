import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

function renderToggle(locale: "es" | "en" = "es") {
  return renderWithIntl(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
    { locale },
  );
}

afterEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

describe("ThemeToggle", () => {
  it("starts from the system preference (light) and switches to dark", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button", { name: "Cambiar a tema oscuro" }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(screen.getByRole("button", { name: "Cambiar a tema claro" })).toBeInTheDocument();
  });

  it("persists the choice", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("button"));

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("is labelled in the active locale", () => {
    renderToggle("en");
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = renderToggle();
    await expectNoAxeViolations(container);
  });
});
