import * as React from "react";
import { RevealWords } from "@/components/motion/reveal-text";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h2" | "h3";
  /** Optional supporting paragraph rendered under the heading */
  lead?: React.ReactNode;
  leadClassName?: string;
  align?: "left" | "center";
  /** Disable the word-by-word reveal */
  static?: boolean;
}

const sizes = {
  display: "text-display max-w-[14ch]",
  h2: "text-h2 max-w-[18ch]",
  h3: "text-h3 max-w-[26ch]",
};

/**
 * Heading + optional lead. String headings get a masked word-by-word reveal
 * when scrolled into view. Width limits live on the heading itself so the
 * `ch` unit resolves against the heading's font size.
 */
export function SectionHeading({
  as: Comp = "h2",
  size = "h2",
  lead,
  leadClassName,
  align = "left",
  static: isStatic = false,
  className,
  children,
  ...props
}: SectionHeadingProps) {
  const content = typeof children === "string" && !isStatic ? <RevealWords text={children} /> : children;

  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", lead && "space-y-6")}>
      <Comp className={cn(sizes[size], "font-semibold", className)} {...props}>
        {content}
      </Comp>
      {lead ? <p className={cn("max-w-[52ch] text-lead text-current/75", leadClassName)}>{lead}</p> : null}
    </div>
  );
}
