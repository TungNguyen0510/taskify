'use client';

import { SessionProvider } from 'next-auth/react';

import Validate from '@/libs/auth/validate';

function AppLayout({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider session={session}>
      <Validate>{children}</Validate>
    </SessionProvider>
  );
}

export default AppLayout;
