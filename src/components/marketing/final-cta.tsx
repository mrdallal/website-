import Link from "next/link";
import { finalCta } from "@/content/home";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { Reveal } from "@/components/marketing/reveal";
import { RevealLines } from "@/components/motion/reveal-text";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * Campaign-style ending: near-black field, faint vertical rules, a soft lime
 * glow and an oversized acid headline with a single lime CTA.
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-bone/10 bg-canvas text-bone" aria-labelledby="cta-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid text-bone" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 glow-lime" />
      <Container className="relative py-section">
        <Reveal distance={12}>
          <SectionLabel as="p" className="mb-10">
            {finalCta.label}
          </SectionLabel>
        </Reveal>
        <RevealLines
          as="h2"
          lines={finalCta.headline}
          stagger={0.12}
          className="text-[clamp(3rem,10vw,9rem)] font-semibold leading-[0.92] tracking-[-0.045em]"
          accentLastLine
        />
        <span id="cta-heading" className="sr-only">
          {finalCta.headline.join(" ")}
        </span>
        <Reveal delay={200} className="mt-14 grid gap-8 border-t border-bone/10 pt-8 md:grid-cols-12 md:items-center">
          <p className="max-w-[44ch] text-lead text-bone/70 md:col-span-6">{finalCta.body}</p>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end">
            <Magnetic>
              <Button asChild size="lg" withArrow>
                <Link href={finalCta.primary.href}>{finalCta.primary.label}</Link>
              </Button>
            </Magnetic>
            <Magnetic strength={0.18}>
              <Button asChild size="lg" variant="outline" withArrow>
                <Link href={finalCta.secondary.href}>{finalCta.secondary.label}</Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
