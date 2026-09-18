"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { systemSection, systemStages } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionLabel } from "@/components/ui/section-label";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, luxuryEase } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

/**
 * Signature section: the five-stage system as an accessible tablist.
 * Information is revealed progressively: pick a stage to see what it does and
 * which components power it. Keyboard arrows move between stages.
 */
export function SystemSection() {
  const [active, setActive] = React.useState(systemStages[0]!.id);
  const activeIndex = systemStages.findIndex((s) => s.id === active);
  const stage = systemStages[activeIndex] ?? systemStages[0]!;

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
          <Reveal delay={150} className="max-w-[52ch] self-end text-lead text-bone/70 lg:col-span-6 lg:col-start-7">
            <p>{systemSection.body}</p>
          </Reveal>
        </div>

        <TabsPrimitive.Root value={active} onValueChange={setActive} className="mt-16">
          {/* Stage selector */}
          <TabsPrimitive.List aria-label="Stages of the system" className="grid grid-cols-1 border-t border-bone/15 sm:grid-cols-5">
            {systemStages.map((s, i) => (
              <TabsPrimitive.Trigger
                key={s.id}
                value={s.id}
                className={cn(
                  "group relative flex flex-row items-center justify-between gap-4 border-b border-bone/15 px-1 py-5 text-left transition-colors sm:flex-col sm:items-start sm:justify-start sm:border-b-0 sm:border-r sm:py-8 sm:pr-6 sm:last:border-r-0",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] data-[state=active]:text-bone",
                  "text-bone/45 hover:text-bone/80",
                )}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-0 hidden h-0.5 origin-left bg-lime sm:block"
                  initial={false}
                  animate={{ scaleX: i <= activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: luxuryEase, delay: i * 0.04 }}
                  style={{ width: "100%" }}
                />
                <span className="flex items-baseline gap-3 sm:flex-col sm:gap-4">
                  <span className="micro-mono">0{i + 1}</span>
                  <span className="text-h4 font-semibold uppercase tracking-[-0.02em] sm:text-[clamp(1.35rem,2vw,1.85rem)]">{s.label}</span>
                </span>
                <span aria-hidden="true" className="size-2 shrink-0 bg-bone/30 transition-colors group-data-[state=active]:bg-lime sm:mt-6" />
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          {/* Stage detail: one panel, content crossfades between stages */}
          {systemStages.map((s) => (
            <TabsPrimitive.Content key={s.id} value={s.id} className="focus-visible:outline-none" forceMount hidden={s.id !== active}>
              <span className="sr-only">{s.title}</span>
            </TabsPrimitive.Content>
          ))}
          <div className="relative mt-10 min-h-64" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage.id}
                className="grid gap-10 lg:grid-cols-12"
                initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: luxuryEase }}
              >
                <div className="lg:col-span-6">
                  <p className="micro-mono text-lime">
                    Stage 0{activeIndex + 1} / 0{systemStages.length}
                  </p>
                  <h3 className="mt-4 text-h3 font-semibold">{stage.title}</h3>
                  <p className="mt-5 max-w-[48ch] text-body text-bone/70">{stage.description}</p>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <p className="micro-mono text-bone/50">Powered by</p>
                  <ul className="mt-4 grid grid-cols-2 gap-px border border-bone/15 bg-bone/15">
                    {stage.components.map((component, i) => (
                      <motion.li
                        key={component}
                        className="bg-ink px-4 py-4 text-sm font-semibold"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: luxuryEase, delay: 0.1 + i * 0.06 }}
                      >
                        {component}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </TabsPrimitive.Root>

        {/* Connector strip */}
        <Reveal className="mt-20 border-t border-bone/15 pt-8">
          <p className="micro-mono mb-5 text-bone/50">Connected into one system</p>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-3">
            {systemSection.connectors.map((item, i) => (
              <React.Fragment key={item}>
                <li className="border border-bone/25 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.06em] transition-colors hover:border-lime hover:text-lime">{item}</li>
                {i < systemSection.connectors.length - 1 ? (
                  <li aria-hidden="true" className="text-lime">
                    <Plus className="size-4" />
                  </li>
                ) : null}
              </React.Fragment>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
