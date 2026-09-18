import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/content/services";
import { primaryCta } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { PageHero } from "@/components/marketing/page-hero";
import { ServiceVisual } from "@/components/marketing/service-visual";
import { SystemSection } from "@/components/marketing/system-section";
import { FinalCta } from "@/components/marketing/final-cta";
import { Reveal } from "@/components/marketing/reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Websites, lead capture, automation and growth systems. TECHSIDES builds each layer and connects them into one system that turns attention into customers.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Services"
        headline={["Four layers.", "One connected", "system."]}
        intro="Hire us for a single layer or for the whole system. Either way, every piece is built to hand off to the next."
        aside={
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {services.map((s) => (
              <li key={s.id}>
                <a href={`#${s.slug}`} className="nav-link label-mono text-bone/70 hover:text-lime">
                  {s.number} {s.title}
                </a>
              </li>
            ))}
          </ul>
        }
      />

      {services.map((service, i) => (
        <Section
          key={service.id}
          id={service.slug}
          tone={i % 2 === 0 ? "white" : "bone"}
          bordered
          className="scroll-mt-24"
          aria-labelledby={`service-${service.slug}`}
        >
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <div className="flex items-start justify-between gap-6 lg:block">
                  <span className="font-mono text-[clamp(3.5rem,8vw,7rem)] font-medium leading-none tracking-[-0.05em] text-bone/20">
                    {service.number}
                  </span>
                  <div className="size-20 text-bone lg:mt-8 lg:size-28">
                    <ServiceVisual visual={service.visual} />
                  </div>
                </div>
                <h2 id={`service-${service.slug}`} className="mt-8 text-h2 uppercase">
                  {service.title}
                </h2>
                <p className="mt-6 max-w-[44ch] text-lead text-bone/75">{service.longDescription}</p>
                <Button asChild withArrow className="mt-8">
                  <Link href={`/contact?service=${service.id}`}>{primaryCta.label}</Link>
                </Button>
              </div>

              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
                <Reveal>
                  <SectionLabel as="p" className="mb-6">
                    What you get
                  </SectionLabel>
                  <ul className="border-t border-bone/15">
                    {service.deliverables.map((item) => (
                      <li key={item} className="border-b border-bone/15 py-3.5 text-body">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={100}>
                  <SectionLabel as="p" className="mb-6">
                    What changes
                  </SectionLabel>
                  <ul className="border-t border-bone/15">
                    {service.outcomes.map((item) => (
                      <li key={item} className="flex gap-3 border-b border-bone/15 py-3.5 text-body">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-lime" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </Container>
        </Section>
      ))}

      <SystemSection />
      <FinalCta />
    </>
  );
}
