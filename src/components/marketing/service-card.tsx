import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/types/content";
import { ServiceVisual } from "@/components/marketing/service-visual";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  href?: string;
  className?: string;
}

/**
 * Editorial, rectangular service block. The whole block is a link; on hover it
 * inverts to black with the mark and arrow following.
 */
export function ServiceCard({ service, href, className }: ServiceCardProps) {
  return (
    <Link
      href={href ?? `/services#${service.slug}`}
      className={cn(
        "group relative flex min-h-[380px] flex-col justify-between bg-canvas p-7 text-bone transition-colors duration-300 ease-out hover:bg-lime hover:text-ink focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] sm:p-9",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="font-mono text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em] text-bone/25 transition-colors group-hover:text-ink">
          {service.number}
        </span>
        <div className="size-16 shrink-0 sm:size-20">
          <ServiceVisual visual={service.visual} />
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-h3 font-semibold uppercase tracking-[-0.03em]">{service.title}</h3>
        <p className="mt-4 max-w-[40ch] text-body text-current/70">{service.description}</p>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {service.deliverables.slice(0, 3).map((item) => (
            <li key={item} className="micro-mono text-current/55">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-current/15 pt-5">
        <span className="label-mono">Explore</span>
        <ArrowRight
          aria-hidden="true"
          className="size-5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5"
        />
      </div>
    </Link>
  );
}
