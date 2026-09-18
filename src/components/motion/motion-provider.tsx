"use client";

import { MotionConfig } from "motion/react";

/**
 * Global motion settings. `reducedMotion="user"` disables transform and
 * layout animations for visitors who prefer reduced motion while keeping the
 * same component tree, so server and client markup always match.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
