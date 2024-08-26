import ProjectSettingsPage from '@/components/Settings/ProjectSettingsPage';

export async function generateMetadata() {
  return {
    title: 'Project Settings',
  };
}

export default function SettingPage({
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
