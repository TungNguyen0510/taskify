import { SignedIn, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import { MainLayout } from '@/templates/MainLayout';
import { AppConfig } from '@/utils/AppConfig';

export default function AppLayout(props: { children: React.ReactNode }) {
  const { userId } = auth();
  const t = useTranslations('YourWork');
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
            href={`/u/${userId}/your-work`}
            className="font-semibold text-black hover:text-primary-10"
          >
            {t('your_work')}
          </Link>
        </>
      }
      rightNav={
        <>
          <LocaleSwitcher />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </>
      }
    >
      {props.children}
    </MainLayout>
  );
}
