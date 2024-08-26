/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */

'use client';

import { Button, Divider } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { resetAllStores } from '@/utils/Helpers';

import CreateProjectModal from '../Modal/CreateProjectModal';
import ProjectCard from './ProjectCard';

function YourWorkPage() {
  const session = useSession();

  const userId = session.data?.user.id;

  const { projects, fetchListProjects } = useProjectsStore();

  const { fetchListUsers } = useUsersStore();

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    resetAllStores();
    if (userId) {
      fetchListProjects(userId);
    }
    fetchListUsers();
  }, []);

  const ownedProjects = projects.filter((project) => project.owner === userId);
  const notOwnedProjects = projects.filter(
    (project) => project.owner !== userId,
  );

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

            <div>
              {ownedProjects.length > 0 ? (
                <div className="scrollbar-1 flex gap-4 overflow-x-auto p-6">
                  {ownedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-20 items-center justify-center">
                  You don't have any projects yet.
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="pb-4 text-2xl font-semibold">Other projects</div>
            </div>
            <Divider />
            <div>
              {notOwnedProjects.length > 0 ? (
                <div className="scrollbar-1 flex gap-4 overflow-x-auto p-6">
                  {notOwnedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex h-full min-h-20 items-center justify-center">
                  You are not invited to any project.
                </div>
              )}
            </div>
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
