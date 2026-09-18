import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3";
  size?: "display" | "h2" | "h3";
  /** Optional supporting paragraph rendered under the heading */
  lead?: React.ReactNode;
  leadClassName?: string;
  align?: "left" | "center";
}

const sizes = {
  display: "text-display max-w-[14ch]",
  h2: "text-h2 max-w-[18ch]",
  h3: "text-h3 max-w-[26ch]",
};

/**
 * Heading + optional lead. Width limits live on the heading itself so the
 * `ch` unit resolves against the heading's font size, not the body size.
 */
export function SectionHeading({
  as: Comp = "h2",
  size = "h2",
  lead,
  leadClassName,
  align = "left",
  className,
  children,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "flex flex-col items-center text-center", lead && "space-y-6")}>
      <Comp className={cn(sizes[size], "font-semibold", className)} {...props}>
        {children}
      </Comp>
      {lead ? <p className={cn("max-w-[52ch] text-lead text-current/75", leadClassName)}>{lead}</p> : null}
    </div>
  );
}
