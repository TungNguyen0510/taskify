import HomePage from '@/components/HomePage';

export async function generateMetadata() {
  return {
    title: 'Taskify',
    description: 'Taskify is a website that helps with project management.',
  };
}

export default function Index() {
  return <HomePage />;
}
