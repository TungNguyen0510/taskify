import DashboardPage from '@/components/Dashboard/DashboardPage';

export async function generateMetadata() {
  return {
    title: 'Dashboard',
  };
}

export default function BoardPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <DashboardPage params={params} />
    </div>
  );
}
