import { capabilities } from "@/content/home";
import { Marquee } from "@/components/marketing/marquee";

/**
 * Trust / signal band. TECHSIDES has no published client logos yet, so this
 * is a capability signal rather than a logo wall. Swap for logos when real.
 */
export function CapabilityBand() {
  return (
    <section aria-label="Capabilities" className="border-y border-bone/10 bg-ink py-6 text-bone sm:py-8">
      <div className="mb-4 px-gutter">
        <p className="micro-mono text-bone/50">Built for</p>
      </div>
      <Marquee
        items={capabilities.map((c) => c.label)}
        itemClassName="text-[clamp(1.75rem,4.5vw,3.5rem)] font-semibold uppercase leading-none tracking-[-0.03em]"
        duration={38}
      />
    </section>
  );
}
