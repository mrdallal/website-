"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** Total vertical travel in px across the element's scroll range */
  distance?: number;
}

/**
 * Gentle scroll-linked drift. Keeps the element slightly "behind" the page
 * as it scrolls, which reads as depth without becoming a parallax gimmick.
 */
export function Parallax({ children, className, distance = 60 }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
