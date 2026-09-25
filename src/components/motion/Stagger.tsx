"use client";

import type { ReactNode } from "react";
import { inViewOptions, staggerContainer } from "@/lib/motion";
import { motionTags, type MotionTag } from "./motion-tags";

type StaggerProps = {
  as?: MotionTag;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

// List container: when it enters the viewport, its <StaggerItem> children reveal in sequence.
export function Stagger({ as = "div", className, children, ...aria }: StaggerProps) {
  const Component = motionTags[as];

  return (
    <Component
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOptions}
      {...aria}
    >
      {children}
    </Component>
  );
}
