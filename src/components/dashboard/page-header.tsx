import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function PageHeader({ title, eyebrow, description, actions, backHref, backLabel = "Back", className }: PageHeaderProps) {
  return (
    <header className={cn("mb-8 flex flex-col gap-5 border-b border-bone/15 pb-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {backHref ? (
          <Link href={backHref} className="link-arrow mb-4 inline-flex items-center gap-2 text-xs font-semibold text-mute hover:text-lime">
            <ArrowLeft className="arrow size-3.5" />
            {backLabel}
          </Link>
        ) : null}
        {eyebrow ? <p className="micro-mono mb-2 text-mute">{eyebrow}</p> : null}
        <h1 className="truncate text-h3 font-semibold tracking-[-0.02em]">{title}</h1>
        {description ? <p className="mt-2 max-w-[60ch] text-sm text-mute">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
