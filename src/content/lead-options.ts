/**
 * Options shared by the public lead form, server-side validation and the dashboard.
 * Keep the `value`s stable: they are stored on Lead records.
 */

export const serviceOptions = [
  { value: "website", label: "Website" },
  { value: "lead-capture", label: "Lead capture" },
  { value: "automation", label: "Automation" },
  { value: "growth-systems", label: "Growth systems" },
  { value: "full-system", label: "The full system" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const budgetOptions = [
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-10k", label: "$5k – $10k" },
  { value: "10k-25k", label: "$10k – $25k" },
  { value: "25k-50k", label: "$25k – $50k" },
  { value: "50k-plus", label: "$50k+" },
  { value: "undecided", label: "Not decided yet" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within a month" },
  { value: "1-3-months", label: "1 – 3 months" },
  { value: "3-plus-months", label: "3+ months" },
  { value: "flexible", label: "Flexible" },
] as const;

export const leadSources = ["website", "referral", "manual", "ghl", "other"] as const;

export type ServiceValue = (typeof serviceOptions)[number]["value"];
export type BudgetValue = (typeof budgetOptions)[number]["value"];
export type TimelineValue = (typeof timelineOptions)[number]["value"];
export type LeadSource = (typeof leadSources)[number];

export const serviceValues = serviceOptions.map((o) => o.value) as [ServiceValue, ...ServiceValue[]];
export const budgetValues = budgetOptions.map((o) => o.value) as [BudgetValue, ...BudgetValue[]];
export const timelineValues = timelineOptions.map((o) => o.value) as [TimelineValue, ...TimelineValue[]];

function labelFor<T extends { value: string; label: string }>(options: readonly T[], value: string | null | undefined) {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? value;
}

export const serviceLabel = (value: string | null | undefined) => labelFor(serviceOptions, value);
export const budgetLabel = (value: string | null | undefined) => labelFor(budgetOptions, value);
export const timelineLabel = (value: string | null | undefined) => labelFor(timelineOptions, value);
