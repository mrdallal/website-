"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

export const luxuryEase = [0.16, 1, 0.3, 1] as const;

type Tag = "div" | "li" | "article" | "section" | "figure" | "span" | "p";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Delay in ms, useful for staggering siblings */
  delay?: number;
  as?: Tag;
  /** Animate on mount instead of when scrolled into view */
  immediate?: boolean;
  /** Vertical travel in px */
  distance?: number;
  children?: React.ReactNode;
}

/**
 * Scroll (or mount) reveal built on Framer Motion: a slow, decelerating rise
 * with a fade. Reduced-motion preferences are honoured globally through
 * MotionConfig (see MotionProvider), which keeps server and client markup identical.
 */
export function Reveal({ delay = 0, as = "div", immediate = false, distance = 28, children, ...props }: RevealProps) {
  const Component = (motion as unknown as Record<Tag, typeof motion.div>)[as];
  const visible = { opacity: 1, y: 0, filter: "blur(0px)" };
  const hidden = { opacity: 0, y: distance, filter: "blur(6px)" };

  return (
    <Component
      initial={hidden}
      {...(immediate ? { animate: visible } : { whileInView: visible, viewport: { once: true, margin: "0px 0px -12% 0px" } })}
      transition={{ duration: 1, ease: luxuryEase, delay: delay / 1000 }}
      {...props}
    >
      {children}
    </Component>
  );
}
