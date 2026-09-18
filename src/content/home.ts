import type { Capability, SystemStage } from "@/types/content";

/**
 * Homepage copy. Edit freely; components only read from here.
 */
export const hero = {
  eyebrow: "Digital agency for attention-rich businesses",
  // Rendered on separate lines on desktop.
  headline: ["Build digital", "systems that", "turn attention", "into business."],
  subheading:
    "TECHSIDES designs and builds the website, lead capture, follow-up and analytics layers of your business, then connects them into one system that converts.",
  note: "Websites · Lead systems · Automation · AI · Growth",
};

export const capabilities: Capability[] = [
  { label: "Websites" },
  { label: "Lead systems" },
  { label: "Automation" },
  { label: "AI" },
  { label: "Growth" },
  { label: "CRM" },
  { label: "Analytics" },
];

export const problem = {
  label: "The problem",
  headline: "Most businesses have attention. Their infrastructure leaks it.",
  body:
    "Ads run. Referrals arrive. People visit. Then the website says nothing specific, the form goes to an inbox nobody checks, follow-up happens days later, and there is no way to see any of it. The opportunity was real. The system lost it.",
  flow: [
    { label: "Traffic", tone: "neutral" },
    { label: "?", tone: "warn" },
    { label: "Lost lead", tone: "bad" },
  ],
  leaks: [
    { title: "Vague website", text: "Visitors cannot tell what you do or why it matters." },
    { title: "Dead-end forms", text: "Enquiries land in an inbox and go cold." },
    { title: "Slow follow-up", text: "Nobody replies fast enough to matter." },
    { title: "No visibility", text: "You cannot see what is working or what leaked." },
  ],
  resolution: {
    label: "Introducing TECHSIDES",
    headline: "We replace the question mark with a system.",
    body:
      "One connected flow from first click to closed deal: a website that explains, capture that qualifies, automation that follows up, and a dashboard that shows it all.",
  },
};

export const systemStages: SystemStage[] = [
  {
    id: "attract",
    label: "Attract",
    title: "Attention arrives with a purpose",
    description:
      "Campaigns, referrals, search and content land on pages designed to explain fast and move people forward.",
    components: ["Website", "Landing pages", "SEO", "Content"],
  },
  {
    id: "capture",
    label: "Capture",
    title: "Interest becomes a record",
    description:
      "Forms, booking flows and qualification turn a visitor into a structured lead with an ID, a source and a next step.",
    components: ["Forms", "Booking", "Qualification", "CRM"],
  },
  {
    id: "follow-up",
    label: "Follow up",
    title: "Every lead gets a response",
    description:
      "Instant confirmations, internal alerts and nurture sequences run automatically, with AI handling triage and summaries.",
    components: ["Automation", "Email", "SMS", "AI"],
  },
  {
    id: "convert",
    label: "Convert",
    title: "Conversations become customers",
    description:
      "Your team sees qualified leads with context, moves them through a pipeline, and nothing falls through the gaps.",
    components: ["Pipeline", "Proposals", "Tasks", "Team"],
  },
  {
    id: "optimise",
    label: "Optimise",
    title: "The system gets better every month",
    description:
      "Analytics and dashboards show what is working. Experiments and new automations compound the results.",
    components: ["Analytics", "Dashboards", "Experiments", "Reporting"],
  },
];

export const systemSection = {
  label: "The system",
  headline: "One system. Not five disconnected tools.",
  body:
    "Most agencies hand you a website. We connect the website to capture, capture to follow-up, follow-up to your pipeline, and everything to a dashboard you actually look at.",
  connectors: ["Website", "Forms", "CRM", "Automation", "Email", "AI", "Analytics"],
};

export const workSection = {
  label: "Selected work",
  headline: "Systems we have built.",
  body:
    "Case studies are being prepared. The projects below are illustrative placeholders and will be replaced with real work as it is published.",
  cta: { label: "View all work", href: "/work" },
};

export const processSection = {
  label: "Process",
  headline: "From discovery to a system that compounds.",
  body: "Five stages. Continuous visibility. No big reveal, no surprises.",
};

export const aboutSection = {
  label: "About",
  headline: "Technology, design and systems in service of business outcomes.",
  body: [
    "TECHSIDES is a digital agency built around one idea: a website is not the product, the system is. We combine creative direction, engineering and automation to build infrastructure that turns attention into opportunities.",
    "We care about composition, typography and speed because they earn trust. We care about data models, integrations and follow-up because they earn revenue.",
  ],
  principles: ["Design that explains", "Engineering that lasts", "Automation that removes work", "Numbers over opinions"],
  cta: { label: "More about us", href: "/about" },
};

export const faqSection = {
  label: "FAQ",
  headline: "Questions, answered.",
};

export const finalCta = {
  label: "Next step",
  headline: ["Ready to build", "the system?"],
  body: "Tell us where the attention is coming from. We will show you where it is leaking and what to build.",
  primary: { label: "Start a project", href: "/contact" },
  secondary: { label: "See how we work", href: "/about" },
};
