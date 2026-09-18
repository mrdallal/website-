import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getClientById } from "@/lib/services/clients";
import { isAppError } from "@/lib/errors";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ClientForm } from "@/components/dashboard/client-form";

export const metadata: Metadata = { title: "Edit client" };

export default async function EditClientPage({ params }: PageProps<"/dashboard/clients/[id]/edit">) {
  await requireUser();
  const { id } = await params;
  let client;
  try {
    client = await getClientById(id);
  } catch (error) {
    if (isAppError(error) && error.status === 404) notFound();
    throw error;
  }

  return (
    <>
      <PageHeader backHref={`/dashboard/clients/${client.id}`} backLabel="Back to client" eyebrow="Edit" title={client.name} />
      <DashboardCard className="max-w-3xl">
        <ClientForm
          mode="edit"
          client={{
            id: client.id,
            name: client.name,
            company: client.company,
            email: client.email,
            website: client.website,
            status: client.status,
            notes: client.notes,
          }}
        />
      </DashboardCard>
    </>
  );
}
