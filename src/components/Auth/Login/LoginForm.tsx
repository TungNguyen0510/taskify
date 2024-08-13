'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import AuthForm from '@/components/Auth/AuthForm';

interface Data {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const t = useTranslations('LoginForm');
  const router = useRouter();
  const [error, setError] = useState('');
  const handleFormSubmit = async (data: Data) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: `/`,
      redirect: false,
    });
    if (res?.error) {
      setError(res?.error);
    } else {
      router.push('/u/your-work');
    }
  };

  return (
    <AuthForm
      title={t('title')}
      error={error}
      onSubmit={handleFormSubmit}
      buttonText={t('buttonText')}
      linkDescription={t('linkDescription')}
      linkText={t('linkText')}
      linkHref="/sign-up"
      isFullForm={false}
    />
  );
}
