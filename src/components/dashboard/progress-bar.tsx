import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  label?: string;
}

export function ProgressBar({ value, className, label = "Progress" }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className={cn("h-1.5 w-full bg-raised", className)}
    >
      <div className={cn("h-full", clamped === 100 ? "bg-lime" : "bg-ink")} style={{ width: `${clamped}%` }} />
    </div>
  );
}
