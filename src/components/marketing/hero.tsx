import Link from "next/link";
import { hero } from "@/content/home";
import { primaryCta, secondaryCta } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { HeroVisual } from "@/components/marketing/hero-visual";

export function Hero() {
  const lines = hero.headline;
  const last = lines[lines.length - 1];

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 sm:pt-36 lg:pt-40" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid text-bone opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <Container className="relative">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel as="p" className="mb-8">
              {hero.eyebrow}
            </SectionLabel>
            <h1 id="hero-heading" className="text-display">
              {lines.slice(0, -1).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">
                <span className="text-lime">{last}</span>
              </span>
            </h1>
            <p className="mt-8 max-w-[46ch] text-lead text-bone/75">{hero.subheading}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" withArrow>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" withArrow>
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <HeroVisual />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-bone/15 py-5 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro-mono text-mute">{hero.note}</p>
          <p className="micro-mono text-mute">Attention → Website → Lead → Follow-up → Business</p>
        </div>
      </Container>
    </section>
  );
}
