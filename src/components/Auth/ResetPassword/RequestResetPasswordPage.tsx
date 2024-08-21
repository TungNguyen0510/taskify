import AuthFormLayout from '@/templates/AuthFormLayout';

import RequestResetPasswordForm from './RequestResetPasswordForm';

export default async function ResetPasswordPage() {
  return (
    <AuthFormLayout>
      <RequestResetPasswordForm />
    </AuthFormLayout>
  );
}
