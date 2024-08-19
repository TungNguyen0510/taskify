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
      isHoverable
      className="flex min-h-52 min-w-64 max-w-64 flex-row overflow-hidden rounded-md"
      radius="sm"
    >
      <div className="h-full w-6 bg-blue-100" />
      <div className="h-full">
        <div
          className="flex w-full cursor-pointer flex-col p-2"
          onClick={() => goToProject(props.project.id)}
          aria-hidden="true"
        >
          <div className="select-none font-semibold hover:underline">
            {props.project.name}
          </div>
          <div className="line-clamp-2 max-w-full text-ellipsis text-xs text-gray-500">
            {props.project.description}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProjectCard;
