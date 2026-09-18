import Script from "next/script";
import { analyticsConfig } from "@/lib/analytics/config";

/**
 * Loads the configured third-party analytics provider (if any).
 * Set NEXT_PUBLIC_ANALYTICS_PROVIDER to ga4 | plausible | posthog to enable.
 * Renders nothing when no provider is configured.
 */
export function AnalyticsScripts() {
  if (!analyticsConfig.configured) return null;

  switch (analyticsConfig.provider) {
    case "ga4":
      return (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsConfig.ga4MeasurementId)}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${analyticsConfig.ga4MeasurementId.replace(/'/g, "")}', { anonymize_ip: true });`}
          </Script>
        </>
      );
    case "plausible":
      return (
        <Script
          defer
          data-domain={analyticsConfig.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      );
    case "posthog":
      return (
        <Script id="posthog-init" strategy="afterInteractive">
          {`!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group identify setPersonProperties".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('${analyticsConfig.posthogKey.replace(/'/g, "")}', { api_host: '${analyticsConfig.posthogHost.replace(/'/g, "")}', person_profiles: 'identified_only' });`}
        </Script>
      );
    default:
      return null;
  }
}
