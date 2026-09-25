import { motion } from "motion/react";

// Elements the reveal wrappers can render as, so wrappers never add extra DOM nodes.
export const motionTags = {
  div: motion.div,
  header: motion.header,
  p: motion.p,
  ol: motion.ol,
  ul: motion.ul,
  li: motion.li,
  dl: motion.dl,
} as const;

export type MotionTag = keyof typeof motionTags;
