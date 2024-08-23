import { Suspense } from 'react';

import AuthFormLayout from '@/templates/AuthFormLayout';

import AcceptInviteForm from './AcceptInviteForm';

export default async function LoginPage() {
  return (
    <AuthFormLayout>
      <Suspense>
        <AcceptInviteForm />
      </Suspense>
    </AuthFormLayout>
  );
}
