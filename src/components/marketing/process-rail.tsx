"use client";

import { motion } from "motion/react";
import { luxuryEase } from "@/components/marketing/reveal";

/** Lime line that draws itself across the top of the process grid on desktop. */
export function ProcessRail() {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-0 top-0 z-10 hidden h-[3px] w-full origin-left bg-lime lg:block"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.6, ease: luxuryEase, delay: 0.2 }}
    />
  );
}
