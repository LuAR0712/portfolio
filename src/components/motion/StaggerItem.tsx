"use client";

import type { ReactNode } from "react";
import { staggerItem } from "@/lib/motion";
import { motionTags, type MotionTag } from "./motion-tags";

type StaggerItemProps = {
  as?: MotionTag;
  className?: string;
  children: ReactNode;
};

// Child of <Stagger>: inherits the hidden/visible state from its parent.
export function StaggerItem({ as = "div", className, children }: StaggerItemProps) {
  const Component = motionTags[as];

  return (
    <Component data-reveal="" className={className} variants={staggerItem}>
      {children}
    </Component>
  );
}
