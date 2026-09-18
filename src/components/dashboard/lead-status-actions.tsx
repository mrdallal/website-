"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/form-field";
import { convertLeadAction, deleteLeadAction, setLeadStatusAction } from "@/app/dashboard/leads/actions";
import { leadStatusValues } from "@/lib/validation/lead";
import { humanize } from "@/lib/utils";

interface LeadStatusActionsProps {
  leadId: string;
  status: string;
  converted: boolean;
  isAdmin: boolean;
}

const quickActions: { label: string; status: string; hideWhen: string[] }[] = [
  { label: "Mark contacted", status: "CONTACTED", hideWhen: ["CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"] },
  { label: "Qualify", status: "QUALIFIED", hideWhen: ["QUALIFIED", "PROPOSAL", "WON", "LOST"] },
  { label: "Move to proposal", status: "PROPOSAL", hideWhen: ["PROPOSAL", "WON", "LOST"] },
  { label: "Mark won", status: "WON", hideWhen: ["WON"] },
  { label: "Mark lost", status: "LOST", hideWhen: ["LOST"] },
];

export function LeadStatusActions({ leadId, status, converted, isAdmin }: LeadStatusActionsProps) {
  const [pending, startTransition] = React.useTransition();
  const [confirm, setConfirm] = React.useState<null | "lost" | "delete" | "convert">(null);

  const setStatus = (next: string) => {
    startTransition(async () => {
      const result = await setLeadStatusAction(leadId, next);
      if (result.ok) toast.success(`Status set to ${humanize(next)}.`);
      else toast.error(result.message);
      setConfirm(null);
    });
  };

  const remove = () => {
    startTransition(async () => {
      const result = await deleteLeadAction(leadId);
      if (!result.ok) {
        toast.error(result.message);
        setConfirm(null);
      }
    });
  };

  const convert = () => {
    startTransition(async () => {
      const result = await convertLeadAction(leadId);
      if (!result.ok) {
        toast.error(result.message);
        setConfirm(null);
      }
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {quickActions
          .filter((a) => !a.hideWhen.includes(status))
          .map((action) => (
            <Button
              key={action.status}
              size="sm"
              variant={action.status === "LOST" ? "outline" : action.status === "WON" ? "lime" : "primary"}
              disabled={pending}
              onClick={() => (action.status === "LOST" ? setConfirm("lost") : setStatus(action.status))}
            >
              {action.label}
            </Button>
          ))}
      </div>

      <div className="flex flex-col gap-3 border-t border-bone/10 pt-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="lead-status-select" className="micro-mono mb-2 block text-mute">
            Set any status
          </label>
          <Select
            id="lead-status-select"
            value={status}
            disabled={pending}
            onChange={(e) => (e.target.value === "LOST" ? setConfirm("lost") : setStatus(e.target.value))}
            className="h-10"
          >
            {leadStatusValues.map((s) => (
              <option key={s} value={s}>
                {humanize(s)}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          {!converted ? (
            <Button size="sm" variant="outline" disabled={pending} onClick={() => setConfirm("convert")}>
              Convert to client
            </Button>
          ) : null}
          {isAdmin ? (
            <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10" disabled={pending} onClick={() => setConfirm("delete")}>
              Delete lead
            </Button>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "lost"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Mark this lead as lost?"
        description="The lead stays in the database for reporting. You can change the status again later."
        confirmLabel="Mark lost"
        loading={pending}
        onConfirm={() => setStatus("LOST")}
      />
      <ConfirmDialog
        open={confirm === "delete"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Delete this lead permanently?"
        description="This removes the lead and its activity history. This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={pending}
        onConfirm={remove}
      />
      <ConfirmDialog
        open={confirm === "convert"}
        onOpenChange={(open) => !open && setConfirm(null)}
        title="Convert to client?"
        description="Creates a client record linked to this lead so projects can be attached to it."
        confirmLabel="Create client"
        loading={pending}
        onConfirm={convert}
      />
    </div>
  );
}
