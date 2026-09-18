import { ArrowDown } from "lucide-react";
import { problem } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  neutral: "border-bone/30 text-bone",
  warn: "border-lime bg-lime text-ink",
  bad: "border-bone/30 text-bone/40 line-through decoration-danger decoration-[3px]",
};

export function ProblemSection() {
  return (
    <Section tone="ink" aria-labelledby="problem-heading">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel as="p" index="01" className="mb-8">
              {problem.label}
            </SectionLabel>
            <SectionHeading id="problem-heading" className="max-w-[16ch]">
              {problem.headline}
            </SectionHeading>
            <p className="mt-8 max-w-[52ch] text-lead text-bone/70">{problem.body}</p>
          </div>

          <Reveal className="lg:col-span-4 lg:col-start-9">
            <ol className="flex flex-col items-stretch" aria-label="Where attention leaks">
              {problem.flow.map((node, i) => (
                <li key={node.label} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex w-full items-center justify-center border px-6 py-8 text-center font-semibold uppercase leading-none tracking-[-0.02em]",
                      node.tone === "warn" ? "text-[clamp(3rem,6vw,5rem)]" : "text-[clamp(1.5rem,2.5vw,2.25rem)]",
                      toneClasses[node.tone],
                    )}
                  >
                    {node.label}
                  </div>
                  {i < problem.flow.length - 1 ? (
                    <ArrowDown aria-hidden="true" className="my-3 size-6 text-bone/40" />
                  ) : null}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <ul className="mt-20 grid gap-px border border-bone/15 bg-bone/15 sm:grid-cols-2 lg:grid-cols-4">
          {problem.leaks.map((leak, i) => (
            <Reveal as="li" key={leak.title} delay={i * 80} className="bg-ink p-6 sm:p-8">
              <span className="micro-mono text-bone/40">Leak 0{i + 1}</span>
              <h3 className="mt-6 text-h4 font-bold">{leak.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-bone/65">{leak.text}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-20 grid gap-8 bg-lime p-8 text-ink sm:p-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel as="p" className="mb-6">
              {problem.resolution.label}
            </SectionLabel>
            <h3 className="text-h3 font-semibold">{problem.resolution.headline}</h3>
          </div>
          <p className="text-body text-ink/80 lg:col-span-5">{problem.resolution.body}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
