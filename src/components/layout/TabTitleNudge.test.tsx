import { renderWithIntl } from "@/test/render";
import { TabTitleNudge } from "./TabTitleNudge";

function setVisibility(state: DocumentVisibilityState) {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  document.dispatchEvent(new Event("visibilitychange"));
}

afterEach(() => {
  setVisibility("visible");
});

describe("TabTitleNudge", () => {
  it("swaps the title while the tab is hidden and restores it on return", () => {
    document.title = "Luciano Rossi — Desarrollador Frontend";
    renderWithIntl(<TabTitleNudge />);

    setVisibility("hidden");
    expect(document.title).toBe("👋 ¡Ey, volvé!");

    setVisibility("visible");
    expect(document.title).toBe("Luciano Rossi — Desarrollador Frontend");
  });

  it("restores the title if it unmounts while hidden", () => {
    document.title = "Original";
    const { unmount } = renderWithIntl(<TabTitleNudge />, { locale: "en" });

    setVisibility("hidden");
    expect(document.title).toBe("👋 Hey, come back!");
    unmount();

    expect(document.title).toBe("Original");
  });
});
