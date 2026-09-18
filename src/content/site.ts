import type { CallToAction, NavItem } from "@/types/content";

/**
 * Global site settings and navigation.
 * Values marked PLACEHOLDER should be replaced before launch.
 */
export const siteConfig = {
  name: "TECHSIDES",
  legalName: "TECHSIDES",
  tagline: "Digital systems that turn attention into business.",
  description:
    "TECHSIDES designs and builds websites, lead capture, automation and AI systems that turn attention into customers, then connects them into one business system.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  // PLACEHOLDER: replace with the real inbox before launch.
  contactEmail: "hello@techsides.example",
  // Leave empty until real profiles exist. Empty entries are not rendered.
  social: [] as { label: string; href: string }[],
  bookingHref: "/contact",
} as const;

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export const primaryCta: CallToAction = { label: "Book a call", href: "/contact" };
export const secondaryCta: CallToAction = { label: "View our work", href: "/work" };

export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Studio",
    items: [
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "What we build",
    items: [
      { label: "Websites", href: "/services#websites" },
      { label: "Lead capture", href: "/services#lead-capture" },
      { label: "Automation", href: "/services#automation" },
      { label: "Growth systems", href: "/services#growth-systems" },
    ],
  },
];

export const dashboardNav: { label: string; href: string; icon: string }[] = [
  { label: "Overview", href: "/dashboard", icon: "layout" },
  { label: "Leads", href: "/dashboard/leads", icon: "inbox" },
  { label: "Clients", href: "/dashboard/clients", icon: "users" },
  { label: "Projects", href: "/dashboard/projects", icon: "folder" },
  { label: "Tasks", href: "/dashboard/tasks", icon: "check-square" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "bar-chart" },
  { label: "Content", href: "/dashboard/content", icon: "file-text" },
  { label: "Automations", href: "/dashboard/automations", icon: "zap" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];
