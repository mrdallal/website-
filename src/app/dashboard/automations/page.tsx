import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { describeAutomations } from "@/lib/services/automations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export const metadata: Metadata = { title: "Automations" };

const pipeline = ["Lead created", "Save to database", "Create GHL contact", "Create opportunity", "Notify team", "Confirm to lead", "Follow-up workflow (GHL)"];

export default async function AutomationsPage() {
  await requireUser();
  const automations = await describeAutomations();
  const configured = automations.filter((a) => a.configured).length;

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Automations"
        description="What happens automatically when a lead arrives. Each step is isolated: if one integration fails, the rest still run and the lead is always saved first."
        actions={
          <Badge tone={configured === automations.length ? "ok" : "muted"} dot>
            {configured}/{automations.length} active
          </Badge>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Lead pipeline" eyebrow="Order of execution">
          <ol className="space-y-2">
            {pipeline.map((step, i) => (
              <li key={step} className="flex flex-col">
                <div className={i === 0 ? "border border-bone/30 bg-ink px-3 py-2 text-sm font-semibold text-bone" : i === 1 ? "border border-lime bg-lime px-3 py-2 text-sm font-semibold text-ink" : "border border-bone/20 px-3 py-2 text-sm"}>
                  {step}
                </div>
                {i < pipeline.length - 1 ? <ArrowDown aria-hidden="true" className="mx-auto my-1 size-4 text-mute" /> : null}
              </li>
            ))}
          </ol>
        </DashboardCard>

        <DashboardCard title="Steps" eyebrow="Configured from environment and settings" padded={false} className="xl:col-span-2">
          <ul className="divide-y divide-bone/10">
            {automations.map((a) => (
              <li key={a.id} className="grid gap-2 px-5 py-4 md:grid-cols-12 md:items-center">
                <div className="md:col-span-7">
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-mute">{a.description}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="micro-mono text-mute">Trigger</p>
                  <p className="text-xs">{a.trigger}</p>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <Badge tone={a.configured ? "ok" : "muted"} dot>
                    {a.configured ? "Active" : "Off"}
                  </Badge>
                  {!a.configured ? <p className="mt-1 text-[11px] text-mute">Needs: {a.requirement}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard title="Adding more" eyebrow="Architecture" className="xl:col-span-3">
          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <p className="font-semibold">Integration layer</p>
              <p className="mt-1 text-mute">
                GHL, email and analytics sit behind service modules in <code className="font-mono text-[11px]">src/lib/integrations</code>. Credentials only exist in environment variables.
              </p>
            </div>
            <div>
              <p className="font-semibold">Steps are functions</p>
              <p className="mt-1 text-mute">
                Each automation is a small function in <code className="font-mono text-[11px]">src/lib/services/automations.ts</code>. Add a step, and it is logged to the lead timeline automatically.
              </p>
            </div>
            <div>
              <p className="font-semibold">Queues later</p>
              <p className="mt-1 text-mute">Steps run after the response is sent. When volume grows, the same functions can be dispatched to a queue or background worker without changes to the website.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-bone/10 pt-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/settings">Configure settings</Link>
            </Button>
          </div>
        </DashboardCard>
      </div>
    </>
  );
}
