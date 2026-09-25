// @vitest-environment node
import { TECH_ICON_IDS } from "@/lib/tech-icons";
import { GET } from "./route";

describe("GET /tech-icons.svg", () => {
  it("serves a cacheable sprite with one symbol per icon", async () => {
    const response = GET();
    const svg = await response.text();

    expect(response.headers.get("Content-Type")).toBe("image/svg+xml");
    expect(response.headers.get("Cache-Control")).toContain("max-age");
    for (const id of TECH_ICON_IDS) expect(svg).toContain(`<symbol id="${id}"`);
  });
});
