import { getTranslations } from 'next-intl/server';

import LoginPage from '@/components/Auth/Login/LoginPage';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Login',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Login() {
  return <LoginPage />;
}
