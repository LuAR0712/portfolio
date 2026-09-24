import axe from "axe-core";

// Component-level axe run. Contrast is covered by src/styles/tokens.test.ts (jsdom can't compute
// styles), and `region` only makes sense for full pages.
export async function expectNoAxeViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
