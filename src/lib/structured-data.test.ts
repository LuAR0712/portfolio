// @vitest-environment node
import { buildPersonJsonLd, serializeJsonLd } from "./structured-data";

const person = buildPersonJsonLd({
  locale: "en",
  siteUrl: "https://example.com",
  jobTitle: "Frontend Developer",
  description: "Builds interfaces.",
});

describe("buildPersonJsonLd", () => {
  it("describes the person from typed content", () => {
    expect(person).toMatchObject({
      "@type": "Person",
      name: "Luciano Rossi",
      url: "https://example.com/en",
      worksFor: { name: "CDA Informática" },
      sameAs: ["https://www.linkedin.com/in/luciano-a-rossi-98a38817b/"],
    });
    expect(person.knowsAbout).toContain("TypeScript");
  });

  it("never includes a phone number", () => {
    expect(JSON.stringify(person)).not.toMatch(/telephone|\+?\d[\d\s().-]{7,}\d/);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so the payload can't close the script tag", () => {
    expect(serializeJsonLd({ x: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
