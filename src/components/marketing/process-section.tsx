import { processSteps } from "@/content/process";
import { processSection } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/marketing/reveal";

/**
 * Process as typography: oversized numbers, a shared rail and staggered reveal.
 * Not a timeline component: on desktop the five steps sit side by side; on
 * mobile they stack against a vertical rail.
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
          <p className="text-lead text-bone/70 lg:col-span-4 lg:col-start-9">{processSection.body}</p>
        </div>

        <ol className="mt-16 grid gap-0 border-t border-bone/30 lg:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              delay={i * 90}
              className="group relative flex gap-6 border-b border-bone/15 py-8 lg:flex-col lg:gap-0 lg:border-b-0 lg:border-r lg:border-r-ink/15 lg:px-6 lg:py-10 lg:first:pl-0 lg:last:border-r-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 hidden h-[3px] w-0 bg-lime transition-[width] duration-700 ease-[var(--ease-out-expo)] group-[.is-visible]:w-full lg:block"
              />
              <span className="font-mono text-[clamp(3rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.05em] text-bone lg:mb-10">
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
      </Container>
    </Section>
  );
}
