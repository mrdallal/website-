import Link from "next/link";
import type { ActivityWithRelations } from "@/lib/services/activities";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative } from "@/lib/utils";
import { cn } from "@/lib/utils";

const typeTone: Record<string, string> = {
  LEAD_CREATED: "bg-lime",
  LEAD_STATUS_CHANGED: "bg-ink",
  NOTE: "bg-ash-2",
  INTEGRATION: "bg-ok",
  PROJECT_CREATED: "bg-ink",
  TASK_CREATED: "bg-bone/60",
};

interface ActivityFeedProps {
  items: (ActivityWithRelations | Omit<ActivityWithRelations, "lead" | "project">)[];
  showContext?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ActivityFeed({
  items,
  showContext = true,
  emptyTitle = "No activity yet.",
  emptyDescription = "Actions on leads, projects and tasks will show up here.",
}: ActivityFeedProps) {
  if (items.length === 0) {
    return <EmptyState compact title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <ol className="divide-y divide-bone/10">
      {items.map((item) => {
        const lead = "lead" in item ? item.lead : null;
        const project = "project" in item ? item.project : null;
        return (
          <li key={item.id} className="flex gap-3 py-3">
            <span aria-hidden="true" className={cn("mt-1.5 size-2 shrink-0", typeTone[item.type] ?? "bg-bone/40")} />
            <div className="min-w-0 flex-1">
              <p className="text-sm">{item.description}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-mute">
                <span>{formatRelative(item.createdAt)}</span>
                {item.actor ? <span>· {item.actor.name}</span> : <span>· System</span>}
                {showContext && lead ? (
                  <Link href={`/dashboard/leads/${lead.id}`} className="underline underline-offset-2 hover:text-lime">
                    · {lead.name}
                  </Link>
                ) : null}
                {showContext && project ? (
                  <Link href={`/dashboard/projects/${project.id}`} className="underline underline-offset-2 hover:text-lime">
                    · {project.name}
                  </Link>
                ) : null}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
