import { getTranslations } from 'next-intl/server';

import { Hello } from '@/components/Hello';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'App',
  });

  return {
    title: t('meta_title'),
  };
}

const App = () => (
  <div className="flex min-h-[calc(100vh-56px)] w-full flex-col px-4 [&_p]:my-6">
    <Hello />
  </div>
);

export default App;
