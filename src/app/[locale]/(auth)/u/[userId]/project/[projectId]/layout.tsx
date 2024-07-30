import { ProjectLayout } from '@/templates/ProjectLayout';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectLayout>{children}</ProjectLayout>;
}
