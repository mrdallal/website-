/**
 * Content types for the marketing site.
 * All marketing copy lives in `src/content/*` and is typed here so it can be
 * edited (or later moved to a CMS) without touching components.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface CallToAction {
  label: string;
  href: string;
}

export type ServiceVisual = "website" | "capture" | "automation" | "growth";

export interface Service {
  id: string;
  number: string;
  slug: string;
  title: string;
  /** Short label used in bands, badges and the lead form */
  shortTitle: string;
  description: string;
  longDescription: string;
  deliverables: string[];
  outcomes: string[];
  visual: ServiceVisual;
}

export type CaseStudySize = "large" | "medium" | "small";

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface CaseStudy {
  title: string;
  slug: string;
  description: string;
  category: string;
  services: string[];
  image: string;
  imageAlt: string;
  client: string;
  results: string[];
  testimonial?: Testimonial;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  featured: boolean;
  /** Layout hint for the work grid */
  size: CaseStudySize;
  /** True while this entry is illustrative and awaiting a real project */
  placeholder: boolean;
  /** Longer narrative for the case-study page */
  challenge?: string;
  approach?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  details: string[];
}

export interface SystemStage {
  id: string;
  label: string;
  title: string;
  description: string;
  components: string[];
}

export interface Capability {
  label: string;
}
