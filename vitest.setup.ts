import "@testing-library/jest-dom/vitest";

// jsdom has no matchMedia; next-themes and responsive components need it. Defaults to "no match"
// (light color scheme, mobile viewport).
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
