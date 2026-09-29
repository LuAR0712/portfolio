import { screen } from "@testing-library/react";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import { CvButton } from "./CvButton";

describe("CvButton", () => {
  it.each([
    ["es", "Descargar CV en PDF", "/cv/luciano-rossi-cv-es.pdf"],
    ["en", "Download CV as PDF", "/cv/luciano-rossi-cv-en.pdf"],
  ] as const)("downloads the %s CV", (locale, name, href) => {
    renderWithIntl(<CvButton />, { locale });

    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", href);
    expect(link).toHaveAttribute("download");
  });

  it("stays fixed in the corner of the viewport", () => {
    renderWithIntl(<CvButton />);
    expect(screen.getByRole("link")).toHaveClass("fixed", "right-4", "bottom-4");
  });

  it("has no axe violations", async () => {
    const { container } = renderWithIntl(<CvButton />);
    await expectNoAxeViolations(container);
  });
});
