'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import { AppConfig } from '@/utils/AppConfig';

function AuthFormLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  return (
    <div className="relative flex h-screen items-center justify-center bg-gradient-to-r from-cyan-200 to-indigo-600 p-4">
      <Button
        color="primary"
        variant="ghost"
        className="absolute left-6 top-6"
        onClick={() => route.back()}
      >
        Back
      </Button>

      <div className="hidden flex-col items-center gap-4 p-6 sm:flex sm:w-1/2">
        <div className="flex items-center gap-2">
          <div className="text-4xl font-bold text-white xl:text-6xl">
            {AppConfig.name}
          </div>
        </div>

        <p className="text-wrap font-semibold">
          The only project management tool you need to plan and track work
          across every team.
        </p>
      </div>
      <div className="mx-auto flex min-h-screen w-[450px] flex-col justify-center sm:w-3/5 md:w-1/2">
        {children}
      </div>
    </div>
  );
}

export default AuthFormLayout;
