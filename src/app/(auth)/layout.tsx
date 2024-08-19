import { getServerSession } from 'next-auth';

import { options } from '@/libs/auth/options';
import AppLayout from '@/templates/AppLayout';

export default async function AuthLayout(props: { children: React.ReactNode }) {
  const session = await getServerSession(options);

  return <AppLayout session={session}>{props.children}</AppLayout>;
}
