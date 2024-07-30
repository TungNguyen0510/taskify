import { getTranslations } from 'next-intl/server';

import { Hello } from '@/components/Hello';

export async function generateMetadata(props: {
  params: { locale: string; userId: string };
}) {
  const t = await getTranslations('App');

  return {
    title: t('meta_title', { userId: props.params.userId }),
  };
}

const App = ({ params }: { params: { userId: string } }) => (
  <div className="flex min-h-[calc(100vh-56px)] w-full flex-col px-4 [&_p]:my-6">
    {params.userId}
    <Hello />
  </div>
);

export default App;
