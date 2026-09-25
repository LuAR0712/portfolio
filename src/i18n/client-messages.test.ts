// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import es from "@/messages/es.json";
import { CLIENT_NAMESPACES, pickClientMessages } from "./client-messages";

const srcDir = fileURLToPath(new URL("..", import.meta.url));

function* sourceFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* sourceFiles(path);
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) yield path;
  }
}

const clientNamespaces = new Set<string>();
for (const file of sourceFiles(srcDir)) {
  const code = readFileSync(file, "utf8");
  if (!code.startsWith('"use client"')) continue;
  for (const [, namespace] of code.matchAll(/useTranslations\(\s*"([^"]+)"\s*\)/g)) {
    clientNamespaces.add(namespace!);
  }
}

function lookup(tree: unknown, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((node, key) => (node as Record<string, unknown>)?.[key], tree);
}

describe("client messages", () => {
  it("finds the namespaces used by client components", () => {
    expect(clientNamespaces.size).toBeGreaterThan(0);
  });

  it.each([...clientNamespaces])("sends %s to the browser", (namespace) => {
    expect(CLIENT_NAMESPACES).toContain(namespace);
    expect(lookup(pickClientMessages(es), namespace)).toEqual(lookup(es, namespace));
  });
});
