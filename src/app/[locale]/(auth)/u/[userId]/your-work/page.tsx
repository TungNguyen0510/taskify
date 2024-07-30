import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'YourWork',
  });

  return {
    title: t('meta_title'),
  };
}

export default function YourWorkPage() {
  return <div>Your work</div>;
}
