import type { Metadata } from "next";
import { caseStudies } from "@/content/projects";
import { PageHero } from "@/components/marketing/page-hero";
import { WorkGrid } from "@/components/marketing/work-grid";
import { FinalCta } from "@/components/marketing/final-cta";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected systems built by TECHSIDES: websites, lead capture, automation and growth infrastructure.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  const hasPlaceholders = caseStudies.some((c) => c.placeholder);

  return (
    <>
      <PageHero
        label="Selected work"
        headline={["Systems,", "not just", "websites."]}
        intro={
          hasPlaceholders
            ? "Real case studies are being prepared. The projects shown are clearly marked placeholders that illustrate the kind of systems we build."
            : "A selection of the systems we have designed and built."
        }
      />
      <WorkGrid projects={caseStudies} withHeader={false} tone="white" />
      <FinalCta />
    </>
  );
}
