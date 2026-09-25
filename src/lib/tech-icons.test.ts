// @vitest-environment node
import { tech } from "@/content/tech";
import { brandHoverColor, getTechIcon } from "./tech-icons";

describe("tech icons", () => {
  it.each(Object.values(tech).filter((item) => "icon" in item))(
    "resolves a logo for $name",
    (item) => {
      expect(getTechIcon(item.icon!).path).toMatch(/^[Mm]/); // SVG path starts with a moveto
    },
  );

  it("uses the brand color on hover for mid-luminance brands", () => {
    expect(brandHoverColor("react")).toBe("#61DAFB");
    expect(brandHoverColor("typescript")).toBe("#3178C6");
  });

  it("keeps the text color for near-black brands that would vanish on the dark theme", () => {
    expect(brandHoverColor("nextjs")).toBeUndefined();
    expect(brandHoverColor("githubCopilot")).toBeUndefined();
  });
});
