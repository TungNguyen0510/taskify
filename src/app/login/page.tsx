import LoginPage from '@/components/Auth/Login/LoginPage';

export async function generateMetadata() {
  return {
    title: 'Login - Taskify',
    description: 'Login to Taskify',
  };
}

export default function Login() {
  return <LoginPage />;
}
