import { getTranslations } from 'next-intl/server';

import SignUpPage from '@/components/Auth/SignUp/SignUpPage';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Login() {
  return <SignUpPage />;
}
