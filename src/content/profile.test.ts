// @vitest-environment node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { profile } from "./profile";

const publicDir = fileURLToPath(new URL("../../public", import.meta.url));

describe("profile", () => {
  it.each(Object.entries(profile.cv))("ships the %s CV as a PDF in /public", (_, path) => {
    expect(path).toMatch(/\.pdf$/);
    expect(existsSync(`${publicDir}${path}`)).toBe(true);
  });

  it("links to an https LinkedIn profile", () => {
    expect(profile.linkedin).toMatch(/^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/?$/);
  });
});
