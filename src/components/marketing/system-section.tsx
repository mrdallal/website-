"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { Plus } from "lucide-react";
import { systemSection, systemStages } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

/**
 * Signature section: the five-stage system as an accessible tablist.
 * Information is revealed progressively: pick a stage to see what it does and
 * which components power it. Keyboard arrows move between stages.
 */
export function SystemSection() {
  const [active, setActive] = React.useState(systemStages[0]!.id);
  const activeIndex = systemStages.findIndex((s) => s.id === active);

  return (
    <Section tone="ink" aria-labelledby="system-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel as="p" index="03" className="mb-8">
              {systemSection.label}
            </SectionLabel>
            <SectionHeading id="system-heading">{systemSection.headline}</SectionHeading>
          </div>
          <p className="max-w-[52ch] self-end text-lead text-bone/70 lg:col-span-6 lg:col-start-7">{systemSection.body}</p>
        </div>

        <TabsPrimitive.Root value={active} onValueChange={setActive} className="mt-16">
          {/* Stage selector */}
          <TabsPrimitive.List
            aria-label="Stages of the system"
            className="grid grid-cols-1 border-t border-bone/15 sm:grid-cols-5"
          >
            {systemStages.map((stage, i) => (
              <TabsPrimitive.Trigger
                key={stage.id}
                value={stage.id}
                className={cn(
                  "group relative flex flex-row items-center justify-between gap-4 border-b border-bone/15 px-1 py-5 text-left transition-colors sm:flex-col sm:items-start sm:justify-start sm:border-b-0 sm:border-r sm:py-8 sm:pr-6 sm:last:border-r-0",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] data-[state=active]:text-bone",
                  "text-bone/50 hover:text-bone/80",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-0 hidden h-0.5 bg-lime transition-[width] duration-500 ease-[var(--ease-out-expo)] sm:block",
                    i <= activeIndex ? "w-full" : "w-0",
                  )}
                />
                <span className="flex items-baseline gap-3 sm:flex-col sm:gap-4">
                  <span className="micro-mono">0{i + 1}</span>
                  <span className="text-h4 font-semibold uppercase tracking-[-0.02em] sm:text-[clamp(1.35rem,2vw,1.85rem)]">
                    {stage.label}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="size-2 shrink-0 bg-bone/30 transition-colors group-data-[state=active]:bg-lime sm:mt-6"
                />
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          {/* Stage detail */}
          {systemStages.map((stage, i) => (
            <TabsPrimitive.Content
              key={stage.id}
              value={stage.id}
              className="mt-10 grid gap-10 focus-visible:outline-none lg:grid-cols-12 data-[state=active]:animate-[fade-in_0.4s_ease-out]"
            >
              <div className="lg:col-span-6">
                <p className="micro-mono text-lime">
                  Stage 0{i + 1} / 0{systemStages.length}
                </p>
                <h3 className="mt-4 text-h3 font-semibold">{stage.title}</h3>
                <p className="mt-5 max-w-[48ch] text-body text-bone/70">{stage.description}</p>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                <p className="micro-mono text-bone/50">Powered by</p>
                <ul className="mt-4 grid grid-cols-2 gap-px border border-bone/15 bg-bone/15">
                  {stage.components.map((component) => (
                    <li key={component} className="bg-ink px-4 py-4 text-sm font-semibold">
                      {component}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsPrimitive.Content>
          ))}
        </TabsPrimitive.Root>

        {/* Connector strip */}
        <div className="mt-20 border-t border-bone/15 pt-8">
          <p className="micro-mono mb-5 text-bone/50">Connected into one system</p>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-3">
            {systemSection.connectors.map((item, i) => (
              <React.Fragment key={item}>
                <li className="border border-bone/25 px-4 py-2.5 text-sm font-bold uppercase tracking-[0.06em]">{item}</li>
                {i < systemSection.connectors.length - 1 ? (
                  <li aria-hidden="true" className="text-lime">
                    <Plus className="size-4" />
                  </li>
                ) : null}
              </React.Fragment>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
