import AuthFormLayout from '@/templates/AuthFormLayout';

import ResetPasswordForm from './ResetPasswordForm';

export default async function ResetPasswordPage() {
  return (
    <AuthFormLayout>
      <ResetPasswordForm />
    </AuthFormLayout>
  );
}
