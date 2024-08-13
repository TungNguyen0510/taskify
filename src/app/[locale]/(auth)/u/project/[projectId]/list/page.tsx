import { getTranslations } from 'next-intl/server';

import ListTasks from '@/components/List/ListTasks';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'List',
  });

  return {
    title: t('meta_title'),
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
