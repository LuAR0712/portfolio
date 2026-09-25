import { fireEvent, render } from "@testing-library/react";
import { CursorSpotlight } from "./CursorSpotlight";

function mockMedia(matches: Record<string, boolean>) {
  const original = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    ...original(query),
    matches: Object.entries(matches).some(([q, value]) => value && query.includes(q)),
  }));
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CursorSpotlight", () => {
  it("follows the mouse through CSS variables", async () => {
    mockMedia({ "pointer: fine": true });
    const { container } = render(<CursorSpotlight />);
    const layer = container.firstElementChild as HTMLElement;

    fireEvent.pointerMove(window, { clientX: 120, clientY: 340 });
    await nextFrame();

    expect(layer).toHaveAttribute("data-active", "true");
    expect(layer.style.getPropertyValue("--spot-x")).toBe("120px");
    expect(layer.style.getPropertyValue("--spot-y")).toBe("340px");
  });

  it("stays off on touch devices", async () => {
    mockMedia({ "pointer: fine": false });
    const { container } = render(<CursorSpotlight />);

    fireEvent.pointerMove(window, { clientX: 10, clientY: 10 });
    await nextFrame();

    expect(container.firstElementChild).not.toHaveAttribute("data-active");
  });

  it("stays off when reduced motion is requested", async () => {
    mockMedia({ "pointer: fine": true, "prefers-reduced-motion": true });
    const { container } = render(<CursorSpotlight />);

    fireEvent.pointerMove(window, { clientX: 10, clientY: 10 });
    await nextFrame();

    expect(container.firstElementChild).not.toHaveAttribute("data-active");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<CursorSpotlight />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
