import ProfilePage from '@/components/Profile/ProfilePage';

export async function generateMetadata() {
  return {
    title: 'Profile - Taskify',
  };
}

export default function Profile() {
  return (
    <div>
      <ProfilePage />
    </div>
  );
}
