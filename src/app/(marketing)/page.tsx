import type { Metadata } from "next";
import { siteConfig } from "@/content/site";
import { getFeaturedCaseStudies } from "@/content/projects";
import { Hero } from "@/components/marketing/hero";
import { CapabilityBand } from "@/components/marketing/capability-band";
import { ProblemSection } from "@/components/marketing/problem-section";
import { ServicesSection } from "@/components/marketing/services-section";
import { SystemSection } from "@/components/marketing/system-section";
import { WorkGrid } from "@/components/marketing/work-grid";
import { ProcessSection } from "@/components/marketing/process-section";
import { AboutSection } from "@/components/marketing/about-section";
import { FaqSection } from "@/components/marketing/faq-section";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const featured = getFeaturedCaseStudies();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <CapabilityBand />
      <ProblemSection />
      <ServicesSection />
      <SystemSection />
      <WorkGrid projects={featured} />
      <ProcessSection />
      <AboutSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
