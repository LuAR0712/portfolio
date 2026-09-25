"use client";

import type { ReactNode } from "react";
import { fadeUp, inViewOptions } from "@/lib/motion";
import { motionTags, type MotionTag } from "./motion-tags";

type RevealProps = {
  as?: MotionTag;
  className?: string;
  children: ReactNode;
};

// Fades a block up once when it scrolls into view. `data-reveal` lets the <noscript>
// fallback in the layout show content when JavaScript is off.
export function Reveal({ as = "div", className, children }: RevealProps) {
  const Component = motionTags[as];

  return (
    <Component
      data-reveal=""
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOptions}
    >
      {children}
    </Component>
  );
}
