'use client';

import { Divider } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import Icon from '@/components/Icon';
import { useProjectsStore } from '@/stores/projects';

const tabs = [
  {
    name: 'Board',
    icon: 'board',
    link: 'board',
  },
  {
    name: 'List',
    icon: 'list',
    link: 'list',
  },
  {
    name: 'Backlog',
    icon: 'backlog',
    link: 'backlog',
  },
];

const ProjectLayout = (props: {
  children: React.ReactNode;
  params: { projectId: string };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const lastRoute = pathParts[pathParts.length - 1];

  const handleChangeTab = (link: string) => {
    router.push(`/u/project/${props.params.projectId}/${link}`);
  };

  const session = useSession();

  const { currentProject, fetchCurrentProject } = useProjectsStore();

  useEffect(() => {
    fetchCurrentProject(props.params.projectId);
  }, [props.params.projectId, fetchCurrentProject]);

  return (
    <div className="flex">
      <div className="min-h-[calc(100vh-56px)] w-64 min-w-64 border-r-2 bg-white">
        {tabs.map((tab: any) => (
          <div key={tab.name} className="flex h-12 items-center px-4">
            <div
              className={`flex w-full cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-blue-100 ${lastRoute === tab.link ? 'bg-blue-100 text-blue-500' : ''}`}
              onClick={() => handleChangeTab(tab.link)}
              aria-hidden="true"
            >
              {lastRoute === tab.link ? (
                <div className="absolute left-4 h-6 w-1 rounded-r-lg bg-blue-500" />
              ) : null}
              <Icon name={tab.icon} />
              <span className="text-nowrap">{tab.name}</span>
            </div>
          </div>
        ))}

        {session.data?.user.id === currentProject.owner ? (
          <div className="mt-20">
            <Divider className="mx-4 my-2 w-[calc(100%-2rem)]" />
            <div className="flex h-12 items-center px-4">
              <div
                className={`flex w-full cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-blue-100 ${lastRoute === `settings` ? 'bg-blue-100 text-blue-500' : ''}`}
                onClick={() =>
                  router.push(`/u/project/${props.params.projectId}/settings`)
                }
                aria-hidden="true"
              >
                {lastRoute === `settings` ? (
                  <div className="absolute left-4 h-6 w-1 rounded-r-lg bg-blue-500" />
                ) : null}
                <Icon name="setting" />
                <span className="text-nowrap">Project settings</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="overflow-hidden p-4">{props.children}</div>
    </div>
  );
};

export { ProjectLayout };
