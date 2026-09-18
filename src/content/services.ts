import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    id: "websites",
    number: "01",
    slug: "websites",
    title: "Websites",
    shortTitle: "Website",
    description:
      "Editorial, fast, conversion-led websites built as the front door of your business, not a brochure.",
    longDescription:
      "We design and build websites that are engineered to do a job: explain what you do in seconds, earn trust, and move the right visitors toward a conversation. Every page has a purpose, every section has a next step, and the whole thing loads fast on a phone.",
    deliverables: [
      "Positioning and page architecture",
      "Editorial design system",
      "Next.js build with server rendering",
      "Performance, accessibility and SEO baseline",
      "Analytics and conversion tracking",
    ],
    outcomes: [
      "Visitors understand what you do immediately",
      "Clear paths from every page to a conversation",
      "A site your team can update without a developer",
    ],
    visual: "website",
  },
  {
    id: "lead-capture",
    number: "02",
    slug: "lead-capture",
    title: "Lead capture",
    shortTitle: "Lead capture",
    description:
      "Forms, booking flows, qualification and routing that turn interest into a structured, trackable lead.",
    longDescription:
      "Attention is wasted if there is nowhere good for it to go. We build the capture layer: high-intent forms, booking flows, qualification questions and routing rules, all feeding a single place where every lead is visible and nothing gets lost.",
    deliverables: [
      "Lead forms and multi-step qualification",
      "Calendar and booking integration",
      "Lead routing and notifications",
      "CRM sync (GoHighLevel and others)",
      "Spam protection and validation",
    ],
    outcomes: [
      "Every enquiry lands in one system with a unique ID",
      "Your team is notified the moment a lead arrives",
      "You know where each lead came from",
    ],
    visual: "capture",
  },
  {
    id: "automation",
    number: "03",
    slug: "automation",
    title: "Automation",
    shortTitle: "Automation",
    description:
      "Follow-up sequences, internal workflows and AI-assisted operations so leads are handled while you work.",
    longDescription:
      "The gap between a lead arriving and someone replying is where deals die. We automate the follow-up: confirmations, reminders, nurture sequences, task creation and hand-offs, with AI used where it removes real work rather than for show.",
    deliverables: [
      "Follow-up email and SMS sequences",
      "Internal notifications and task creation",
      "CRM pipeline automation",
      "AI-assisted replies, summaries and triage",
      "Webhook and API integrations",
    ],
    outcomes: [
      "Faster first response, without hiring",
      "Consistent follow-up on every lead",
      "Less manual admin for your team",
    ],
    visual: "automation",
  },
  {
    id: "growth-systems",
    number: "04",
    slug: "growth-systems",
    title: "Growth systems",
    shortTitle: "Growth",
    description:
      "Analytics, dashboards, experiments and ongoing optimisation that connect all the pieces into one system.",
    longDescription:
      "Once the pieces exist, the work becomes connecting and improving them. We wire up analytics, build the dashboards that show what is actually happening, and run a cadence of improvements against real numbers.",
    deliverables: [
      "Analytics and event tracking setup",
      "Operating dashboards",
      "Conversion rate optimisation",
      "Landing pages for campaigns",
      "Monthly optimisation cadence",
    ],
    outcomes: [
      "One view of traffic, leads and conversions",
      "Decisions based on data, not guesses",
      "A system that compounds instead of decays",
    ],
    visual: "growth",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
