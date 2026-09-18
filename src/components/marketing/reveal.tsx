"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay in ms, useful for staggering siblings */
  delay?: number;
  as?: "div" | "li" | "article" | "section" | "figure";
}

/**
 * Progressive scroll reveal. Content is visible without JS (see globals.css)
 * and animates in once when it enters the viewport.
 */
export function Reveal({ delay = 0, as: Comp = "div", className, style, children, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Comp
      // @ts-expect-error -- ref type differs per element, all are HTMLElement
      ref={ref}
      data-reveal=""
      className={cn(className)}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
      {...props}
    >
      {children}
    </Comp>
  );
}
