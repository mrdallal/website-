import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({ title, description, action, icon, className, compact = false }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 border border-dashed border-bone/25 bg-surface/60",
        compact ? "p-6" : "p-8 sm:p-12",
        className,
      )}
    >
      {icon ? <div className="flex size-10 items-center justify-center border border-bone/20 text-bone/70">{icon}</div> : null}
      <div className="space-y-1.5">
        <h3 className={cn("font-bold", compact ? "text-base" : "text-h4")}>{title}</h3>
        {description ? <p className="max-w-[48ch] text-sm text-mute">{description}</p> : null}
      </div>
      {action ? <div className="pt-1">{action}</div> : null}
    </div>
  );
}
