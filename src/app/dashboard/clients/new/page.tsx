import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ClientForm } from "@/components/dashboard/client-form";

export const metadata: Metadata = { title: "New client" };

export default async function NewClientPage() {
  await requireUser();
  return (
    <>
      <PageHeader backHref="/dashboard/clients" backLabel="All clients" eyebrow="Relationships" title="New client" />
      <DashboardCard className="max-w-3xl">
        <ClientForm mode="create" />
      </DashboardCard>
    </>
  );
}
