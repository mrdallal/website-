import Link from "next/link";
import type { CaseStudy } from "@/types/content";
import { workSection } from "@/content/home";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/marketing/project-card";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

interface WorkGridProps {
  projects: CaseStudy[];
  /** Section header on the homepage; omit on the /work page */
  withHeader?: boolean;
  tone?: "white" | "bone";
}

const spans: Record<CaseStudy["size"], string> = {
  large: "lg:col-span-7",
  medium: "lg:col-span-5",
  small: "lg:col-span-4",
};

/**
 * Asymmetric editorial grid. The first "large" project takes the lead column;
 * the rest flow into the remaining space.
 */
export function WorkGrid({ projects, withHeader = true, tone = "white" }: WorkGridProps) {
  return (
    <Section tone={tone} aria-labelledby={withHeader ? "work-heading" : undefined}>
      <Container>
        {withHeader ? (
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel as="p" index="04" className="mb-8">
                {workSection.label}
              </SectionLabel>
              <SectionHeading id="work-heading" lead={workSection.body}>
                {workSection.headline}
              </SectionHeading>
            </div>
            <Button asChild variant="outline" withArrow>
              <Link href={workSection.cta.href}>{workSection.cta.label}</Link>
            </Button>
          </div>
        ) : null}

        <div className={cn("grid gap-x-8 gap-y-14 lg:grid-cols-12", withHeader && "mt-14")}>
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 90} className={cn(spans[project.size], i === 0 && "lg:row-span-2")}>
              <ProjectCard project={project} emphasis={project.size === "large"} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
