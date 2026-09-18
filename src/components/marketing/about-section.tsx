import Link from "next/link";
import { aboutSection } from "@/content/home";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/marketing/reveal";

export function AboutSection() {
  return (
    <Section tone="ink" aria-labelledby="about-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel as="p" index="06" className="mb-8">
              {aboutSection.label}
            </SectionLabel>
            <SectionHeading id="about-heading">{aboutSection.headline}</SectionHeading>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="space-y-5 text-body text-bone/75">
              {aboutSection.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ol className="mt-10 border-t border-bone/15">
              {aboutSection.principles.map((principle, i) => (
                <Reveal as="li" key={principle} delay={i * 70} className="flex items-baseline gap-5 border-b border-bone/15 py-4">
                  <span className="micro-mono text-lime">0{i + 1}</span>
                  <span className="text-h4 font-bold">{principle}</span>
                </Reveal>
              ))}
            </ol>

            <Button asChild variant="outlineLight" withArrow className="mt-10">
              <Link href={aboutSection.cta.href}>{aboutSection.cta.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
