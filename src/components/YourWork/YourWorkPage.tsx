/* eslint-disable react/no-unescaped-entities */

'use client';

import { Button, Divider } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useProjectsStore } from '@/stores/projects';
import { resetAllStores } from '@/utils/Helpers';

import CreateProjectModal from '../Modal/CreateProjectModal';
import ProjectCard from './ProjectCard';

function YourWorkPage() {
  const session = useSession();

  const userId = session.data?.user.id;

  const { projects, fetchListProjects } = useProjectsStore();

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    resetAllStores();
    if (userId) {
      fetchListProjects(userId);
    }
  }, []);

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] p-6">
        {projects && (
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="pb-4 text-2xl font-semibold">Your projects</div>
              <div>
                <Button
                  color="primary"
                  onClick={() => setIsCreatingProject(true)}
                >
                  Create project
                </Button>
              </div>
            </div>

            <Divider />
            {projects.length > 0 ? (
              <div className="scrollbar-1 flex gap-4 overflow-x-auto p-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-40 items-center justify-center">
                You don't have any projects yet.
              </div>
            )}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreatingProject}
        onClose={() => setIsCreatingProject(false)}
      />
    </>
  );
}

export default YourWorkPage;
