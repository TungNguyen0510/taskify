import SignUpPage from '@/components/Auth/SignUp/SignUpPage';

export async function generateMetadata() {
  return {
    title: 'Sign Up - Taskify',
    description: 'Sign up for Taskify',
  };
}

export default function Login() {
  return <SignUpPage />;
}
