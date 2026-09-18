import { Badge, type BadgeProps } from "@/components/ui/badge";
import { humanize } from "@/lib/utils";

type Tone = NonNullable<BadgeProps["tone"]>;

const toneMap: Record<string, Tone> = {
  // Lead
  NEW: "lime",
  CONTACTED: "info",
  QUALIFIED: "ok",
  PROPOSAL: "warn",
  WON: "ink",
  LOST: "muted",
  // Project
  DRAFT: "muted",
  ACTIVE: "lime",
  COMPLETED: "ink",
  ARCHIVED: "muted",
  // Task
  TODO: "neutral",
  IN_PROGRESS: "lime",
  REVIEW: "warn",
  DONE: "ink",
  // Priority
  LOW: "muted",
  MEDIUM: "neutral",
  HIGH: "danger",
  // Client
  PROSPECT: "info",
  INACTIVE: "muted",
  // Automations / integration
  done: "ok",
  skipped: "muted",
  failed: "danger",
  connected: "ok",
  "not-connected": "muted",
};

interface StatusBadgeProps extends Omit<BadgeProps, "tone"> {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label, ...props }: StatusBadgeProps) {
  return (
    <Badge tone={toneMap[status] ?? "neutral"} dot {...props}>
      {label ?? humanize(status)}
    </Badge>
  );
}
