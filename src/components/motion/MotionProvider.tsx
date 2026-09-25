"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// With reducedMotion="user", every motion component drops transform animations when the OS
// asks for reduced motion, keeping only opacity fades.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
