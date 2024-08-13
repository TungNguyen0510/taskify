/* eslint-disable no-console */

'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { register } from '@/libs/directus';

import AuthForm from '../AuthForm';

interface Data {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

function SignUpForm() {
  const t = useTranslations('SignUpForm');
  // const router = useRouter();
  // const [error, setError] = useState('');
  const handleFormSubmit = async (data: Data) => {
    const response = await register(data);
    console.log(response);
  };

  return (
    <AuthForm
      error=""
      title={t('title')}
      onSubmit={handleFormSubmit}
      buttonText={t('buttonText')}
      linkDescription={t('linkDescription')}
      linkText={t('linkText')}
      linkHref="/login"
    />
  );
}

export default SignUpForm;
