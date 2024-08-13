import AuthFormLayout from '@/templates/AuthFormLayout';

import SignUpForm from './SignUpForm';

export default async function SignUpPage() {
  return (
    <AuthFormLayout>
      <SignUpForm />
    </AuthFormLayout>
  );
}
