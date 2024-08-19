import YourWorkPage from '@/components/YourWork/YourWorkPage';

export async function generateMetadata() {
  return {
    title: 'Your work - Taskify',
  };
}

export default function YourWork() {
  return (
    <div>
      <YourWorkPage />
    </div>
  );
}
