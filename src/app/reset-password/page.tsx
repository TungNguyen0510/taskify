import ResetPasswordPage from '@/components/Auth/ResetPassword/ResetPasswordPage';

export async function generateMetadata() {
  return {
    title: 'Reset password - Taskify',
    description: 'Reset password - Taskify',
  };
}

export default function ResetPassword() {
  return <ResetPasswordPage />;
}
