import { getTranslations } from 'next-intl/server';

import YourWorkPage from '@/components/YourWork/YourWorkPage';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'YourWork',
  });

  return {
    title: t('meta_title'),
  };
}

export default function YourWork() {
  return (
    <div>
      <YourWorkPage />
    </div>
  );
}
