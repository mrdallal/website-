"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ArrowRight, X } from "lucide-react";
import { mainNav, primaryCta, siteConfig } from "@/content/site";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/marketing/wordmark";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled ? "border-b border-bone/10 bg-canvas/90 backdrop-blur-md" : "border-b border-transparent bg-transparent",
      )}
    >
      <Container as="nav" aria-label="Primary" className="flex h-16 items-center justify-between gap-6 sm:h-20">
        <Wordmark />

        <div className="hidden items-center gap-10 md:flex">
          <ul className="flex items-center gap-8">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="nav-link label-mono py-2 text-bone/80 transition-colors hover:text-lime"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild size="md" withArrow>
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
        </div>

        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
          <DialogPrimitive.Trigger asChild>
            <button
              type="button"
              className="label-mono inline-flex h-10 items-center gap-2 border border-bone/30 px-3 md:hidden"
              aria-label="Open menu"
            >
              Menu
              <span aria-hidden="true" className="flex flex-col gap-1">
                <span className="block h-px w-4 bg-ink" />
                <span className="block h-px w-4 bg-ink" />
              </span>
            </button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Content
              className="fixed inset-0 z-50 flex flex-col bg-ink text-bone focus:outline-none data-[state=open]:animate-[fade-in_0.25s_ease-out]"
              aria-describedby={undefined}
            >
              <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
              <Container className="flex h-16 items-center justify-between">
                <Wordmark className="text-bone" />
                <DialogPrimitive.Close
                  className="label-mono inline-flex h-10 items-center gap-2 border border-bone/40 px-3"
                  aria-label="Close menu"
                >
                  Close <X className="size-4" />
                </DialogPrimitive.Close>
              </Container>
              <Container className="flex flex-1 flex-col justify-between py-10">
                <ul className="flex flex-col gap-2">
                  {[{ label: "Home", href: "/" }, ...mainNav, { label: "Contact", href: "/contact" }].map((item, i) => (
                    <li key={item.href} className="border-b border-bone/10">
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between py-4 text-[2.25rem] font-semibold leading-none tracking-[-0.03em] sm:text-5xl"
                      >
                        <span className="flex items-baseline gap-4">
                          <span className="micro-mono text-bone/40">0{i + 1}</span>
                          {item.label}
                        </span>
                        <ArrowRight className="size-6 text-lime opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-6 pt-10">
                  <Button asChild variant="lime" size="lg" withArrow className="w-full">
                    <Link href={primaryCta.href} onClick={() => setOpen(false)}>
                      {primaryCta.label}
                    </Link>
                  </Button>
                  <p className="micro-mono text-bone/50">{siteConfig.tagline}</p>
                </div>
              </Container>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
      </Container>
    </header>
  );
}
