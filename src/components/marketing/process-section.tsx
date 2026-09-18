import { processSteps } from "@/content/process";
import { processSection } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { ProcessRail } from "@/components/marketing/process-rail";

/**
 * Process as typography: oversized numbers, a lime rail that draws across
 * the steps and staggered reveals. On desktop the five steps sit side by
 * side; on mobile they stack.
 */
export function ProcessSection() {
  return (
    <Section tone="bone" aria-labelledby="process-heading">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel as="p" index="05" className="mb-8">
              {processSection.label}
            </SectionLabel>
            <SectionHeading id="process-heading">{processSection.headline}</SectionHeading>
          </div>
          <Reveal delay={150} className="text-lead text-bone/70 lg:col-span-4 lg:col-start-9">
            <p>{processSection.body}</p>
          </Reveal>
        </div>

        <div className="relative mt-16">
          <ProcessRail />
          <ol className="grid gap-0 border-t border-bone/30 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.number}
                delay={i * 110}
                className="group relative flex gap-6 border-b border-bone/10 py-8 lg:flex-col lg:gap-0 lg:border-b-0 lg:border-r lg:border-r-bone/10 lg:px-6 lg:py-10 lg:first:pl-0 lg:last:border-r-0"
              >
                <span className="font-mono text-[clamp(3rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.05em] text-bone transition-colors duration-500 group-hover:text-lime lg:mb-10">
                  {step.number}
                </span>
                <div className="flex-1">
                  <h3 className="text-h4 font-semibold uppercase tracking-[-0.02em]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mute">{step.description}</p>
                  <ul className="mt-6 space-y-2 border-t border-bone/10 pt-4">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-3 text-sm">
                        <span aria-hidden="true" className="size-1.5 shrink-0 bg-bone/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
