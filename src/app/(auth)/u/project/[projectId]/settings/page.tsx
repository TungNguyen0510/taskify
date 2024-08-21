import SettingsPage from '@/components/Settings/SettingsPage';

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
      <SettingsPage params={params} />
    </div>
  );
}
