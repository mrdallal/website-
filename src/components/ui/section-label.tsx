import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Optional index like "01" shown before the label */
  index?: string;
  tone?: "default" | "muted";
  as?: "span" | "p" | "div";
}

/**
 * Eyebrow label as a tinted pill: lime type on a dark-green field with a
 * hairline lime border, matching the brand reference.
 */
export function SectionLabel({ index, tone = "default", as: Comp = "span", className, children, ...props }: SectionLabelProps) {
  return (
    <Comp
      className={cn(
        "label-mono inline-flex items-center gap-3 rounded-full border px-4 py-2.5",
        tone === "muted"
          ? "border-bone/15 bg-bone/5 text-bone/60"
          : "border-lime/25 bg-lime-dim text-lime",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="inline-block size-1.5 bg-current" />
      {index ? <span className="opacity-60">{index}</span> : null}
      <span>{children}</span>
    </Comp>
  );
}
