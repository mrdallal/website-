/**
 * Server-side environment access.
 * Never import this module from a Client Component.
 */
import "server-only";

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const env = {
  get siteUrl() {
    return optional("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";
  },
  get databaseUrl() {
    return optional("DATABASE_URL");
  },
  get authSecret() {
    return optional("AUTH_SECRET");
  },
  email: {
    get apiKey() {
      return optional("RESEND_API_KEY");
    },
    get from() {
      return optional("EMAIL_FROM") ?? "TECHSIDES <onboarding@resend.dev>";
    },
    get notifyTo() {
      return optional("NOTIFY_EMAIL");
    },
    get configured() {
      return Boolean(optional("RESEND_API_KEY"));
    },
  },
  ghl: {
    get apiKey() {
      return optional("GHL_API_KEY");
    },
    get locationId() {
      return optional("GHL_LOCATION_ID");
    },
    get webhookUrl() {
      return optional("GHL_WEBHOOK_URL");
    },
    get webhookSecret() {
      return optional("GHL_WEBHOOK_SECRET");
    },
    get apiConfigured() {
      return Boolean(optional("GHL_API_KEY") && optional("GHL_LOCATION_ID"));
    },
    get webhookConfigured() {
      return Boolean(optional("GHL_WEBHOOK_URL"));
    },
  },
  seed: {
    get adminName() {
      return optional("ADMIN_NAME") ?? "TECHSIDES Admin";
    },
    get adminEmail() {
      return optional("ADMIN_EMAIL");
    },
    get adminPassword() {
      return optional("ADMIN_PASSWORD");
    },
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
};
