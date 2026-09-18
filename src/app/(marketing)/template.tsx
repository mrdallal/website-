"use client";

import { motion } from "motion/react";
import { luxuryEase } from "@/components/marketing/reveal";

/**
 * Page transition for the marketing site: a soft rise-and-settle on every
 * navigation. Templates remount per route, so this plays on each page.
 */
export default function MarketingTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: luxuryEase }}>
      {children}
    </motion.div>
  );
}
