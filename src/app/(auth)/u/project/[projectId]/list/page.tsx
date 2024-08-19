import ListTasks from '@/components/List/ListTasks';

export async function generateMetadata() {
  return {
    title: 'List',
  };
}

export default function ListPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <ListTasks params={params} />
    </div>
  );
}
