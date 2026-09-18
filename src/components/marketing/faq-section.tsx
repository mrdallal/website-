import { faqs } from "@/content/faqs";
import { faqSection } from "@/content/home";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";

export function FaqSection() {
  return (
    <Section tone="bone" aria-labelledby="faq-heading">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionLabel as="p" index="07" className="mb-8">
                {faqSection.label}
              </SectionLabel>
              <SectionHeading id="faq-heading">{faqSection.headline}</SectionHeading>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible defaultValue="faq-0">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </Section>
  );
}
