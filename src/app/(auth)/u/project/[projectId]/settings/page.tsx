import ProjectSettingsPage from '@/components/Settings/ProjectSettingsPage';

export async function generateMetadata() {
  return {
    title: 'Project Settings',
  };
}

export default function ListPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <ProjectSettingsPage params={params} />
    </div>
  );
}
