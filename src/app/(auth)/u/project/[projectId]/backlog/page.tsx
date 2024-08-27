import BacklogPage from '@/components/Backlog/BacklogPage';

export async function generateMetadata() {
  return {
    title: 'Backlog',
  };
}

export default function Backlog({ params }: { params: { projectId: string } }) {
  return (
    <div>
      <BacklogPage params={params} />
    </div>
  );
}
