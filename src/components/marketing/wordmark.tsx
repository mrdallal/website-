import Link from "next/link";
import { siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-base",
  md: "text-lg sm:text-xl",
  lg: "text-2xl",
};

/** Typography-based wordmark. The lime square is the brand's full stop. */
export function Wordmark({ className, href = "/", size = "md" }: WordmarkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-baseline gap-1 font-semibold uppercase leading-none tracking-[-0.04em] focus-visible:outline-2 focus-visible:outline-offset-4",
        sizes[size],
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <span>{siteConfig.name}</span>
      <span aria-hidden="true" className="inline-block size-[0.32em] translate-y-[-0.05em] bg-lime" />
    </Link>
  );
}
