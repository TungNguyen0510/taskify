import Image from 'next/image';
import Link from 'next/link';

import UserArea from '@/components/UserArea';
import { MainLayout } from '@/templates/MainLayout';
import { AppConfig } from '@/utils/AppConfig';

export default function AppLayout(props: { children: React.ReactNode }) {
  return (
    <MainLayout
      leftNav={
        <>
          <Link
            href="/"
            className="flex items-center bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text pr-10 text-lg font-bold text-transparent hover:from-cyan-200 hover:to-fuchsia-500"
          >
            <Image
              priority
              src="/assets/images/logo.png"
              width={32}
              height={32}
              alt="Logo"
            />
            <span>{AppConfig.name}</span>
          </Link>

          <Link
            href="/u/your-work"
            className="font-semibold text-black hover:text-blue-500"
          >
            Your work
          </Link>
        </>
      }
      rightNav={<UserArea />}
    >
      {props.children}
    </MainLayout>
  );
}
