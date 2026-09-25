"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { progressSpring } from "@/lib/motion";

// Reading progress. It reflects state, so it stays with reduced motion — just without the spring.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, progressSpring);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-primary"
      style={{ scaleX: reduceMotion ? scrollYProgress : smoothProgress }}
    />
  );
}
