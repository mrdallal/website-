import * as React from "react";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/marketing/reveal";
import { RevealLines } from "@/components/motion/reveal-text";
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 glow-lime" />
      <Container className="relative pb-16 sm:pb-20">
        <Reveal immediate delay={100} distance={12}>
          <SectionLabel as="p" className="mb-8">
            {label}
          </SectionLabel>
        </Reveal>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealLines as="h1" immediate delay={0.2} lines={headline} className="text-display lg:col-span-8" />
          {intro ? (
            <Reveal immediate delay={650} distance={16} className="max-w-[44ch] text-lead text-current/75 lg:col-span-4">
              <p>{intro}</p>
            </Reveal>
          ) : null}
        </div>
        {aside ? (
          <Reveal immediate delay={800} distance={12} className="mt-12 border-t hairline pt-6">
            {aside}
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
