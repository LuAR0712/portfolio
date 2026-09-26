import { act, render, screen } from "@testing-library/react";
import { SECTION_IDS } from "@/lib/constants";
import { SectionNav } from "./SectionNav";

// Controllable IntersectionObserver: tests decide which sections cross the reading band.
let notify: (ids: Record<string, boolean>) => void = () => {};
class TestObserver {
  constructor(callback: IntersectionObserverCallback) {
    notify = (ids) =>
      callback(
        Object.entries(ids).map(
          ([id, isIntersecting]) =>
            ({
              target: document.getElementById(id),
              isIntersecting,
            }) as unknown as IntersectionObserverEntry,
        ),
        this as unknown as IntersectionObserver,
      );
  }
  observe() {}
  disconnect() {}
}

const items = SECTION_IDS.map((id) => ({ id, label: id }));

function renderNav() {
  return render(
    <>
      <SectionNav items={items} label="Principal" />
      {SECTION_IDS.map((id) => (
        <section key={id} id={id} />
      ))}
    </>,
  );
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", TestObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SectionNav", () => {
  it("marks no link while the hero is in view", () => {
    renderNav();
    for (const link of screen.getAllByRole("link"))
      expect(link).not.toHaveAttribute("aria-current");
  });

  it("marks the section being read as the current location", () => {
    renderNav();

    act(() => notify({ projects: true }));
    expect(screen.getByRole("link", { name: "projects" })).toHaveAttribute(
      "aria-current",
      "location",
    );

    act(() => notify({ projects: false, skills: true }));
    expect(screen.getByRole("link", { name: "skills" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    expect(screen.getByRole("link", { name: "projects" })).not.toHaveAttribute("aria-current");
  });

  it("prefers the earlier section when two touch the band", () => {
    renderNav();
    act(() => notify({ experience: true, about: true }));
    expect(screen.getByRole("link", { name: "about" })).toHaveAttribute("aria-current", "location");
  });
});
