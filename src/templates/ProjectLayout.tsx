'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Icon from '@/components/Icon';

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
  const t = useTranslations('ProjectLayout');
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const lastRoute = pathParts[pathParts.length - 1];

  const handleChangeTab = (link: string) => {
    router.push(`/u/project/${props.params.projectId}/${link}`);
  };

  return (
    <div className="flex">
      <div className="min-h-[calc(100vh-56px)] w-64 border-r-2 bg-white">
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
              <span>{t(tab.name)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="overflow-hidden">{props.children}</div>
    </div>
  );
};

export { ProjectLayout };
