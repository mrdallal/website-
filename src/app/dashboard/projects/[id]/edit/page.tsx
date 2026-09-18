import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getProjectById } from "@/lib/services/projects";
import { listClientOptions } from "@/lib/services/clients";
import { listTeamMembers } from "@/lib/services/users";
import { isAppError } from "@/lib/errors";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { ProjectForm } from "@/components/dashboard/project-form";

export const metadata: Metadata = { title: "Edit project" };

export default async function EditProjectPage({ params }: PageProps<"/dashboard/projects/[id]/edit">) {
  await requireUser();
  const { id } = await params;
  let project;
  try {
    project = await getProjectById(id);
  } catch (error) {
    if (isAppError(error) && error.status === 404) notFound();
    throw error;
  }
  const [clients, team] = await Promise.all([listClientOptions(), listTeamMembers()]);

  return (
    <>
      <PageHeader backHref={`/dashboard/projects/${project.id}`} backLabel="Back to project" eyebrow="Edit" title={project.name} />
      <DashboardCard className="max-w-4xl">
        <ProjectForm
          mode="edit"
          project={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            description: project.description,
            category: project.category,
            status: project.status,
            featured: project.featured,
            image: project.image,
            notes: project.notes,
            deadline: project.deadline,
            clientId: project.clientId,
            ownerId: project.ownerId,
          }}
          clients={clients}
          team={team.map((m) => ({ id: m.id, name: m.name }))}
        />
      </DashboardCard>
    </>
  );
}
