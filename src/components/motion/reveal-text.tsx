"use client";

import * as React from "react";
import { motion } from "motion/react";
import { luxuryEase } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

interface RevealLinesProps {
  lines: string[];
  className?: string;
  /** Render the last line in the accent colour */
  accentLastLine?: boolean;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}

const container = (stagger: number, delay: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const lineVariants = {
  hidden: { y: "110%", rotate: 1.5 },
  visible: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: luxuryEase } },
};

/**
 * Masked line reveal: each line rises out of an overflow-hidden band.
 * Used for hero and section headlines.
 */
export function RevealLines({ lines, className, accentLastLine = false, delay = 0, stagger = 0.09, immediate = false, as: Tag = "div" }: RevealLinesProps) {
  const MotionTag = (motion as unknown as Record<string, typeof motion.div>)[Tag];

  return (
    <MotionTag
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      {...(immediate ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, amount: 0.4 } })}
    >
      {lines.map((text, i) => (
        <span
          key={`${i}-${text}`}
          className={cn("block overflow-hidden pb-[0.08em] -mb-[0.08em]", accentLastLine && i === lines.length - 1 && "text-lime")}
        >
          <motion.span className="block origin-left will-change-transform" variants={lineVariants}>
            {text}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

interface RevealWordsProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  immediate?: boolean;
}

const wordVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: luxuryEase } },
};

/**
 * Word-by-word masked reveal for inline headings.
 */
export function RevealWords({ text, className, delay = 0, stagger = 0.04, immediate = false }: RevealWordsProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      variants={container(stagger, delay)}
      initial="hidden"
      {...(immediate ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, amount: 0.5 } })}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={`${i}-${w}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
          <motion.span className="inline-block will-change-transform" variants={wordVariants}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
