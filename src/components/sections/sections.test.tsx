import { screen, within } from "@testing-library/react";
import type { Locale } from "@/i18n/routing";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import { About } from "./About";
import { Contact } from "./Contact";
import { Education } from "./Education";
import { Experience } from "./Experience";
import { Hero } from "./Hero";
import { Projects } from "./Projects";
import { Skills } from "./Skills";

function renderPage(locale: Locale = "es") {
  return renderWithIntl(
    <main>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Contact />
    </main>,
    { locale },
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(Date.UTC(2026, 8, 24)));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("home sections", () => {
  it("renders one h1 and the section titles in document order", () => {
    renderPage();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Luciano Rossi");
    expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
      "Sobre mí",
      "Experiencia",
      "Proyectos destacados",
      "Tecnologías",
      "Formación",
      "Contacto",
    ]);
  });

  it("derives years of experience from the career start date", () => {
    renderPage();
    expect(screen.getByText("4+ años")).toBeInTheDocument();
  });

  it("formats dates per locale and marks the current role", () => {
    renderPage("en");
    const experience = screen.getByRole("region", { name: "Experience" });

    expect(within(experience).getByText("Jun 2022")).toHaveAttribute("dateTime", "2022-06");
    expect(within(experience).getByText(/present/)).toBeInTheDocument();
  });

  it("lists each project as an article with its stack", () => {
    renderPage();
    const articles = screen.getAllByRole("article");

    expect(articles).toHaveLength(3);
    expect(within(articles[1]!).getByRole("heading")).toHaveTextContent("IAP");
    expect(within(articles[1]!).getByText("Figma")).toBeInTheDocument();
  });

  it("points the CV download at the PDF for the active locale", () => {
    renderPage("en");
    expect(screen.getByRole("link", { name: /Download CV/ })).toHaveAttribute(
      "href",
      "/cv/luciano-rossi-cv-en.pdf",
    );
  });

  it("never renders a phone number", () => {
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(/\+?\d[\d\s().-]{7,}\d/);
  });

  it.each(["es", "en"] as const)("has no axe violations (%s)", async (locale) => {
    vi.useRealTimers();
    const { container } = renderPage(locale);
    await expectNoAxeViolations(container);
  });
});
