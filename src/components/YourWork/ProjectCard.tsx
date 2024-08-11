import { Card } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard(props: ProjectCardProps) {
  const route = useRouter();

  const goToProject = (projectId: string) => {
    route.push(`/u/project/${projectId}/board`);
  };

  return (
    <Card
      className="flex min-h-52 min-w-64 flex-row overflow-hidden rounded-md"
      radius="sm"
    >
      <div className="h-full w-6 bg-blue-100" />
      <div className="h-full">
        <div
          className="p-2 font-semibold hover:underline"
          onClick={() => goToProject(props.project.id)}
          aria-hidden="true"
        >
          {props.project.title}
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;
