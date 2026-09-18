import * as React from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  padded?: boolean;
  as?: "section" | "div" | "article";
}

export function DashboardCard({ title, eyebrow, action, padded = true, as: Comp = "section", className, children, ...props }: DashboardCardProps) {
  return (
    <Comp className={cn("flex min-w-0 flex-col border border-bone/15 bg-surface", className)} {...props}>
      {title || action ? (
        <header className="flex items-center justify-between gap-4 border-b border-bone/10 px-5 py-3.5">
          <div>
            {eyebrow ? <p className="micro-mono text-mute">{eyebrow}</p> : null}
            {title ? <h2 className="text-sm font-bold">{title}</h2> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div className={cn("flex-1", padded && "p-5")}>{children}</div>
    </Comp>
  );
}
