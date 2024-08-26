import TaskPage from '@/components/Task/TaskPage';

export async function generateMetadata() {
  return {
    title: 'Task Page - Taskify',
  };
}

export default function SettingPage({
  params,
}: {
  params: { projectId: string; taskId: string };
}) {
  return (
    <div>
      <TaskPage params={params} />
    </div>
  );
}
