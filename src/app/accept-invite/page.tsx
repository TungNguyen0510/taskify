import AcceptInvitePage from '@/components/Auth/AcceptInvite/AcceptInvitePage';

export async function generateMetadata() {
  return {
    title: 'Accept invite - Taskify',
    description: 'Accept invite - Taskify',
  };
}

export default function AcceptInvite() {
  return <AcceptInvitePage />;
}
