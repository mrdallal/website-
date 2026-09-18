"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteClientAction } from "@/app/dashboard/clients/actions";

export function ClientHeaderActions({ clientId, isAdmin }: { clientId: string; isAdmin: boolean }) {
  const [pending, startTransition] = React.useTransition();
  const [confirm, setConfirm] = React.useState(false);

  const remove = () => {
    startTransition(async () => {
      const result = await deleteClientAction(clientId);
      if (!result.ok) {
        toast.error(result.message);
        setConfirm(false);
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={`/dashboard/clients/${clientId}/edit`}>Edit</Link>
      </Button>
      {isAdmin ? (
        <Button size="sm" variant="ghost" className="text-danger hover:bg-danger/10" disabled={pending} onClick={() => setConfirm(true)}>
          Delete
        </Button>
      ) : null}
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Delete this client?"
        description="Projects stay in the system but are detached from this client. This cannot be undone."
        confirmLabel="Delete client"
        destructive
        loading={pending}
        onConfirm={remove}
      />
    </div>
  );
}
