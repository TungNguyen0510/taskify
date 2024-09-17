import { Button } from '@nextui-org/react';
import Link from 'next/link';

import { MainLayout } from '@/templates/MainLayout';
import { AppConfig } from '@/utils/AppConfig';

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <MainLayout
      leftNav={
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
      }
      rightNav={
        <>
          <Link href="/login/">
            <Button
              variant="light"
              className="font-semibold text-black hover:text-blue-500"
            >
              Log in
            </Button>
          </Link>

          <Link href="/sign-up/">
            <Button color="primary" className="font-semibold">
              Sign up
            </Button>
          </Link>
        </>
      }
    >
      <div>{props.children}</div>
    </MainLayout>
  );
}
