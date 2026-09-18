import Link from "next/link";
import { hero } from "@/content/home";
import { primaryCta, secondaryCta } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Reveal } from "@/components/marketing/reveal";
import { RevealLines } from "@/components/motion/reveal-text";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";

export function Hero() {
  const lines = hero.headline;

  return (
    <section className="relative overflow-hidden bg-canvas pt-28 sm:pt-36 lg:pt-40" aria-labelledby="hero-heading">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid text-bone [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 glow-lime" />
      <Container className="relative">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal immediate delay={100} distance={12}>
              <SectionLabel as="p" className="mb-8">
                {hero.eyebrow}
              </SectionLabel>
            </Reveal>
            <RevealLines
              as="h1"
              immediate
              delay={0.25}
              lines={lines}
              className="text-display"
              accentLastLine
            />
            <span id="hero-heading" className="sr-only">
              {lines.join(" ")}
            </span>
            <Reveal immediate delay={700} distance={18}>
              <p className="mt-8 max-w-[46ch] text-lead text-bone/70">{hero.subheading}</p>
            </Reveal>
            <Reveal immediate delay={850} distance={18} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Magnetic>
                <Button asChild size="lg" withArrow>
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Button asChild size="lg" variant="outline" withArrow>
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              </Magnetic>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal immediate delay={500} distance={40}>
              <Parallax distance={70}>
                <HeroVisual />
              </Parallax>
            </Reveal>
          </div>
        </div>

        <Reveal immediate delay={1100} distance={0} className="mt-16 flex flex-col gap-3 border-t border-bone/10 py-5 sm:mt-24 sm:flex-row sm:items-center sm:justify-between">
          <p className="micro-mono text-mute">{hero.note}</p>
          <p className="micro-mono text-mute">Attention → Website → Lead → Follow-up → Business</p>
        </Reveal>
      </Container>
    </section>
  );
}
