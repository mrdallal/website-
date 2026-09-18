/**
 * Analytics provider configuration. Safe to import from Client Components:
 * it only reads NEXT_PUBLIC_* variables (which are public by definition).
 *
 * To connect a provider, set NEXT_PUBLIC_ANALYTICS_PROVIDER and the matching id.
 */
export type AnalyticsProvider = "none" | "ga4" | "plausible" | "posthog";

const providerRaw = (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? "none").toLowerCase();
const provider: AnalyticsProvider = (["ga4", "plausible", "posthog"] as const).includes(
  providerRaw as Exclude<AnalyticsProvider, "none">,
)
  ? (providerRaw as AnalyticsProvider)
  : "none";

export const analyticsConfig = {
  provider,
  ga4MeasurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? "",
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
  get configured(): boolean {
    switch (provider) {
      case "ga4":
        return Boolean(this.ga4MeasurementId);
      case "plausible":
        return Boolean(this.plausibleDomain);
      case "posthog":
        return Boolean(this.posthogKey);
      default:
        return false;
    }
  },
  get providerLabel(): string {
    switch (provider) {
      case "ga4":
        return "Google Analytics 4";
      case "plausible":
        return "Plausible";
      case "posthog":
        return "PostHog";
      default:
        return "Not connected";
    }
  },
};

/** Conversion event names used across the site and dashboard. */
export const analyticsEvents = {
  leadSubmitted: "lead_submitted",
  leadStatusChanged: "lead_status_changed",
  ctaClicked: "cta_clicked",
} as const;

export type AnalyticsEventName = (typeof analyticsEvents)[keyof typeof analyticsEvents];
