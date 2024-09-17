'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import UserArea from '@/components/UserArea';
import { MainLayout } from '@/templates/MainLayout';
import { AppConfig } from '@/utils/AppConfig';

export default function AppLayout(props: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const lastRoute = pathParts[pathParts.length - 1];

  return (
    <MainLayout
      leftNav={
        <>
          <Link
            href="/"
            className="flex items-center bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text pr-10 text-lg font-bold text-transparent hover:from-cyan-200 hover:to-fuchsia-500"
          >
            {/* <Image
              priority
              src="/assets/images/logo.png"
              width={32}
              height={32}
              alt="Logo"
            /> */}
            <span>{AppConfig.name}</span>
          </Link>

          <Link
            href="/u/your-work"
            className={`font-semibold text-black hover:text-blue-500 ${lastRoute === 'your-work' ? `text-blue-500` : ''}`}
          >
            Your work
          </Link>
          <Link
            href="/u/profile"
            className={`font-semibold text-black hover:text-blue-500 ${lastRoute === 'profile' ? `text-blue-500` : ''}`}
          >
            Profile
          </Link>
        </>
      }
      rightNav={<UserArea />}
    >
      {props.children}
    </MainLayout>
  );
}
