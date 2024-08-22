'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useProjectsStore } from '@/stores/projects';

import ProjectSettingsAccess from './ProjectSettingsAccess';
import ProjectSettingsDetail from './ProjectSettingsDetail';

function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const { currentProject, fetchCurrentProject } = useProjectsStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentProject(params.projectId);
    };
    fetchData();
  }, [params.projectId]);

  const session = useSession();

  if (session.data?.user.id !== currentProject?.owner) {
    return notFound();
  }

  return (
    <div>
      {currentProject && (
        <div className="w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)]">
          <div className="h-20 px-6">
            {currentProject?.name && (
              <div className="text-xl font-semibold">
                {currentProject?.name} Settings
              </div>
            )}
          </div>

          <div className="flex w-full flex-col">
            <Tabs
              aria-label="Settings"
              color="primary"
              variant="underlined"
              classNames={{
                tabList:
                  'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                cursor: 'w-full bg-[#3b82f6]',
                tab: 'max-w-fit px-0 h-12',
                tabContent: 'group-data-[selected=true]:text-[#3b82f6]',
              }}
            >
              <Tab key="details" title="Details">
                <div className="mt-10">
                  <ProjectSettingsDetail params={params} />
                </div>
              </Tab>
              <Tab key="access" title="Access">
                <div>
                  <ProjectSettingsAccess params={params} />
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSettingsPage;
