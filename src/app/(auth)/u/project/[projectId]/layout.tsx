import { ProjectLayout } from '@/templates/ProjectLayout';

export default function ProjectsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  return <ProjectLayout params={params}>{children}</ProjectLayout>;
}
