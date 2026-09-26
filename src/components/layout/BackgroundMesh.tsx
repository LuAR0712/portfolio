"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { PARALLAX_DISTANCE } from "@/lib/motion";

// Fixed gradient layer behind the page. It drifts up slightly as the page scrolls; it's
// taller than the viewport so the drift never reveals an edge. Static with reduced motion.
export function BackgroundMesh() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -PARALLAX_DISTANCE]);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[calc(100lvh+8rem)] bg-mesh"
      style={reduceMotion ? undefined : { y }}
    >
      {/* Tinted by the time of day in Buenos Aires once DayPhaseAmbient sets data-ba-phase. */}
      <div className="absolute inset-0 bg-ambient" />
    </motion.div>
  );
}
