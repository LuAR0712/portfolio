// @vitest-environment node
import type { Variants } from "motion/react";
import { DURATION, fadeUp, heroStep, staggerContainer, staggerItem } from "./motion";

// Guards the motion rules in CLAUDE.md: content animations ≤600 ms, transform/opacity only.
const MAX_SECONDS = 0.6;
const ALLOWED_PROPS = new Set(["opacity", "x", "y", "scale", "transition"]);

const contentVariants: Record<string, Variants> = { fadeUp, staggerItem };

describe("motion variants", () => {
  it("keep every duration within the 600 ms budget", () => {
    for (const value of Object.values(DURATION)) expect(value).toBeLessThanOrEqual(MAX_SECONDS);

    for (const [name, variants] of Object.entries(contentVariants)) {
      const transition = (variants.visible as { transition?: { duration?: number } }).transition;
      expect(transition?.duration, name).toBeLessThanOrEqual(MAX_SECONDS);
    }
  });

  it.each(Object.entries(contentVariants))("%s animates only transform and opacity", (_, v) => {
    for (const state of Object.values(v)) {
      for (const prop of Object.keys(state as object)) expect(ALLOWED_PROPS).toContain(prop);
    }
  });

  it("finishes a staggered list of 6 items well under a second", () => {
    const { staggerChildren = 0, delayChildren = 0 } = (
      staggerContainer.visible as {
        transition: { staggerChildren?: number; delayChildren?: number };
      }
    ).transition;
    expect(delayChildren + staggerChildren * 5 + DURATION.base).toBeLessThan(1);
  });

  it("sequences the hero in increasing delays", () => {
    const delays = [0, 1, 2, 3].map((step) => parseInt(heroStep(step).animationDelay, 10));
    expect(delays).toEqual([...delays].sort((a, b) => a - b));
    expect(delays[0]).toBe(0);
  });
});
