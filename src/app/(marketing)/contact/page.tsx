import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { processSteps } from "@/content/process";
import { serviceValues } from "@/content/lead-options";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with TECHSIDES. Tell us where the attention is coming from and we will show you what to build.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const requested = typeof params.service === "string" ? params.service : undefined;
  const defaultService = requested && (serviceValues as readonly string[]).includes(requested) ? requested : undefined;

  return (
    <>
      <Section tone="bone" padding="none" className="pt-28 sm:pt-36 lg:pt-40">
        <Container className="pb-16 sm:pb-20">
          <SectionLabel as="p" className="mb-8">
            Start a project
          </SectionLabel>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h1 className="text-display">
                <span className="block">Tell us</span>
                <span className="block">where the</span>
                <span className="block">attention is.</span>
              </h1>
              <p className="mt-8 max-w-[40ch] text-lead text-bone/75">
                We will map where it leaks, propose the system to fix it, and give you a real timeline after a discovery
                call.
              </p>

              <div className="mt-12 border-t border-bone/15 pt-8">
                <p className="micro-mono text-mute">What happens after you submit</p>
                <ol className="mt-5 space-y-3">
                  {processSteps.slice(0, 3).map((step) => (
                    <li key={step.number} className="flex items-baseline gap-4 text-sm">
                      <span className="font-mono text-xs text-mute">{step.number}</span>
                      <span>
                        <span className="font-bold uppercase tracking-[0.04em]">{step.title}</span>
                        <span className="text-mute"> — {step.description}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-10 border-t border-bone/15 pt-8">
                <p className="micro-mono text-mute">Prefer email?</p>
                <a href={`mailto:${siteConfig.contactEmail}`} className="nav-link mt-3 inline-block font-semibold">
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border border-bone/30 bg-surface p-6 sm:p-10">
                <LeadForm defaultService={defaultService} />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
