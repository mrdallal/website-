import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { listClientOptions } from "@/lib/services/clients";
import { listTeamMembers } from "@/lib/services/users";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ProjectForm } from "@/components/dashboard/project-form";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireUser();
  const [clients, team] = await Promise.all([listClientOptions(), listTeamMembers()]);

  return (
    <>
      <PageHeader backHref="/dashboard/projects" backLabel="All projects" eyebrow="Delivery" title="New project" description="Set up the project shell. Tasks, notes and files come next." />
      <DashboardCard className="max-w-4xl">
        <ProjectForm mode="create" clients={clients} team={team.map((m) => ({ id: m.id, name: m.name }))} />
      </DashboardCard>
    </>
  );
}
