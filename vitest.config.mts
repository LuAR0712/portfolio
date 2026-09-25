import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vitest/config";

// Mirrors Next's static image imports (StaticImageData) so next/image renders in tests.
const staticImages: Plugin = {
  name: "static-images",
  enforce: "pre",
  load(id) {
    if (!/\.(jpe?g|png|webp|avif)$/.test(id)) return null;
    const src = `/${id.split("/public/")[1]}`;
    return `export default { src: "${src}", width: 480, height: 600, blurDataURL: "data:image/png;base64,iVBORw0KGgo=" };`;
  },
};

export default defineConfig({
  plugins: [react(), staticImages],
  resolve: {
    alias: {
      "@/messages": fileURLToPath(new URL("./messages", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "messages/**/*.test.ts"],
    css: false,
  },
});
