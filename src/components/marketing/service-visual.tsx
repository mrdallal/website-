import type { ServiceVisual as Visual } from "@/types/content";
import { cn } from "@/lib/utils";

interface ServiceVisualProps {
  visual: Visual;
  className?: string;
}

/**
 * Monochrome geometric marks for each service. Drawn in currentColor so they
 * invert with the card on hover.
 */
export function ServiceVisual({ visual, className }: ServiceVisualProps) {
  const common = {
    viewBox: "0 0 120 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className: cn("size-full", className),
    "aria-hidden": true,
  } as const;

  switch (visual) {
    case "website":
      return (
        <svg {...common}>
          <rect x="10" y="14" width="100" height="92" />
          <path d="M10 30h100" />
          <rect x="22" y="44" width="46" height="10" fill="currentColor" stroke="none" />
          <path d="M22 64h60M22 74h48" />
          <rect x="22" y="86" width="26" height="10" fill="var(--color-lime)" stroke="none" />
          <circle cx="18" cy="22" r="2" fill="currentColor" stroke="none" />
          <circle cx="26" cy="22" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "capture":
      return (
        <svg {...common}>
          <path d="M14 18h92l-34 40v34l-24 12V58z" />
          <path d="M30 32h60M38 44h44" />
          <rect x="52" y="86" width="12" height="12" fill="var(--color-lime)" stroke="none" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <rect x="12" y="12" width="26" height="26" />
          <rect x="82" y="12" width="26" height="26" />
          <rect x="47" y="82" width="26" height="26" fill="var(--color-lime)" stroke="none" />
          <path d="M38 25h44M25 38v20a10 10 0 0 0 10 10h50a10 10 0 0 0 10-10V38M60 68v14" />
          <circle cx="60" cy="25" r="3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "growth":
    default:
      return (
        <svg {...common}>
          <path d="M14 106h92" />
          <rect x="22" y="78" width="14" height="28" />
          <rect x="44" y="60" width="14" height="46" />
          <rect x="66" y="42" width="14" height="64" />
          <rect x="88" y="20" width="14" height="86" fill="var(--color-lime)" stroke="none" />
          <path d="M22 72 50 50 72 34 100 14" strokeDasharray="3 3" />
        </svg>
      );
  }
}
