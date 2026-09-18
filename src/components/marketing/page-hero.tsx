import * as React from "react";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  /** Lines rendered as separate blocks on desktop */
  headline: string[];
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  tone?: "bone" | "ink";
  className?: string;
}

/** Inner-page header: label, oversized headline, intro and an optional aside. */
export function PageHero({ label, headline, intro, aside, tone = "bone", className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pt-28 sm:pt-36 lg:pt-40",
        tone === "ink" ? "bg-ink text-bone" : "bg-canvas text-bone",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <Container className="relative pb-16 sm:pb-20">
        <SectionLabel as="p" className="mb-8">
          {label}
        </SectionLabel>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <h1 className="text-display lg:col-span-8">
            {headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          {intro ? <p className="max-w-[44ch] text-lead text-current/75 lg:col-span-4">{intro}</p> : null}
        </div>
        {aside ? <div className="mt-12 border-t hairline pt-6">{aside}</div> : null}
      </Container>
    </section>
  );
}
