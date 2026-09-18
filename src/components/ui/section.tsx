import * as React from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "bone" | "ink" | "lime" | "white";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  padding?: "default" | "sm" | "none";
  bordered?: boolean;
  as?: "section" | "div" | "header" | "footer";
}

const tones: Record<SectionTone, string> = {
  bone: "bg-canvas text-bone",
  ink: "bg-ink text-bone",
  lime: "bg-lime text-ink",
  white: "bg-surface text-bone",
};

const paddings = {
  default: "py-section",
  sm: "py-section-sm",
  none: "",
};

export function Section({
  tone = "bone",
  padding = "default",
  bordered = false,
  as: Comp = "section",
  className,
  ...props
}: SectionProps) {
  return (
    <Comp
      className={cn("relative", tones[tone], paddings[padding], bordered && "border-t hairline", className)}
      {...props}
    />
  );
}
