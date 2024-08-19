import KanbanBoard from '@/components/Board/KanbanBoard';

export async function generateMetadata() {
  return {
    title: 'Board',
  };
}

export default function BoardPage({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <KanbanBoard params={params} />
    </div>
  );
}
