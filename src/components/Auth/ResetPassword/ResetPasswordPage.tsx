import { Suspense } from 'react';

import AuthFormLayout from '@/templates/AuthFormLayout';

import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage() {
  return (
    <AuthFormLayout>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthFormLayout>
  );
}
