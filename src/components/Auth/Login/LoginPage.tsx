import AuthFormLayout from '@/templates/AuthFormLayout';

import LoginForm from './LoginForm';

export default async function LoginPage() {
  return (
    <AuthFormLayout>
      <LoginForm />
    </AuthFormLayout>
  );
}
