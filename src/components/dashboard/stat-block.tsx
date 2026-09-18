import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatBlockProps {
  label: string;
  /** Number or formatted string; `null` renders "No data yet". */
  value: number | string | null;
  hint?: string;
  href?: string;
  accent?: boolean;
  className?: string;
}

/**
 * Oversized metric. Honest by design: with no data it shows 0 or "No data yet",
 * never a sample number.
 */
export function StatBlock({ label, value, hint, href, accent = false, className }: StatBlockProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="micro-mono text-current/60">{label}</p>
        {href ? <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" /> : null}
      </div>
      {value === null ? (
        <p className="mt-6 text-lg font-bold text-current/50">No data yet</p>
      ) : (
        <p className="mt-4 font-mono text-[clamp(2.5rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.04em]">{value}</p>
      )}
      {hint ? <p className="mt-3 text-xs text-current/60">{hint}</p> : null}
    </>
  );

  const classes = cn(
    "group flex flex-col justify-between border p-5 transition-colors",
    accent ? "border-lime/30 bg-lime-dim text-lime" : "border-bone/15 bg-surface text-bone",
    href && (accent ? "hover:border-lime/60" : "hover:bg-raised"),
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }
  return <div className={classes}>{body}</div>;
}
