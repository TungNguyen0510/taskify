'use client';

import { useAuth } from '@clerk/nextjs';
import { Divider } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { useProjectsStore } from '@/stores/projects';
import { resetAllStores } from '@/utils/Helpers';

import ProjectCard from './ProjectCard';

function YourWorkPage() {
  const t = useTranslations('YourWork');

  const { projects, fetchListProjects } = useProjectsStore();
  const { userId } = useAuth();

  useEffect(() => {
    resetAllStores();
    if (userId) {
      fetchListProjects(userId);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] p-6">
      {projects && (
        <div>
          <div className="pb-4 text-2xl font-semibold">
            {t('your_projects')}
          </div>
          <Divider />
          <div className="flex flex-wrap gap-4 p-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default YourWorkPage;
