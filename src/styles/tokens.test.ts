// @vitest-environment node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/*
 * Guards WCAG AA contrast for semantic color pairs in both themes.
 * Tokens are read straight from globals.css, so changing the palette re-runs the check.
 */

const css = readFileSync(fileURLToPath(new URL("./globals.css", import.meta.url)), "utf8");

type Vars = Map<string, string>;

function collectVars(source: string): Vars {
  const vars: Vars = new Map();
  for (const [, name, value] of source.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    if (name && value && !vars.has(name)) vars.set(name, value.trim());
  }
  return vars;
}

const darkBlock = /\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
const lightVars = collectVars(css.replace(darkBlock, ""));
const darkVars = new Map([...lightVars, ...collectVars(darkBlock)]);

function resolve(name: string, vars: Vars): string {
  const value = vars.get(name);
  if (!value) throw new Error(`Token ${name} is not defined`);
  const ref = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
  return ref ? resolve(ref, vars) : value;
}

// OKLCH -> linear sRGB -> relative luminance (https://bottosson.github.io/posts/oklab/)
function luminance(color: string): number {
  const match = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/.exec(color);
  if (!match) throw new Error(`Unsupported color: ${color}`);
  const [L, C, H] = match.slice(1).map(Number) as [number, number, number];
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const clamp = (v: number) => Math.min(1, Math.max(0, v));
  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);

  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

function contrast(fg: string, bg: string, vars: Vars): number {
  const [hi, lo] = [luminance(resolve(fg, vars)), luminance(resolve(bg, vars))].sort(
    (x, y) => y - x,
  ) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = 4.5;
const NON_TEXT = 3;

const pairs: [fg: string, bg: string, min: number][] = [
  ["--color-fg", "--color-bg", TEXT],
  ["--color-fg", "--color-surface", TEXT],
  ["--color-muted", "--color-bg", TEXT],
  ["--color-muted", "--color-surface", TEXT],
  ["--color-primary", "--color-bg", TEXT],
  ["--color-primary", "--color-surface", TEXT],
  ["--color-primary-fg", "--color-primary", TEXT],
  ["--color-focus", "--color-bg", NON_TEXT],
  ["--color-focus", "--color-surface", NON_TEXT],
];

it("parses the dark theme overrides", () => {
  expect(collectVars(darkBlock).has("--color-bg")).toBe(true);
});

describe.each([
  ["light", lightVars],
  ["dark", darkVars],
] as const)("%s theme contrast", (_theme, vars) => {
  it.each(pairs)("%s on %s ≥ %s:1", (fg, bg, min) => {
    expect(contrast(fg, bg, vars)).toBeGreaterThanOrEqual(min);
  });
});
