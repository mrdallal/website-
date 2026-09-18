"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-t hairline last:border-b", className)} {...props} />;
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="m-0">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex w-full items-center justify-between gap-6 py-6 text-left text-h4 font-bold transition-colors hover:text-current/80 focus-visible:outline-2 focus-visible:outline-offset-4 sm:py-7",
          className,
        )}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className="inline-flex size-9 shrink-0 items-center justify-center border border-current/30 transition-[transform,background-color,color] duration-300 ease-[var(--ease-out-expo)] group-data-[state=open]:rotate-45 group-data-[state=open]:bg-lime group-data-[state=open]:text-ink"
        >
          <Plus className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[accordion-up_0.25s_ease-out] data-[state=open]:animate-[accordion-down_0.3s_ease-out]"
      {...props}
    >
      <div className={cn("max-w-[64ch] pb-7 text-body text-current/75", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
