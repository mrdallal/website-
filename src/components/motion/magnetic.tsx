"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface MagneticProps {
  children: React.ReactNode;
  /** How far the element follows the pointer (0–1) */
  strength?: number;
  className?: string;
}

/**
 * Subtle magnetic pull toward the pointer on hover. Mouse pointers only, so
 * it is inert on touch devices; transform animations are disabled globally
 * for reduced-motion users via MotionConfig.
 */
export function Magnetic({ children, strength = 0.28, className }: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.4 });

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div ref={ref} className={className} style={{ x: springX, y: springY, display: "inline-block" }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}
