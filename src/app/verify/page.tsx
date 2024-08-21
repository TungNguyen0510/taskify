import VerifyPage from '@/components/Auth/Verify/VerifyPage';

export async function generateMetadata() {
  return {
    title: 'Verify - Taskify',
    description: 'Verify new user for Taskify',
  };
}

export default function Verify() {
  return <VerifyPage />;
}
