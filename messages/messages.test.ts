// @vitest-environment node
import en from "./en.json";
import es from "./es.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const entries = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") entries.set(path, value);
    else for (const [k, v] of flatten(value, path)) entries.set(k, v);
  }
  return entries;
}

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

const esEntries = flatten(es);
const enEntries = flatten(en);

describe("messages", () => {
  it("es and en have identical key sets", () => {
    expect([...enEntries.keys()].sort()).toEqual([...esEntries.keys()].sort());
  });

  it("no message is empty", () => {
    for (const [key, value] of [...esEntries, ...enEntries]) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("translations use the same interpolation placeholders", () => {
    for (const [key, value] of esEntries) {
      expect(placeholders(enEntries.get(key) ?? ""), key).toEqual(placeholders(value));
    }
  });
});
