"use client";

import * as React from "react";
import { motion } from "motion/react";
import { luxuryEase } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Clip-path wipe from the bottom with a slow settle from a slight zoom.
 *
 * The in-view observer lives on an unclipped wrapper: an element that is
 * clipped to nothing by its own clip-path never reports as intersecting, so
 * the clip and scale are driven as child variants instead.
 */
export function ImageReveal({ children, className, delay = 0 }: ImageRevealProps) {
  const wipe = {
    hidden: { clipPath: "inset(100% 0 0 0)" },
    visible: { clipPath: "inset(0% 0 0 0)", transition: { duration: 1.2, ease: luxuryEase, delay } },
  };
  const settle = {
    hidden: { scale: 1.12 },
    visible: { scale: 1, transition: { duration: 1.6, ease: luxuryEase, delay } },
  };

  return (
    <motion.div
      className={cn("relative h-full w-full", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="relative h-full w-full" variants={wipe}>
        <motion.div className="relative h-full w-full" variants={settle}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
