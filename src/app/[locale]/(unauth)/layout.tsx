import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import { MainLayout } from '@/templates/MainLayout';
import { AppConfig } from '@/utils/AppConfig';

export default function Layout(props: { children: React.ReactNode }) {
  const t = useTranslations('RootLayout');

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
            href="/about/"
            className="font-semibold text-black hover:text-blue-500"
          >
            {t('about_link')}
          </Link>
        </>
      }
      rightNav={
        <>
          <Link href="/sign-in/">
            <Button
              variant="light"
              className="font-semibold text-black hover:text-blue-500"
            >
              {t('sign_in_link')}
            </Button>
          </Link>

          <Link href="/sign-up/">
            <Button color="primary" className="font-semibold">
              {t('sign_up_link')}
            </Button>
          </Link>

          <LocaleSwitcher />
        </>
      }
    >
      <div>{props.children}</div>
    </MainLayout>
  );
}
