import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xs border px-2 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em]",
  {
    variants: {
      tone: {
        neutral: "border-bone/15 bg-surface text-bone",
        outline: "border-current bg-transparent text-current",
        ink: "border-bone bg-bone text-ink",
        lime: "border-lime/30 bg-lime-dim text-lime",
        muted: "border-transparent bg-bone/8 text-mute",
        ok: "border-ok/30 bg-ok/10 text-ok",
        warn: "border-warn/30 bg-warn/10 text-warn",
        danger: "border-danger/30 bg-danger/10 text-danger",
        info: "border-bone/20 bg-raised text-bone",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ tone, dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}

export { badgeVariants };
