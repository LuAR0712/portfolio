import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "motion/react";

// Tests assert on states, not on animation frames: finish every motion animation instantly.
MotionGlobalConfig.skipAnimations = true;

// jsdom has no matchMedia; next-themes and responsive components need it. Defaults to "no match"
// (light color scheme, mobile viewport).
if (typeof window !== "undefined") {
  // jsdom has no IntersectionObserver; motion's whileInView needs one. Elements simply never
  // report as intersecting, which is enough for tests that assert on content, not animation.
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    readonly scrollMargin = "0px";
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  window.IntersectionObserver = MockIntersectionObserver;

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
