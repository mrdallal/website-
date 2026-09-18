import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { services } from "@/content/services";
import { caseStudies } from "@/content/projects";
import { faqs } from "@/content/faqs";
import { processSteps } from "@/content/process";
import { siteConfig } from "@/content/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Content" };

const sources = [
  { label: "Site settings & navigation", file: "src/content/site.ts", count: `${siteConfig.name} · ${siteConfig.url}` },
  { label: "Homepage copy", file: "src/content/home.ts", count: "Hero, problem, system, CTA" },
  { label: "Services", file: "src/content/services.ts", count: `${services.length} services` },
  { label: "Case studies", file: "src/content/projects.ts", count: `${caseStudies.length} entries` },
  { label: "FAQ", file: "src/content/faqs.ts", count: `${faqs.length} questions` },
  { label: "Process", file: "src/content/process.ts", count: `${processSteps.length} steps` },
  { label: "About page", file: "src/content/about.ts", count: "Pillars, beliefs, stack" },
];

export default async function ContentPage() {
  await requireUser();
  const placeholders = caseStudies.filter((c) => c.placeholder);

  return (
    <>
      <PageHeader
        eyebrow="Website"
        title="Content"
        description="Marketing copy lives in typed content files, separate from components. Edit the file, commit, deploy. A CMS can replace these files later without touching the pages."
        actions={
          <Button asChild size="sm" variant="outline" withArrow>
            <Link href="/" target="_blank" rel="noreferrer">
              View site
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Content sources" eyebrow="Where copy lives" padded={false} className="xl:col-span-2">
          <ul className="divide-y divide-bone/10">
            {sources.map((s) => (
              <li key={s.file} className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-mute">{s.count}</p>
                </div>
                <code className="font-mono text-[11px] text-mute">{s.file}</code>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="Placeholders to replace" eyebrow="Before launch">
          <ul className="space-y-3">
            {placeholders.map((c) => (
              <li key={c.slug} className="flex items-start justify-between gap-3 text-sm">
                <span>
                  {c.title}
                  <span className="block text-xs text-mute">/case-studies/{c.slug}</span>
                </span>
                <Badge tone="lime">Placeholder</Badge>
              </li>
            ))}
            <li className="flex items-start justify-between gap-3 text-sm">
              <span>
                Contact email
                <span className="block text-xs text-mute">{siteConfig.contactEmail}</span>
              </span>
              <Badge tone="lime">Placeholder</Badge>
            </li>
            <li className="flex items-start justify-between gap-3 text-sm">
              <span>
                Client logos / social links
                <span className="block text-xs text-mute">Capability band is shown until real logos exist.</span>
              </span>
              <Badge tone="muted">Not set</Badge>
            </li>
          </ul>
        </DashboardCard>

        <DashboardCard title="Public pages" eyebrow="Routes" padded={false} className="xl:col-span-3">
          <ul className="grid divide-y divide-bone/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
            {[
              { href: "/", label: "Home" },
              { href: "/services", label: "Services" },
              { href: "/work", label: "Work" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact / lead form" },
              ...caseStudies.map((c) => ({ href: `/case-studies/${c.slug}`, label: `Case study: ${c.title}` })),
            ].map((route) => (
              <li key={route.href} className="border-b border-bone/10 px-5 py-3 sm:border-r">
                <Link href={route.href} target="_blank" rel="noreferrer" className="text-sm font-semibold hover:underline">
                  {route.label}
                </Link>
                <p className="font-mono text-[11px] text-mute">{route.href}</p>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </>
  );
}
