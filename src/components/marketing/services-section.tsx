import Link from "next/link";
import { services } from "@/content/services";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { Reveal } from "@/components/marketing/reveal";

export function ServicesSection() {
  return (
    <Section tone="bone" aria-labelledby="services-heading">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel as="p" index="02" className="mb-8">
              What we build
            </SectionLabel>
            <SectionHeading id="services-heading">Four layers. One front door.</SectionHeading>
          </div>
          <Button asChild variant="outline" withArrow>
            <Link href="/services">All services</Link>
          </Button>
        </div>

        <Reveal className="mt-14 grid gap-px border border-bone/15 bg-bone/15 md:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </Reveal>
      </Container>
    </Section>
  );
}
