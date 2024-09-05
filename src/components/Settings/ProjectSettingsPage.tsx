/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { Tab, Tabs } from '@nextui-org/react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { getUserRole } from '@/utils/Helpers';

import ProjectSettingsAccess from './ProjectSettingsAccess';
import ProjectSettingsDetail from './ProjectSettingsDetail';

function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const { currentProject, fetchCurrentProject } = useProjectsStore();

  const { fetchListUsers } = useUsersStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchListUsers(),
        fetchCurrentProject(params.projectId),
      ]);
    };
    fetchData();
  }, [params.projectId]);

  const session = useSession();
  const userId = session?.data?.user.id;

  useEffect(() => {
    if (currentProject) {
      const currentRole = getUserRole(currentProject.project_members, userId);

      if (
        !currentRole ||
        (currentRole !== 'OWNER' && currentRole !== 'ADMIN')
      ) {
        return notFound();
      }
    }
  }, [currentProject, userId]);

  return (
    <div>
      {currentProject && (
        <div className="w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)] px-4">
          <div className="mb-8">
            <div className="text-xl font-semibold">Settings</div>
          </div>

          <div className="flex w-full flex-col">
            <Tabs
              aria-label="Settings"
              size="lg"
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
              <Tab key="details" title="Details" className="font-semibold">
                <div className="mt-10">
                  <ProjectSettingsDetail params={params} />
                </div>
              </Tab>
              <Tab key="access" title="Access" className="font-semibold">
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
