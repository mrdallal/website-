import type { Metadata } from "next";
import Link from "next/link";
import { aboutPage } from "@/content/about";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { PageHero } from "@/components/marketing/page-hero";
import { ProcessSection } from "@/components/marketing/process-section";
import { Reveal } from "@/components/marketing/reveal";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "About",
  description:
    "TECHSIDES is a digital agency combining technology, design and systems thinking to turn attention into business outcomes.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero label={aboutPage.label} headline={aboutPage.headline} intro={aboutPage.intro} />

      <Section tone="ink" aria-labelledby="pillars-heading">
        <Container>
          <SectionLabel as="p" index="01" className="mb-8">
            What we combine
          </SectionLabel>
          <SectionHeading id="pillars-heading">Four disciplines, one outcome.</SectionHeading>
          <ul className="mt-14 grid gap-px border border-bone/15 bg-bone/15 sm:grid-cols-2 lg:grid-cols-4">
            {aboutPage.pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.title} delay={i * 80} className="bg-ink p-7 sm:p-8">
                <span className="micro-mono text-lime">0{i + 1}</span>
                <h3 className="mt-8 text-h4 font-semibold uppercase tracking-[-0.02em]">{pillar.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-bone/65">{pillar.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="bone" aria-labelledby="beliefs-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel as="p" index="02" className="mb-8">
                What we believe
              </SectionLabel>
              <SectionHeading id="beliefs-heading">Opinions we build with.</SectionHeading>
            </div>
            <ol className="border-t border-bone/30 lg:col-span-7">
              {aboutPage.beliefs.map((belief, i) => (
                <Reveal as="li" key={belief} delay={i * 60} className="flex items-baseline gap-6 border-b border-bone/15 py-6">
                  <span className="font-mono text-sm text-mute">0{i + 1}</span>
                  <span className="text-h3 font-semibold tracking-[-0.02em]">{belief}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section tone="white" bordered aria-labelledby="stack-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <SectionLabel as="p" index="03" className="mb-8">
                {aboutPage.stack.label}
              </SectionLabel>
              <h2 id="stack-heading" className="text-h3 font-semibold">
                A modern, boring-in-the-right-places stack.
              </h2>
            </div>
            <ul className="flex flex-wrap gap-3 lg:col-span-8">
              {aboutPage.stack.items.map((item) => (
                <li key={item} className="border border-bone/30 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.06em]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <ProcessSection />

      <Section tone="ink" padding="sm">
        <Container className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-[24ch] text-h3 font-semibold">{aboutPage.cta.headline}</h2>
          <Button asChild variant="lime" size="lg" withArrow>
            <Link href={aboutPage.cta.primary.href}>{aboutPage.cta.primary.label}</Link>
          </Button>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
