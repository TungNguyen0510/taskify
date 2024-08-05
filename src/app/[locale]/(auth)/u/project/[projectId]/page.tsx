import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: {
  params: { locale: string; projectId: string };
}) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Project',
  });

  return {
    title: t('meta_title', { projectId: props.params.projectId }),
  };
}

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  return <div>Project : {params.projectId}</div>;
}
