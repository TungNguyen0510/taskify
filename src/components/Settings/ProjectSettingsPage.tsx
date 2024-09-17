/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { Button, Tab, Tabs } from '@nextui-org/react';
import { notFound, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { getUserRole } from '@/utils/Helpers';

import ConfirmModal from '../Modal/ConfirmModal';
import ProjectSettingsAccess from './ProjectSettingsAccess';
import ProjectSettingsDetail from './ProjectSettingsDetail';

function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const { currentProject, fetchCurrentProject, deleteProject } =
    useProjectsStore();

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

  const [isConfirmDeleteProject, setIsConfirmDeleteProject] = useState(false);

  const router = useRouter();
  const deleteCurrentProject = async () => {
    await deleteProject(params.projectId);

    toast.success('Deleted project successfully!', {
      position: 'bottom-left',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

    router.push('/u/your-work');
  };

  return (
    <div>
      {currentProject && (
        <div className="w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)] px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-xl font-semibold">Settings</div>
            <Button
              color="danger"
              onClick={() => setIsConfirmDeleteProject(true)}
            >
              Delete project
            </Button>
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

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm delete project"
        comfirmMessage="Are you sure you want to delete this project?. All data will be deleted and cannot be recovered."
        okTitle="Delete"
        isOpen={isConfirmDeleteProject}
        onClose={() => setIsConfirmDeleteProject(false)}
        onConfirm={() => {
          deleteCurrentProject();
          setIsConfirmDeleteProject(false);
        }}
      />
    </div>
  );
}

export default ProjectSettingsPage;
