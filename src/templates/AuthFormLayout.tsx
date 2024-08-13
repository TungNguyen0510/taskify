'use client';

import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import LocaleSwitcher from '@/components/LocaleSwitcher';
import { AppConfig } from '@/utils/AppConfig';

function AuthFormLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('AuthFormLayout');

  const route = useRouter();

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-cyan-200 to-indigo-600 p-4">
      <Button
        color="primary"
        variant="shadow"
        className="absolute left-6 top-6"
        onClick={() => route.back()}
      >
        Back
      </Button>

      <div className="hidden flex-col items-center gap-4 p-6 sm:flex sm:w-1/2">
        <div className="flex items-center gap-2">
          <Image
            priority
            src="/assets/images/logo.png"
            width={48}
            height={48}
            alt="Logo"
            className="size-12"
          />
          <div className="text-4xl font-bold text-white xl:text-6xl">
            {AppConfig.name}
          </div>
        </div>

        <p className="text-wrap font-semibold">{t('taskify_description')}</p>
      </div>
      <div className="mx-auto flex min-h-screen w-[450px] flex-col justify-center sm:w-3/5 md:w-1/2">
        <div className="absolute top-8 flex w-full max-w-[450px] justify-end">
          <LocaleSwitcher />
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthFormLayout;
