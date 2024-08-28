import TimelinePage from '@/components/Timeline/TimelinePage';

export async function generateMetadata() {
  return {
    title: 'Timeline',
  };
}

export default function Timeline({
  params,
}: {
  params: { projectId: string };
}) {
  return (
    <div>
      <TimelinePage params={params} />
    </div>
  );
}
