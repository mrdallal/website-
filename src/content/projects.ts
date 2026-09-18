import type { CaseStudy } from "@/types/content";

/**
 * Selected work.
 *
 * PLACEHOLDER CONTENT: TECHSIDES has not published real case studies yet.
 * Every entry below is marked `placeholder: true` and is rendered with a
 * visible "Placeholder" label. Replace entries with real projects, set
 * `placeholder: false`, and drop real imagery into /public/images/work.
 *
 * Do not add invented performance statistics here. `results` should describe
 * what was delivered until real, measured outcomes exist.
 */
export const caseStudies: CaseStudy[] = [
  {
    title: "Service business: website and lead system",
    slug: "placeholder-service-business",
    description:
      "An example of a full front-door rebuild: positioning, editorial website, qualified lead form and CRM hand-off.",
    category: "Website + Lead capture",
    services: ["websites", "lead-capture"],
    image: "/images/work/placeholder-01.svg",
    imageAlt: "Placeholder composition for a website and lead system project",
    client: "Placeholder client",
    results: [
      "Replace with a measured outcome once available",
      "Replace with a measured outcome once available",
    ],
    date: "2026-01-01",
    featured: true,
    size: "large",
    placeholder: true,
    challenge:
      "Placeholder: describe the situation the client started in, what was leaking, and what they needed to happen.",
    approach:
      "Placeholder: describe what was designed and built, how the pieces connect, and what changed for the team.",
  },
  {
    title: "Automated follow-up for inbound enquiries",
    slug: "placeholder-automation",
    description:
      "An example automation engagement: confirmations, reminders, nurture sequences and internal task creation.",
    category: "Automation",
    services: ["automation"],
    image: "/images/work/placeholder-02.svg",
    imageAlt: "Placeholder composition for an automation project",
    client: "Placeholder client",
    results: ["Replace with a measured outcome once available"],
    date: "2026-01-01",
    featured: true,
    size: "medium",
    placeholder: true,
  },
  {
    title: "Campaign landing pages and analytics",
    slug: "placeholder-growth",
    description:
      "An example growth engagement: campaign pages, event tracking and an operating dashboard for the team.",
    category: "Growth systems",
    services: ["growth-systems", "websites"],
    image: "/images/work/placeholder-03.svg",
    imageAlt: "Placeholder composition for a growth systems project",
    client: "Placeholder client",
    results: ["Replace with a measured outcome once available"],
    date: "2026-01-01",
    featured: true,
    size: "medium",
    placeholder: true,
  },
  {
    title: "AI-assisted lead triage",
    slug: "placeholder-ai-triage",
    description:
      "An example AI engagement: summarising enquiries, scoring fit and routing to the right person automatically.",
    category: "Automation + AI",
    services: ["automation"],
    image: "/images/work/placeholder-04.svg",
    imageAlt: "Placeholder composition for an AI triage project",
    client: "Placeholder client",
    results: ["Replace with a measured outcome once available"],
    date: "2026-01-01",
    featured: false,
    size: "small",
    placeholder: true,
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => c.featured);
}
