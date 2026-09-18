import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  itemClassName?: string;
  /** Seconds for one full loop */
  duration?: number;
  separator?: React.ReactNode;
}

/**
 * CSS-only marquee: the track is duplicated once and translated by -50%.
 * Respects prefers-reduced-motion (animation is disabled globally).
 */
export function Marquee({ items, className, itemClassName, duration = 42, separator }: MarqueeProps) {
  const track = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
      style={{ minWidth: "100%" }}
    >
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className={cn("flex items-center", itemClassName)}>
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className="mx-8 inline-block size-2 bg-lime sm:mx-12">
            {separator}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("group/marquee relative w-full overflow-hidden", className)}>
      <div
        className="flex w-max animate-marquee motion-reduce:animate-none group-hover/marquee:[animation-play-state:paused]"
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  );
}
