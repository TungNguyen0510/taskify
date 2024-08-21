import RequestResetPasswordPage from '@/components/Auth/ResetPassword/RequestResetPasswordPage';

export async function generateMetadata() {
  return {
    title: 'Request reset password - Taskify',
    description: 'Request reset password - Taskify',
  };
}

export default function RequestResetPassword() {
  return <RequestResetPasswordPage />;
}
