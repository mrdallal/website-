import type { ProcessStep } from "@/types/content";

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Discover",
    description: "We map where attention comes from, where it goes, and where it leaks.",
    details: ["Discovery call", "Current system audit", "Goals and constraints", "Scope and timeline"],
  },
  {
    number: "02",
    title: "Design",
    description: "Positioning, structure and an editorial design system built for conversion.",
    details: ["Messaging and page architecture", "Design system", "Key page designs", "Capture and follow-up flows"],
  },
  {
    number: "03",
    title: "Build",
    description: "A fast, accessible build with the capture, CRM and automation layers wired in.",
    details: ["Next.js build", "Forms, routing, CRM sync", "Automation sequences", "Tracking and analytics"],
  },
  {
    number: "04",
    title: "Launch",
    description: "QA, performance, SEO and a clean hand-over to your team.",
    details: ["Cross-device QA", "Performance and SEO checks", "Team walkthrough", "Go live"],
  },
  {
    number: "05",
    title: "Optimise",
    description: "Review the numbers, fix leaks, extend the system as the business evolves.",
    details: ["Monthly review", "Conversion experiments", "New automations", "Ongoing support"],
  },
];
