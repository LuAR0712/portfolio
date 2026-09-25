import type { Transition, Variants } from "motion/react";

/*
 * Single source of animation variants (see CLAUDE.md, rule 5).
 * - Content animations stay ≤600 ms and only touch transform/opacity (no layout shift).
 * - Reduced motion is handled globally by <MotionConfig reducedMotion="user">: transforms are
 *   dropped and only opacity remains. Scroll-linked effects check useReducedMotion themselves.
 */

// Mirrors --ease-out-expo in globals.css.
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  max: 0.6,
} as const;

const reveal: Transition = { duration: DURATION.base, ease: EASE_OUT_EXPO };

// Single element entering the viewport.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: reveal },
};

// Parent of a list: children reveal one after another.
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: reveal },
};

// Inline field error: a short drop-in so the message reads as attached to its field.
export const fieldError: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.fast, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
};

// Swapping whole form states (form ↔ success, status banners).
export const statusSwap: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: -8, transition: { duration: DURATION.fast } },
};

// Trigger once, slightly before the element is fully in view.
export const inViewOptions = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;

// Hero entrance (CSS `animate-rise`, see globals.css): title → headline → positioning → CTAs.
const HERO_STEP_MS = 90;
export function heroStep(step: number): { animationDelay: string } {
  return { animationDelay: `${step * HERO_STEP_MS}ms` };
}

// Scroll progress bar: responsive but not jittery.
export const progressSpring = { stiffness: 200, damping: 40, restDelta: 0.001 } as const;

// Background parallax: the mesh drifts up to this many px over the whole page.
export const PARALLAX_DISTANCE = 120;
