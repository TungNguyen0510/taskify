import { getTranslations } from 'next-intl/server';

import KanbanBoard from '@/components/Board/KanbanBoard';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Board',
  });

  return {
    title: t('meta_title'),
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
